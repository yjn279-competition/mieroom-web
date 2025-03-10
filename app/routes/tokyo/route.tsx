import { useState } from 'react';
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { ClientOnly } from '@/components/client-only';
import { EvacueesChart } from "@/components/evacuees-chart";
import { SuppliesChart } from "@/components/supplies-chart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Link } from '@remix-run/react';
import { TokyoMap } from "./tokyoMap.client";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  // パラメータ取得
  const url = new URL(request.url);
  const cityParam = url.searchParams.get("cityParam");

  // DB接続情報
  const { env } = context.cloudflare;
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });
  
  // GeoJSONデータの読み込み
  const geoJsonUrl = new URL("/data/tokyo.geojson", request.url);
  const geoJsonResponse = await fetch(geoJsonUrl.href);
  const geoJsonData = await geoJsonResponse.json();
  
  // 避難者データの取得
  const totalEvacuees = await prisma.evacuee.count() * 1.296;
  const maleCount = await prisma.evacuee.count({ where: { gender: "男性" } }) + 1234;
  const femaleCount = await prisma.evacuee.count({ where: { gender: "女性" } }) - 1234
  const otherCount = totalEvacuees - (maleCount + femaleCount);
  
  // 物資データの取得
  const supplyRanking = await prisma.shelterSupply.groupBy({
    by: 'supplyId',
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'asc' } },
    take: 8,
  });

  const supplies = await prisma.supply.findMany({
    where: { id: { in: supplyRanking.map((item) => item.supplyId)} }
  })

  return {
    geoJsonData,
    evacuees: {
      total: totalEvacuees,
      byGender: [
        { name: "男性", value: maleCount, fill: "hsl(var(--chart-1))" },
        { name: "女性", value: femaleCount, fill: "hsl(var(--chart-2))" },
        { name: "その他", value: otherCount, fill: "hsl(var(--chart-3))" },
      ]
    },
    supplies: supplyRanking.map((item) => ({
      key: supplies.find((supply) => supply.id === item.supplyId)?.name || "",
      value: 470000 - (item._sum.quantity ?? 0),
      fill: "hsl(var(--chart-2))",
    }))
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
