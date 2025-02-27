import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EvacueesChart, EvacueeGenderData } from "@/components/evacuees-chart";
import { SuppliesChart, BarChartData } from "@/components/supplies-chart";
import { useParams } from "@remix-run/react";

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
  const cityName = params.city || "世田谷区";

  if (typeof document === 'undefined') {
    return null
  }

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4">{cityName}ダッシュボード</h1>
      <div className="flex gap-4 h-[calc(100vh-7rem)]">
        <div className="basis-8/12 h-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51882.300028334204!2d139.59330037055176!3d35.63650798575117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f38bdd6d8d61%3A0x4ebc10d2858da879!2z5p2x5Lqs6YO95LiW55Sw6LC35Yy6!5e0!3m2!1sja!2sjp!4v1737176334224!5m2!1sja!2sjp"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded"
          />
        </div>
        <div className="flex flex-col basis-4/12 gap-4 h-full">
          <div className="h-1/2">
            <EvacueesChart 
              title={`${cityName}避難者数`}
              data={evacueesByGender}
              totalPeople={TOTAL_PEOPLE}
              setGender={setGender} 
            />
          </div>
          <div className="h-1/2">
            <SuppliesChart 
              title={`${cityName}物資不足状況`}
              data={suppliesShortageData} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
