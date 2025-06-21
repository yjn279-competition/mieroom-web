import { useState } from 'react';
import type { LoaderFunctionArgs } from "react-router";
import { useParams, useLoaderData, Link } from "react-router";
import { eq, sql, inArray } from "drizzle-orm";
import * as schema from "~/database/schema";
import { EvacueesChart } from "~/components/evacuees-chart";
import type { EvacueeGenderData } from "~/components/evacuees-chart";
import { SuppliesChart } from "~/components/supplies-chart";
import type { BarChartData } from "~/components/supplies-chart";
import { ClientOnly } from '~/components/client-only';
import { Card, CardContent } from "~/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from '~/components/ui/button';
import { CityMap } from "./cityMap.client";

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

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  // Drizzle DB (injected via workers/app.ts)
  const db = context.db;
  const { shelters, shelterEvacuees, evacuees, shelterSupplies, supplies } = schema;
  
  // 区市町村名のマッピング
  const cityParam = params.city || '';
  const cityName = cityNameMap[cityParam] || cityParam;

  // 避難所データの取得
  const shelterRows = await db
    .select()
    .from(shelters)
    .where(eq(shelters.cityName, cityName))
    .all();
  const shelterIds = shelterRows.map((row: { code: string }) => row.code);
  
  // 避難者データの取得
  const evacueeRows = await db
    .select({ gender: evacuees.gender })
    .from(shelterEvacuees)
    .where(inArray(shelterEvacuees.shelterCode, shelterIds))
    .innerJoin(evacuees, eq(evacuees.myNumber, shelterEvacuees.myNumber))
    .all();

  const totalEvacuees = evacueeRows.length * 1.2;
  const maleCount = evacueeRows.filter((r: { gender: string }) => r.gender === "男性").length + 123;
  const femaleCount = evacueeRows.filter((r: { gender: string }) => r.gender === "女性").length + 123;
  const otherCount = totalEvacuees - (maleCount + femaleCount);
  
  // 物資データの取得
  const supplyAgg = await db
    .select({
      supplyId: shelterSupplies.supplyId,
      quantity: sql<number>`sum(${shelterSupplies.quantity})`.as("quantity"),
    })
    .from(shelterSupplies)
    .where(inArray(shelterSupplies.shelterCode, shelterIds))
    .groupBy(shelterSupplies.supplyId)
    .orderBy(sql`quantity ASC`)
    .limit(8)
    .all();

  const supplyIds = supplyAgg.map((row: { supplyId: string }) => row.supplyId);

  const supplyRows = await db
    .select({ id: supplies.id, name: supplies.name })
    .from(supplies)
    .where(inArray(supplies.id, supplyIds))
    .all();

  return {
    shelters: shelterRows.map((row: any) => ({ ...row, id: row.code })),
    cityName,
    evacuees: {
      total: totalEvacuees,
      byGender: [
        { name: "男性", value: maleCount, fill: "var(--chart-1)" },
        { name: "女性", value: femaleCount, fill: "var(--chart-2)" },
        { name: "その他", value: otherCount, fill: "var(--chart-3)" },
      ]
    },
    supplies: supplyAgg.map((item: { supplyId: string; quantity: number }) => ({
      key: supplyRows.find((s: { id: string; name: string }) => s.id === item.supplyId)?.name || "",
      value: (supplyAgg[0].quantity ?? 0) + 500 - (item.quantity ?? 0),
      fill: "var(--chart-2)",
    }))
  };
};

export default function CityDashboard() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null);
  const params = useParams();
  const { shelters, cityName, evacuees, supplies } = useLoaderData<typeof loader>();
  
  console.log("Evacuees data:", evacuees);
  console.log("Evacuees by gender:", evacuees.byGender);

  return (
    <div className="w-full p-8">
      <div className="flex flex-row bg-orange-200 rounded-xl p-2 mb-4">
        <Button
          className="h-full rounded-lg p-2 mr-2 text-2xl font-bold tracking-wide"
          asChild
        >
          <Link to="/tokyo">
            mieroom
          </Link>
        </Button>
        <Breadcrumb className="p-2">
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
      </div>
      <div className="flex gap-4 h-[calc(100vh-9rem)]">
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
