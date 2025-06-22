import { useState } from 'react';
import { useLoaderData } from "react-router";
import { eq, sql, asc } from "drizzle-orm";
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
import type { Route } from "./+types/route";
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

export async function loader({ context, request }: Route.LoaderArgs) {
  // パラメータ取得
  const url = new URL(request.url);
  const cityParam = url.searchParams.get("cityParam") || '';
  const cityName = cityNameMap[cityParam] || cityParam;
  
  // GeoJSON データの読み込み
  const object = await context.bucket.get("tokyo.geojson");
  if (!object) {
    throw new Response("GeoJSON not found in R2", { status: 404 });
  }
  const geoJsonData = await object.json();
  
  // 避難者データの取得
  const genderCounts = await context.db
    .select({
      name: evacuees.gender,
      value: sql`count(*)`.mapWith(Number),
      fill: sql`case
        when ${evacuees.gender} = '男性' then 'var(--chart-1)'
        when ${evacuees.gender} = '女性' then 'var(--chart-2)'
        else 'var(--chart-3)'
      end`.mapWith(String),
    })
    .from(shelterEvacuees)
    .innerJoin(shelters, eq(shelters.code, shelterEvacuees.shelterCode))
    .innerJoin(evacuees, eq(evacuees.myNumber, shelterEvacuees.myNumber))
    .where(cityName ? eq(shelters.cityName, cityName) : undefined)
    .groupBy(evacuees.gender);
  
  // 物資データの取得
  const supplyShortages = await context.db
    .select({
      key: supplies.name,
      value: sql`470000 - sum(${shelterSupplies.quantity})`.mapWith(Number),
      fill: sql`'var(--chart-2)'`.mapWith(String),
    })
    .from(shelterSupplies)
    .innerJoin(shelters, eq(shelters.code, shelterSupplies.shelterCode))
    .innerJoin(supplies, eq(supplies.id, shelterSupplies.supplyId))
    .where(cityName ? eq(shelters.cityName, cityName) : undefined)
    .groupBy(shelterSupplies.supplyId)
    .orderBy(asc(shelterSupplies.quantity))
    .limit(8);

  return {
    geoJsonData,
    evacuees: {
      total: genderCounts.reduce((acc, gender) => acc + gender.value, 0),
      byGender: genderCounts,
    },
    supplies: supplyShortages,
  };
};

export default function PrefectureDashboard() {
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
