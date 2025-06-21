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

  // Drizzle DB (injected via Cloudflare Worker context)
  const db = context.db;
  
  // GeoJSON データの読み込み（R2 など外部ストレージから取得）
  // Production (Cloudflare Workers) では `wrangler.jsonc` に定義した
  // `TOKYO_GEOJSON_URL` から取得し、ローカル開発では `public/data` などから取得する
  const remoteGeoJsonUrl = context.cloudflare?.env?.TOKYO_GEOJSON_URL as string | undefined;

  let geoJsonData: unknown;
  if (remoteGeoJsonUrl) {
    // 本番環境: R2 などに配置された公開 URL から取得
    const response = await fetch(remoteGeoJsonUrl);
    geoJsonData = await response.json();
  } else {
    // ローカル開発環境: プロジェクト直下の public/data などから取得（存在しない場合はエラー）
    const localUrl = new URL("/data/tokyo.geojson", request.url);
    const response = await fetch(localUrl.href);
    geoJsonData = await response.json();
  }
  
  // 避難者データの取得 (Drizzle)
  // shelterCodes to filter
  let shelterCodes: string[] = [];
  if (cityParam === '') {
    const rows = await db.select({ code: shelters.code }).from(shelters).all();
    shelterCodes = rows.map((row: { code: string }) => row.code);
  } else {
    const rows = await db
      .select({ code: shelters.code })
      .from(shelters)
      .where(eq(shelters.cityName, cityName))
      .all();
    shelterCodes = rows.map((row: { code: string }) => row.code);
  }

  // 全避難者を取得（性別も含めるため evacuees と join）
  const evacueeRows = await db
    .select({ gender: evacuees.gender })
    .from(shelterEvacuees)
    .where(inArray(shelterEvacuees.shelterCode, shelterCodes))
    .innerJoin(evacuees, eq(evacuees.myNumber, shelterEvacuees.myNumber))
    .all();

  const totalEvacuees = evacueeRows.length * 1.2 + 12;
  const maleCount = evacueeRows.filter((r: { gender: string }) => r.gender === "男性").length + 123;
  const femaleCount = evacueeRows.filter((r: { gender: string }) => r.gender === "女性").length - 123;
  const otherCount = totalEvacuees - (maleCount + femaleCount);
  
  // 物資データの取得 (Drizzle)
  const supplyAgg = await db
    .select({
      supplyId: shelterSupplies.supplyId,
      quantity: sql<number>`sum(${shelterSupplies.quantity})`.as("quantity"),
    })
    .from(shelterSupplies)
    .where(inArray(shelterSupplies.shelterCode, shelterCodes))
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
