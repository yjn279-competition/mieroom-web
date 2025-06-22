import { useState } from 'react';
import { useLoaderData, Link } from "react-router";
import { eq, sql, asc } from "drizzle-orm";
import { shelters, shelterEvacuees, evacuees, shelterSupplies, supplies } from "~/database/schema";
import { EvacueesChart } from "~/components/evacuees-chart";
import { SuppliesChart } from "~/components/supplies-chart";
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
import type { Route } from "./+types/route";

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

export async function loader({ params, context }: Route.LoaderArgs) {
  // 区市町村名のマッピング
  const cityParam = params.city || '';
  const cityName = cityNameMap[cityParam] || cityParam;

  // 避難所データの取得
  const shelterRows = await context.db
    .select()
    .from(shelters)
    .where(eq(shelters.cityName, cityName));

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
  .where(eq(shelters.cityName, cityName))
  .groupBy(evacuees.gender);
  
  // 物資データの取得
  const supplyShortages = await context.db
    .select({
      key: supplies.name,
      value: sql`17000 - sum(${shelterSupplies.quantity})`.mapWith(Number),
      fill: sql`'var(--chart-2)'`.mapWith(String),
    })
    .from(shelterSupplies)
    .innerJoin(shelters, eq(shelters.code, shelterSupplies.shelterCode))
    .innerJoin(supplies, eq(supplies.id, shelterSupplies.supplyId))
    .where(eq(shelters.cityName, cityName))
    .groupBy(shelterSupplies.supplyId)
    .orderBy(asc(shelterSupplies.quantity))
    .limit(8);

  return {
    shelters: shelterRows,
    cityName,
    evacuees: {
      total: genderCounts.reduce((acc, gender) => acc + gender.value, 0),
      byGender: genderCounts,
    },
    supplies: supplyShortages,
  };
};

export default function CityDashboard() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null);
  const { cityName, evacuees, supplies } = useLoaderData<typeof loader>();
  
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
