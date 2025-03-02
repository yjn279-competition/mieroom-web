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
import fs from 'fs';
import path from 'path';

// Define the shelter type based on the JSON structure
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

export const loader: LoaderFunction = async ({ params }) => {
  const cityParam = params.city || '';
  const cityNameInJapanese = cityNameMap[cityParam] || cityParam;
  
  // Read the JSON file
  const jsonFilePath = path.join(process.cwd(), 'data', 'shelters.json');
  const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  
  // Parse the JSON
  const shelters = JSON.parse(fileContent);
  
  // Filter shelters by city
  const filteredShelters = shelters.filter(
    (shelter: Shelter) => shelter.指定市区町村名 === cityNameInJapanese
  );
  
  return { shelters: filteredShelters, cityNameInJapanese };
};

// Mock data for city level
const TOTAL_PEOPLE = 350;
const evacueesByGender: EvacueeGenderData[] = [
  { name: "男性", value: 85, fill: "var(--color-男性)" },
  { name: "女性", value: 110, fill: "var(--color-女性)" },
  { name: "その他", value: 55, fill: "var(--color-その他)" },
];

const suppliesShortageData: BarChartData[] = [
  { item: "食料", shortage: 300, fill: "hsl(var(--chart-1))" },
  { item: "水", shortage: 250, fill: "hsl(var(--chart-2))" },
  { item: "衛生用品", shortage: 180, fill: "hsl(var(--chart-3))" },
  { item: "毛布", shortage: 120, fill: "hsl(var(--chart-4))" },
  { item: "医薬品", shortage: 80, fill: "hsl(var(--chart-5))" },
];

export default function CityDashboard() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null);
  const params = useParams();
  const { shelters, cityNameInJapanese } = useLoaderData<typeof loader>();
  const cityName = cityNameInJapanese || params.city || "世田谷区";

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4">
        <Link to="/tokyo" className="hover:underline">東京都</Link>
        {' / '}
        <span>{cityName}</span>
        {' '}
        ダッシュボード
      </h1>
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
              data={evacueesByGender}
              totalPeople={TOTAL_PEOPLE}
              setGender={setGender} 
            />
          </div>
          <div className="h-1/2">
            <SuppliesChart 
              title={`物資不足状況`}
              data={suppliesShortageData} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
