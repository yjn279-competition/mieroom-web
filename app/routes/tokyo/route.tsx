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

export const loader: LoaderFunction = async ({ request }) => {
  // GeoJSONデータの読み込み
  const geoJsonUrl = new URL("/data/tokyo.geojson", request.url);
  const geoJsonResponse = await fetch(geoJsonUrl.href);
  const geoJsonData = await geoJsonResponse.json();
  
  // 避難者データの読み込み
  const evacueeUrl = new URL("/data/json/evacuees.json", request.url);
  const evacueeResponse = await fetch(evacueeUrl.href);
  const evacuees = await evacueeResponse.json();
  
  // 物資データの読み込み
  const materialsDetailUrl = new URL("/data/json/materials_detail.json", request.url);
  const materialsDetailResponse = await fetch(materialsDetailUrl.href);
  const materialsDetail = await materialsDetailResponse.json();
  
  // 避難者の性別ごとの集計
  const genderCounts = {
    "男性": 0,
    "女性": 0,
    "その他": 0
  };
  
  evacuees.forEach((evacuee: any) => {
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
  
  materialsDetail.forEach((material: any) => {
    const genre = material.genre;
    if (genre in genreMapping) {
      const mappedGenre = genreMapping[genre];
      if (mappedGenre in suppliesShortage) {
        // 物資の不足状況を計算（例：必要量 - 現在量）
        // ここでは単純に各ジャンルの合計を集計
        suppliesShortage[mappedGenre] += 100; // 仮の必要量
      }
    }
  });
  
  return {
    geoJsonData,
    evacuees: {
      total: evacuees.length,
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

export default function Prefecture() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null);
  const { geoJsonData, evacuees, supplies } = useLoaderData<typeof loader>();

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
