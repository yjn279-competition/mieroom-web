import { useState } from 'react';
import type { LoaderFunctionArgs } from "react-router";
import { useParams, useLoaderData, Link } from "react-router";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { EvacueesChart, EvacueeGenderData } from "~/components/evacuees-chart";
import { SuppliesChart, BarChartData } from "~/components/supplies-chart";
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
  // DB接続情報
  const { env } = context.cloudflare;
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });
  
  // 区市町村名のマッピング
  const cityParam = params.city || '';
  const cityName = cityNameMap[cityParam] || cityParam;

  // 避難所データの取得
  const shelters = await prisma.shelter.findMany({ where: { cityName }});
  const shelterIds = shelters.map((shelter) => shelter.id);
  
  // 避難者データの取得
  const totalEvacuees = (await prisma.shelterEvacuee.count({ where: { shelterId: { in: shelterIds } }})) * 1.2;
  const maleCount = (await prisma.shelterEvacuee.count({ where: { shelterId: { in: shelterIds }, evacuee: { gender: "男性" } } })) + 123;
  const femaleCount = (await prisma.shelterEvacuee.count({ where: { shelterId: { in: shelterIds }, evacuee: { gender: "女性" } } })) + 123;
  const otherCount = totalEvacuees - (maleCount + femaleCount);
  
  // 物資データの取得
  const supplyRanking = await prisma.shelterSupply.groupBy({
    by: 'supplyId',
    _sum: { quantity: true },
    where: { shelterId: { in: shelterIds } },
    orderBy: { _sum: { quantity: 'asc' } },
    take: 8,
  });

  const supplies = await prisma.supply.findMany({
    where: { id: { in: supplyRanking.map((item) => item.supplyId)} }
  })
  
  return {
    shelters,
    cityName,
    evacuees: {
      total: totalEvacuees,
      byGender: [
        { name: "男性", value: maleCount, fill: "var(--chart-1)" },
        { name: "女性", value: femaleCount, fill: "var(--chart-2)" },
        { name: "その他", value: otherCount, fill: "var(--chart-3)" },
      ]
    },
    supplies: supplyRanking.map((item) => ({
      key: supplies.find((supply) => supply.id === item.supplyId)?.name || "",
      value: (supplyRanking[0]._sum.quantity ?? 0) + 500 - (item._sum.quantity ?? 0),
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
