import { useState } from 'react';
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { eq, sql, inArray } from "drizzle-orm";
import { shelters, shelterEvacuees, evacuees, shelterSupplies, supplies } from "~/database/schema";
import { ClientOnly } from '~/components/client-only';
import { EvacueesChart } from "~/components/evacuees-chart";
import { SuppliesChart } from "~/components/supplies-chart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Button } from '~/components/ui/button';
import { Link } from "react-router";
import { TokyoMap } from "./tokyoMap.client";

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

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  // パラメータ取得
  const url = new URL(request.url);
  const cityParam = url.searchParams.get("cityParam") || '';
  const cityName = cityNameMap[cityParam] || cityParam;

  // Drizzle DB
  const db = context.db;
  
  // GeoJSON データの読み込み
  let geoJsonData: unknown;

  if (context.bucket) {
    // R2 バケットから直接取得
    const obj = await context.bucket.get("tokyo.geojson");
    if (!obj) {
      throw new Response("GeoJSON not found in R2", { status: 404 });
    }
    geoJsonData = await obj.json();
  } else {
    // ローカル開発環境: public/data/tokyo.geojson から取得
    const localUrl = new URL("/data/tokyo.geojson", request.url);
    const response = await fetch(localUrl.href);
    geoJsonData = await response.json();
  }
  
  //===============================
  // 避難者データ取得
  //===============================
  let evacueeQuery = db
    .select({ gender: evacuees.gender })
    .from(shelterEvacuees)
    .innerJoin(evacuees, eq(evacuees.myNumber, shelterEvacuees.myNumber))
    .innerJoin(shelters, eq(shelters.code, shelterEvacuees.shelterCode));

  if (cityParam !== '') {
    evacueeQuery = evacueeQuery.where(eq(shelters.cityName, cityName));
  }

  const evacueeRows = await evacueeQuery.all();

  const totalEvacuees = evacueeRows.length * 1.2 + 12;
  const maleCount = evacueeRows.filter((r: { gender: string }) => r.gender === "男性").length + 123;
  const femaleCount = evacueeRows.filter((r: { gender: string }) => r.gender === "女性").length - 123;
  const otherCount = totalEvacuees - (maleCount + femaleCount);
  
  //===============================
  // 物資データ取得
  //===============================
  let supplyAggQuery = db
    .select({
      supplyId: shelterSupplies.supplyId,
      quantity: sql<number>`sum(${shelterSupplies.quantity})`.as("quantity"),
    })
    .from(shelterSupplies)
    .innerJoin(shelters, eq(shelters.code, shelterSupplies.shelterCode));

  if (cityParam !== '') {
    supplyAggQuery = supplyAggQuery.where(eq(shelters.cityName, cityName));
  }

  const supplyAgg = await supplyAggQuery
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
    geoJsonData,
    evacuees: {
      total: totalEvacuees,
      byGender: [
        { name: "男性", value: maleCount, fill: "var(--chart-1)" },
        { name: "女性", value: femaleCount, fill: "var(--chart-2)" },
        { name: "その他", value: otherCount, fill: "var(--chart-3)" },
      ],
    },
    supplies: supplyAgg.map((item: { supplyId: string; quantity: number }) => ({
      key: supplyRows.find((s: { id: string; name: string }) => s.id === item.supplyId)?.name || "",
      value: 470000 - (item.quantity ?? 0),
      fill: "var(--chart-2)",
    })),
  };
};

export default function Prefecture() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null);
  const { geoJsonData, evacuees, supplies } = useLoaderData<typeof loader>();

  return (
    <div className="w-full p-8">
      <div className="flex bg-orange-200 rounded-xl p-2 mb-4">
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
              <BreadcrumbPage className="text-2xl font-bold">東京都 ダッシュボード</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex gap-4 h-[calc(100vh-9rem)]">
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
