import { useState } from 'react';
import type { LoaderFunction } from "@remix-run/node";
import { ClientOnly } from '@/components/client-only';
import { EvacueesChart, EvacueeGenderData } from "@/components/evacuees-chart";
import { SuppliesChart, BarChartData } from "@/components/supplies-chart";
import { TokyoMap } from "./tokyoMap.client";
import { useLoaderData } from "@remix-run/react";
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

// ローダーの戻り値の型を定義
type LoaderData = {
  geoJsonData: any;
  evacuees: {
    total: number;
    byGender: EvacueeGenderData[];
  };
  supplies: BarChartData[];
};

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  // GeoJSONデータの読み込み
  const geoJsonUrl = new URL("/data/tokyo.geojson", request.url);
  const geoJsonResponse = await fetch(geoJsonUrl.href);
  const geoJsonData = await geoJsonResponse.json();
  
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

  // 避難者データの読み込み
  const evacueeUrl = new URL("/data/evacuees.json", request.url);
  const evacueeResponse = await fetch(evacueeUrl.href);
  const evacuees = await evacueeResponse.json() as Evacuee[];
  
  // 避難者-避難所の関連データの読み込み
  const evacueesShelterUrl = new URL("/data/evacuee_shelter.json", request.url);
  const evacueesShelterResponse = await fetch(evacueesShelterUrl.href);
  const evacueesShelter = await evacueesShelterResponse.json() as EvacueeShelter[];
  
  // 物資データの読み込み
  const suppliesUrl = new URL("/data/supplies.json", request.url);
  const suppliesResponse = await fetch(suppliesUrl.href);
  const supplies = await suppliesResponse.json() as Supply[];
  
  // 物資-避難所の関連データの読み込み
  const suppliesShelterUrl = new URL("/data/supply_shelter.json", request.url);
  const suppliesShelterResponse = await fetch(suppliesShelterUrl.href);
  const suppliesShelter = await suppliesShelterResponse.json() as SupplyShelter[];
  
  // 避難者の性別ごとの集計
  const genderCounts = {
    "男性": 0,
    "女性": 0,
    "その他": 0
  };
  
  evacuees.forEach((evacuee) => {
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
  supplies.forEach((supply) => {
    const category = supply.category;
      
    // 避難所ごとの物資数量を集計
    const supplyQuantities = suppliesShelter
      .filter((ss) => ss.supply_id === supply.supply_id)
      .reduce((total: number, ss) => total + ss.quantity, 0);
    
    if (!(category in categoryQuantities)) {
      categoryQuantities[category] = 0;
    }
    
    categoryQuantities[category] += supplyQuantities;
  });
  
  // 必要量と現在量の差を計算（仮の必要量を設定）
  Object.keys(suppliesShortage).forEach(category => {
    const requiredAmount = 900000; // 仮の必要量
    const currentAmount = categoryQuantities[category] || 0;
    suppliesShortage[category] = Math.max(0, requiredAmount - currentAmount);
  });
  
  return {
    geoJsonData,
    evacuees: {
      total: evacuees.length,
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

export default function Prefecture() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null);
  const { geoJsonData, evacuees, supplies } = useLoaderData<LoaderData>();

  return (
    <div className="w-full p-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-2xl font-bold">東京都</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex gap-4 h-[calc(100vh-7rem)]">
        <div className="basis-8/12 h-full">
          <div className="h-full">
            <ClientOnly>
              <TokyoMap geoJsonData={geoJsonData} />
            </ClientOnly>
          </div>
        </div>
        <div className="flex flex-col basis-4/12 gap-4 h-full">
          <div className="h-1/2">
            <EvacueesChart 
              title="避難者数"
              data={evacuees.byGender}
              totalPeople={evacuees.total}
              setGender={setGender} 
            />
          </div>
          <div className="h-1/2">
            <SuppliesChart 
              title="物資不足状況"
              data={supplies} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
