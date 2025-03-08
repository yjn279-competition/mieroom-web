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

// ローダーの戻り値の型を定義
export type LoaderData = {
  shelters: Shelter[];
  cityNameInJapanese: string;
  evacuees: {
    total: number;
    byGender: EvacueeGenderData[];
  };
  supplies: BarChartData[];
};

export const loader: LoaderFunction = async ({ params, request }): Promise<LoaderData> => {
  const cityParam = params.city || '';
  const cityNameInJapanese = cityNameMap[cityParam] || cityParam;
  
  // 型定義
  interface Evacuee {
    my_number: string;
    family_name: string;
    given_name: string;
    gender: string;
    birth_date: string;
    address: string;
    phone_number: string;
    health_status: string;
  }

  interface EvacueeShelter {
    evacuee_id: string;
    shelter_id: number;
    created: string;
    updated: string;
  }

  interface Supply {
    supply_id: number;
    category: string;
    item_name: string;
    expiration_date: string;
    created_datetime: string;
    updated_datetime: string;
  }

  interface SupplyShelter {
    supply_id: number;
    shelter_id: number;
    quantity: number;
    created: string;
    updated: string;
  }
  
  // 避難所データの読み込み
  const sheltersUrl = new URL("/data/shelters.json", request.url);
  const sheltersResponse = await fetch(sheltersUrl.href);
  const shelters = await sheltersResponse.json() as Shelter[];
  
  // 避難者データの読み込み
  const evacueeUrl = new URL("/data/evacuees.json", request.url);
  const evacueeResponse = await fetch(evacueeUrl.href);
  const allEvacuees = await evacueeResponse.json() as Evacuee[];
  
  // 避難者-避難所の関連データの読み込み
  const evacueesShelterUrl = new URL("/data/evacuee_shelter.json", request.url);
  const evacueesShelterResponse = await fetch(evacueesShelterUrl.href);
  const allEvacueesShelter = await evacueesShelterResponse.json() as EvacueeShelter[];
  
  // 物資データの読み込み
  const suppliesUrl = new URL("/data/supplies.json", request.url);
  const suppliesResponse = await fetch(suppliesUrl.href);
  const allSupplies = await suppliesResponse.json() as Supply[];
  
  // 物資-避難所の関連データの読み込み
  const suppliesShelterUrl = new URL("/data/supply_shelter.json", request.url);
  const suppliesShelterResponse = await fetch(suppliesShelterUrl.href);
  const allSuppliesShelter = await suppliesShelterResponse.json() as SupplyShelter[];
  
  // 避難所を市区町村でフィルタリング
  const filteredShelters = shelters.filter(
    (shelter: Shelter) => shelter.指定市区町村名 === cityNameInJapanese
  );
  
  // 避難所IDのリストを作成
  const shelterIds = filteredShelters.map((shelter: Shelter) => {
    // 避難所IDを生成（例：地方公共団体コードを使用）
    return shelter.地方公共団体コード;
  });
  
  // 避難者-避難所の関連をフィルタリング
  const filteredEvacueesShelter = allEvacueesShelter.filter((es) => 
    shelterIds.includes(es.shelter_id)
  );
  
  // 避難者IDのリストを作成
  const evacueeIds = filteredEvacueesShelter.map((es) => es.evacuee_id);
  
  // 避難者をフィルタリング
  const filteredEvacuees = allEvacuees.filter((evacuee) => 
    evacueeIds.includes(evacuee.my_number)
  );
  
  // 物資-避難所の関連をフィルタリング
  const filteredSuppliesShelter = allSuppliesShelter.filter((ss) => 
    shelterIds.includes(ss.shelter_id)
  );
  
  // 物資IDのリストを作成
  const supplyIds = filteredSuppliesShelter.map((ss) => ss.supply_id);
  
  // 物資をフィルタリング
  const filteredSupplies = allSupplies.filter((supply) => 
    supplyIds.includes(supply.supply_id)
  );
  
  // 避難者の性別ごとの集計
  const genderCounts = {
    "男性": 0,
    "女性": 0,
    "その他": 0
  };
  
  filteredEvacuees.forEach((evacuee) => {
    if (evacuee.gender === "M") {
      genderCounts["男性"]++;
    } else if (evacuee.gender === "F") {
      genderCounts["女性"]++;
    } else {
      genderCounts["その他"]++;
    }
  });
  
  // 物資の不足状況を集計
  const suppliesShortage: Record<string, number> = {
    "飲料": 0,
    "食料": 0,
    "衛生用品": 0,
    "医薬品": 0,
    "生活必需品": 0,
    "その他": 0,
  };
  
  // カテゴリごとの物資数を集計
  const categoryQuantities: Record<string, number> = {};
  
  // 各物資の数量を集計
  filteredSupplies.forEach((supply) => {
    const category = supply.category;
    // 避難所ごとの物資数量を集計
    const supplyQuantities = filteredSuppliesShelter
      .filter((ss) => ss.supply_id === supply.supply_id)
      .reduce((total: number, ss) => total + ss.quantity, 0);
    
    if (!(category in categoryQuantities)) {
      categoryQuantities[category] = 0;
    }
    
    categoryQuantities[category] += supplyQuantities;
  });
  
  // 必要量と現在量の差を計算（仮の必要量を設定）
  Object.keys(suppliesShortage).forEach(category => {
    const requiredAmount = 5000; // 仮の必要量
    const currentAmount = categoryQuantities[category] || 0;
    suppliesShortage[category] = Math.max(0, requiredAmount - currentAmount);
  });
  
  return {
    shelters: filteredShelters,
    cityNameInJapanese,
    evacuees: {
      total: filteredEvacuees.length,
      byGender: [
        { name: "男性", value: genderCounts["男性"], fill: "hsl(var(--chart-1))" },
        { name: "女性", value: genderCounts["女性"], fill: "hsl(var(--chart-2))" },
        { name: "その他", value: genderCounts["その他"], fill: "hsl(var(--chart-3))" }
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
  const { shelters, cityNameInJapanese, evacuees, supplies } = useLoaderData<LoaderData>();
  const cityName = cityNameInJapanese || params.city || "世田谷区";
  
  console.log("Evacuees data:", evacuees);
  console.log("Evacuees by gender:", evacuees.byGender);

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
