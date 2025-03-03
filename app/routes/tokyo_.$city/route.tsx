import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EvacueesChart, EvacueeGenderData } from "@/components/evacuees-chart";
import { SuppliesChart, BarChartData } from "@/components/supplies-chart";
import { useParams, useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { ClientOnly } from '@/components/client-only';
import { CityMap } from "./cityMap.client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// 物資ジャンルのマッピング
const genreMapping: Record<string, string> = {
  "食料": "食料",
  "水": "水",
  "衛生用品": "衛生用品",
  "寝具": "毛布",
  "医薬品": "医薬品",
};

// チャートの色設定
const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// 避難所の型定義
export type Shelter = {
  避難所_施設名称: string;
  地方公共団体コード: number;
  都道府県: string;
  指定市区町村名: string;
  所在地住所: string;
  緯度: number;
  経度: number;
  "エレベーター有/避難スペースが１階": string | null;
  スロープ等: string | null;
  点字ブロック: string | null;
  車椅子使用者対応トイレ: string | null;
  その他: string | null;
};

// Map of city name in URL to city name in JSON
const cityNameMap: Record<string, string> = {
  'chiyoda': '千代田区',
  'chuo': '中央区',
  'minato': '港区',
  'shinjuku': '新宿区',
  'bunkyo': '文京区',
  'taito': '台東区',
  'sumida': '墨田区',
  'koto': '江東区',
  'shinagawa': '品川区',
  'meguro': '目黒区',
  'ota': '大田区',
  'setagaya': '世田谷区',
  'shibuya': '渋谷区',
  'nakano': '中野区',
  'suginami': '杉並区',
  'toshima': '豊島区',
  'kita': '北区',
  'arakawa': '荒川区',
  'itabashi': '板橋区',
  'nerima': '練馬区',
  'adachi': '足立区',
  'katsushika': '葛飾区',
  'edogawa': '江戸川区',
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const cityParam = params.city || '';
  const cityNameInJapanese = cityNameMap[cityParam] || cityParam;
  
  // 避難所データの読み込み
  const sheltersUrl = new URL("/data/shelters.json", request.url);
  const sheltersResponse = await fetch(sheltersUrl.href);
  const shelters = await sheltersResponse.json();
  
  // 避難者データの読み込み
  const evacueeUrl = new URL("/data/json/evacuees.json", request.url);
  const evacueeResponse = await fetch(evacueeUrl.href);
  const allEvacuees = await evacueeResponse.json();
  
  // 物資データの読み込み
  const materialsDetailUrl = new URL("/data/json/materials_detail.json", request.url);
  const materialsDetailResponse = await fetch(materialsDetailUrl.href);
  const allMaterialsDetail = await materialsDetailResponse.json();
  
  // 避難所を市区町村でフィルタリング
  const filteredShelters = shelters.filter(
    (shelter: Shelter) => shelter.指定市区町村名 === cityNameInJapanese
  );
  
  // 避難所コードのリストを作成
  const shelterCodes = filteredShelters.map((shelter: Shelter) => {
    // 避難所コードを生成（例：S{地方公共団体コード}-{連番}）
    const cityCode = shelter.地方公共団体コード.toString();
    return `S${cityCode}-001`; // 実際のコードに合わせて調整が必要
  });
  
  // 避難者を市区町村の避難所でフィルタリング
  const filteredEvacuees = allEvacuees.filter((evacuee: any) => 
    shelterCodes.some((code: string) => evacuee.shelter_code.startsWith(code.substring(0, 7)))
  );
  
  // 物資を市区町村の避難所でフィルタリング
  const filteredMaterials = allMaterialsDetail.filter((material: any) => 
    shelterCodes.some((code: string) => material.shelter_code.startsWith(code.substring(0, 7)))
  );
  
  // 避難者の性別ごとの集計
  const genderCounts = {
    "男性": 0,
    "女性": 0,
    "その他": 0
  };
  
  filteredEvacuees.forEach((evacuee: any) => {
    if (evacuee.gender in genderCounts) {
      genderCounts[evacuee.gender as keyof typeof genderCounts]++;
    }
  });
  
  // 物資の不足状況を集計
  const suppliesShortage: Record<string, number> = {
    "食料": 0,
    "水": 0,
    "衛生用品": 0,
    "毛布": 0,
    "医薬品": 0
  };
  
  filteredMaterials.forEach((material: any) => {
    const genre = material.genre;
    if (genre in genreMapping) {
      const mappedGenre = genreMapping[genre];
      if (mappedGenre in suppliesShortage) {
        // 物資の不足状況を計算（例：必要量 - 現在量）
        // ここでは単純に各ジャンルの合計を集計
        suppliesShortage[mappedGenre] += 80; // 仮の必要量
      }
    }
  });
  
  return {
    shelters: filteredShelters,
    cityNameInJapanese,
    evacuees: {
      total: filteredEvacuees.length,
      byGender: [
        { name: "男性", value: genderCounts["男性"], fill: "var(--color-男性)" },
        { name: "女性", value: genderCounts["女性"], fill: "var(--color-女性)" },
        { name: "その他", value: genderCounts["その他"], fill: "var(--color-その他)" }
      ]
    },
    supplies: Object.entries(suppliesShortage).map(([item, shortage], index) => ({
      item,
      shortage,
      fill: chartColors[index % chartColors.length]
    }))
  };
};

export default function CityDashboard() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null);
  const params = useParams();
  const { shelters, cityNameInJapanese, evacuees, supplies } = useLoaderData<typeof loader>();
  const cityName = cityNameInJapanese || params.city || "世田谷区";

  return (
    <div className="w-full p-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-2xl font-bold" asChild>
              <Link to="/tokyo">東京都</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-2xl font-bold">{cityName} ダッシュボード</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex gap-4 h-[calc(100vh-7rem)]">
        <div className="basis-8/12 h-full">
          <Card className="h-full">
            <CardContent className="h-full p-0">
              <ClientOnly>
                <CityMap />
              </ClientOnly>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col basis-4/12 gap-4 h-full">
          <div className="h-1/2">
            <EvacueesChart 
              title={`避難者数`}
              data={evacuees.byGender}
              totalPeople={evacuees.total}
              setGender={setGender} 
            />
          </div>
          <div className="h-1/2">
            <SuppliesChart 
              title={`物資不足状況`}
              data={supplies} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
