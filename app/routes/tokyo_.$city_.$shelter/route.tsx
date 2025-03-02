import { useState } from "react"
import { useParams, useLoaderData, Link } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import { EvacueesChart, EvacueeGenderData } from "@/components/evacuees-chart"
import { EvacueesTable, EvacueeData } from "@/components/evacuees-table"
import { SuppliesChart, BarChartData } from "@/components/supplies-chart"
import fs from 'fs'
import path from 'path'
import type { Shelter } from "../tokyo_.$city/route"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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

export const loader: LoaderFunction = async ({ params }) => {
  const cityParam = params.city || '';
  const shelterIndex = parseInt(params.shelter || '0', 10);
  const cityNameInJapanese = cityNameMap[cityParam] || cityParam;
  
  // Read the JSON file
  const jsonFilePath = path.join(process.cwd(), 'data', 'shelters.json');
  const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  
  // Parse the JSON
  const shelters = JSON.parse(fileContent);
  
  // Filter shelters by city
  const filteredShelters = shelters.filter(
    (shelter: Shelter) => shelter.指定市区町村名 === cityNameInJapanese
  );
  
  // Get the specific shelter by index
  const selectedShelter = filteredShelters[shelterIndex] || null;
  
  return { 
    shelter: selectedShelter,
    cityNameInJapanese
  };
};

// Mock data for shelter level charts and tables
const TOTAL_PEOPLE = 235
const evacueesByGender: EvacueeGenderData[] = [
  { name: "男性", value: 47, fill: "var(--color-男性)" },
  { name: "女性", value: 63, fill: "var(--color-女性)" },
  { name: "その他", value: 49, fill: "var(--color-その他)" },
]

const suppliesShortageData: BarChartData[] = [
  { item: "食料", shortage: 200, fill: "hsl(var(--chart-1))" },
  { item: "水", shortage: 150, fill: "hsl(var(--chart-2))" },
  { item: "衛生用品", shortage: 120, fill: "hsl(var(--chart-3))" },
  { item: "毛布", shortage: 80, fill: "hsl(var(--chart-4))" },
  { item: "医薬品", shortage: 45, fill: "hsl(var(--chart-5))" },
]

const evacueeData: EvacueeData[] = [
  { name: '山田太郎', age: 45, gender: '男性', status: '無事', elapsedTime: '2:30', plannedTime: '2:00' },
  { name: '佐藤花子', age: 32, gender: '女性', status: '無事', elapsedTime: '1:45', plannedTime: '2:00' },
  { name: '鈴木一郎', age: 58, gender: '男性', status: '軽傷', elapsedTime: '3:15', plannedTime: '3:00' },
  { name: '田中美咲', age: 28, gender: '女性', status: '無事', elapsedTime: '0:45', plannedTime: '1:00' },
  { name: '高橋健太', age: 52, gender: '男性', status: '重体', elapsedTime: '4:00', plannedTime: '3:30' },
  { name: '渡辺明子', age: 39, gender: '女性', status: '無事', elapsedTime: '2:15', plannedTime: '2:30' },
  { name: '伊藤大輔', age: 41, gender: '男性', status: '無事', elapsedTime: '1:30', plannedTime: '1:45' },
  { name: '小林由美', age: 36, gender: '女性', status: '軽傷', elapsedTime: '3:45', plannedTime: '3:00' },
  { name: '加藤正樹', age: 63, gender: '男性', status: '無事', elapsedTime: '2:00', plannedTime: '2:15' },
  { name: '吉田恵子', age: 47, gender: '女性', status: '無事', elapsedTime: '1:15', plannedTime: '1:30' },
  { name: '山本和也', age: 33, gender: '男性', status: '無事', elapsedTime: '0:30', plannedTime: '1:00' },
  { name: '中村真理', age: 29, gender: '女性', status: '無事', elapsedTime: '2:45', plannedTime: '2:30' },
  { name: '斎藤健一', age: 55, gender: '男性', status: '重体', elapsedTime: '3:30', plannedTime: '3:15' },
  { name: '松本さくら', age: 26, gender: '女性', status: '無事', elapsedTime: '1:00', plannedTime: '1:15' },
  { name: '木村拓哉', age: 49, gender: '男性', status: '無事', elapsedTime: '2:30', plannedTime: '2:45' },
  { name: '林美穂', age: 37, gender: '女性', status: '無事', elapsedTime: '3:00', plannedTime: '2:45' },
  { name: '清水俊介', age: 44, gender: '男性', status: '無事', elapsedTime: '1:45', plannedTime: '2:00' },
  { name: '阿部千尋', age: 31, gender: 'その他', status: '無事', elapsedTime: '2:15', plannedTime: '2:00' },
  { name: '山口博之', age: 59, gender: '男性', status: '死亡', elapsedTime: '4:15', plannedTime: '3:45' },
  { name: '池田美香', age: 35, gender: '女性', status: '無事', elapsedTime: '1:30', plannedTime: '1:45' },
  // 残りのデータは省略
]

export default function ShelterDashboard() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null)
  const [status, setStatus] = useState<"無事" | "軽傷" | "重体" | "死亡" | "行方不明" | null>(null)
  const params = useParams()
  const { shelter, cityNameInJapanese } = useLoaderData<typeof loader>()
  
  // Use the shelter name from the data, or a default if not available
  const shelterName = shelter ? shelter['避難所_施設名称'] : "避難所"

  return (
    <div className="w-full p-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-2xl font-bold" asChild>
              <Link to="/tokyo">東京都</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-2xl font-bold" asChild>
              <Link to={`/tokyo/${params.city}`}>{cityNameInJapanese}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-2xl font-bold">{shelterName} ダッシュボード</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex gap-4 h-[calc(100vh-7rem)]">
        <div className="basis-8/12 h-full">
          <EvacueesTable 
            title={`避難者一覧`}
            data={evacueeData}
            gender={gender} 
            status={status} 
          />
        </div>
        <div className="flex flex-col basis-4/12 gap-4 h-full">
          <div className="h-1/2">
            <EvacueesChart 
              title={`避難者数`}
              data={evacueesByGender}
              totalPeople={TOTAL_PEOPLE}
              setGender={setGender} 
            />
          </div>
          <div className="h-1/2">
            <SuppliesChart 
              title={`物資不足状況`}
              data={suppliesShortageData} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
