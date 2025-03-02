import { useState } from 'react';
import type { LoaderFunction } from "@remix-run/node";
import { ClientOnly } from '@/components/client-only';
import { EvacueesChart, EvacueeGenderData } from "@/components/evacuees-chart";
import { SuppliesChart, BarChartData } from "@/components/supplies-chart";
import { TokyoMap } from "./tokyoMap.client";

// Mock data for Tokyo prefecture
const TOTAL_PEOPLE = 500;
const evacueesByGender: EvacueeGenderData[] = [
  { name: "男性", value: 120, fill: "var(--color-男性)" },
  { name: "女性", value: 150, fill: "var(--color-女性)" },
  { name: "その他", value: 80, fill: "var(--color-その他)" },
];

const suppliesShortageData: BarChartData[] = [
  { item: "食料", shortage: 500, fill: "hsl(var(--chart-1))" },
  { item: "水", shortage: 350, fill: "hsl(var(--chart-2))" },
  { item: "衛生用品", shortage: 280, fill: "hsl(var(--chart-3))" },
  { item: "毛布", shortage: 200, fill: "hsl(var(--chart-4))" },
  { item: "医薬品", shortage: 120, fill: "hsl(var(--chart-5))" },
];

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL("/data/tokyo.geojson", request.url);
  const response = await fetch(url.href);
  return response.json();
};

export default function Prefecture() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null);

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4">
        <span>東京都</span>
        {' '}
        ダッシュボード
      </h1>
      <div className="flex gap-4 h-[calc(100vh-7rem)]">
        <div className="basis-8/12 h-full">
          <div className="h-full">
            <ClientOnly>
              <TokyoMap />
            </ClientOnly>
          </div>
        </div>
        <div className="flex flex-col basis-4/12 gap-4 h-full">
          <div className="h-1/2">
            <EvacueesChart 
              title="避難者数"
              data={evacueesByGender}
              totalPeople={TOTAL_PEOPLE}
              setGender={setGender} 
            />
          </div>
          <div className="h-1/2">
            <SuppliesChart 
              title="物資不足状況"
              data={suppliesShortageData} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
