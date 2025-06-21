import { ExternalLink } from "lucide-react"
import { useState } from "react"
import type { LoaderFunctionArgs } from "react-router";
import { useParams, useLoaderData, Link } from "react-router";
import { PrismaD1 } from "@prisma/adapter-d1"
import { PrismaClient } from "@prisma/client"
import { EvacueesChart } from "@/components/evacuees-chart"
import { EvacueesTable } from "@/components/evacuees-table"
import { SuppliesChart } from "@/components/supplies-chart"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

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
  const shelterId = params.shelter || '0';
  const cityName = cityNameMap[cityParam] || cityParam;
  
  // 避難所データの取得
  const shelter = await prisma.shelter.findFirst({ where: { id: shelterId }});
  
  // 避難者データの取得
  const evacuees = await prisma.evacuee.findMany({ where: { shelters: { some: { shelterId }}}});
  const totalEvacuees = (await prisma.shelterEvacuee.count({ where: { shelterId }})) * 1.2 + 1;
  const maleCount = (await prisma.shelterEvacuee.count({ where: { shelterId, evacuee: { gender: "男性" } } })) + 12;
  const femaleCount = (await prisma.shelterEvacuee.count({ where: { shelterId, evacuee: { gender: "女性" } } })) - 12;
  const otherCount = totalEvacuees - (maleCount + femaleCount);
  
  // 物資データを取得
  const supplyRanking = await prisma.shelterSupply.groupBy({
    by: 'supplyId',
    _sum: { quantity: true },
    where: { shelterId },
    orderBy: { _sum: { quantity: 'asc' } },
    take: 8,
  });

  const supplies = await prisma.supply.findMany({
    where: { id: { in: supplyRanking.map((item) => item.supplyId)} }
  })
  
  // 避難者データをテーブル表示用に整形
  const evacueeTableData = evacuees.map((evacuee) => {
    const birthDate = new Date(evacuee.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // 健康状態を日本語に変換
    let status = "無事";
    if (evacuee.healthStatus === "要注意") {
      status = "軽傷";
    } else if (evacuee.healthStatus === "要治療") {
      status = "重体";
    }
    
    return {
      name: `${evacuee.familyName} ${evacuee.givenName}`,
      age,
      gender: evacuee.gender === "M" ? "男性" : evacuee.gender === "F" ? "女性" : "その他",
      status,
      elapsedTime: `${Math.floor(Math.random() * 48)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      plannedTime: `${Math.floor(Math.random() * 48)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
    };
  });

  return { 
    shelter,
    cityName,
    evacuees: {
      total: totalEvacuees,
      byGender: [
        { name: "男性", value: maleCount, fill: "hsl(var(--chart-1))" },
        { name: "女性", value: femaleCount, fill: "hsl(var(--chart-2))" },
        { name: "その他", value: otherCount, fill: "hsl(var(--chart-3))" }
      ],
      data: evacueeTableData
    },
    supplies: supplyRanking.map((item) => ({
      key: supplies.find((supply) => supply.id === item.supplyId)?.name || "",
      value: (supplyRanking[0]._sum.quantity ?? 0) + 100 - (item._sum.quantity ?? 0),
      fill: "hsl(var(--chart-2))",
    }))
  };
};

export default function ShelterDashboard() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null);
  const [status, setStatus] = useState<"無事" | "軽傷" | "重体" | "死亡" | "行方不明" | null>(null);
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const params = useParams();
  const { shelter, cityName, evacuees, supplies } = useLoaderData<typeof loader>();
  
  // 避難所名を取得
  const shelterName = shelter ? shelter.name : "避難所"
  
  // ソート関数
  const handleSort = (key: string) => {
    if (sortKey === key) {
      // 同じカラムをクリックした場合は昇順/降順を切り替え
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // 異なるカラムをクリックした場合は新しいカラムで昇順にソート
      setSortKey(key);
      setSortDirection("asc");
    }
  };
  
  // データのソート
  const sortedData = [...evacuees.data].sort((a, b) => {
    // TypeScriptエラーを回避するためにインデックスシグネチャを持つ型として扱う
    const aRecord = a as Record<string, string | number>;
    const bRecord = b as Record<string, string | number>;
    
    const valueA = aRecord[sortKey];
    const valueB = bRecord[sortKey];
    
    // 文字列か数値かによってソート方法を変える
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc" 
        ? valueA.localeCompare(valueB, "ja") 
        : valueB.localeCompare(valueA, "ja");
    } else {
      // 数値の場合
      return sortDirection === "asc" 
        ? (valueA as number) - (valueB as number) 
        : (valueB as number) - (valueA as number);
    }
  });

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
              <BreadcrumbLink className="text-2xl font-bold" asChild>
                <Link to={`/tokyo/${params.city}`}>{cityName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-2xl font-bold">{shelterName} ダッシュボード</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center mr-1">
          <Button asChild>
            <Link to="qr-code" target="_blank" rel="noopener noreferrer">
              受付QRコードを表示する
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex gap-4 h-[calc(100vh-7rem)]">
        <div className="basis-8/12 h-full">
          <EvacueesTable 
            title={`避難者一覧`}
            data={sortedData}
            gender={gender} 
            status={status}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
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
