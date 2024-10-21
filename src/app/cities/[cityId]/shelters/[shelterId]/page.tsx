"use client"

import { useState } from "react"
import { OccupancyChart} from "@/app/cities/[cityId]/shelters/[shelterId]/components/PieChart"
import { OutTable } from "@/app/cities/[cityId]/shelters/[shelterId]/components/Table"
import { SuppliesChart } from "@/app/cities/[cityId]/shelters/[shelterId]/components/RadarChart"
import { StatusChart } from "@/app/cities/[cityId]/shelters/[shelterId]/components/StatusChart"

// Mock data - replace with actual data in production
const shelterData = {
  capacity: 1000,
  currentOccupancy: 750,
  maleCount: 400,
  femaleCount: 350,
  evacuees: [
    { name: '山田太郎', age: 45, gender: '男性' },
    { name: '佐藤花子', age: 32, gender: '女性' },
    { name: '鈴木一郎', age: 58, gender: '男性' },
    // ... more evacuees
  ]
}

const suppliesData = [
  { name: '食料品', shortage: 5, items: [
    { name: '米', remaining: 100 },
    { name: '水', remaining: 500 },
    { name: 'レトルト食品', remaining: 200 },
  ]},
  { name: '日用品・衛生用品', shortage: 3, items: [
    { name: 'トイレットペーパー', remaining: 50 },
    { name: 'マスク', remaining: 1000 },
    { name: '消毒液', remaining: 20 },
  ]},
  { name: '医薬品', shortage: 2, items: [
    { name: '解熱剤', remaining: 100 },
    { name: '絆創膏', remaining: 500 },
    { name: '消毒薬', remaining: 30 },
  ]},
  { name: 'その他', shortage: 1, items: [
    { name: '毛布', remaining: 200 },
    { name: '懐中電灯', remaining: 50 },
    { name: '乾電池', remaining: 100 },
  ]},
]

const statusData = [
  { status: '重症', male: 10, female: 8, details: [
    { name: '山田太郎', age: 45, gender: '男性', detail: '骨折' },
    { name: '佐藤花子', age: 32, gender: '女性', detail: '高熱' },
  ]},
  { status: '軽傷', male: 30, female: 25, details: [
    { name: '鈴木一郎', age: 58, gender: '男性', detail: '擦り傷' },
    { name: '田中美咲', age: 27, gender: '女性', detail: '捻挫' },
  ]},
  { status: '要介護', male: 50, female: 60, details: [
    { name: '高橋健太', age: 75, gender: '男性', detail: '認知症' },
    { name: '渡辺静子', age: 82, gender: '女性', detail: '歩行困難' },
  ]},
  { status: '無事', male: 305, female: 255, details: [
    { name: '小林太一', age: 40, gender: '男性', detail: '特になし' },
    { name: '伊藤美穂', age: 35, gender: '女性', detail: '特になし' },
  ]},
  { status: '死亡', male: 5, female: 2, details: [
    { name: '中村勇', age: 68, gender: '男性', detail: '心臓発作' },
    { name: '木村さゆり', age: 55, gender: '女性', detail: '圧死' },
  ]},
]

const outData = [
  { name: '山田太郎', age: 45, gender: '男性', elapsedTime: '2:30', plannedTime: '2:00' },
  { name: '佐藤花子', age: 32, gender: '女性', elapsedTime: '1:45', plannedTime: '2:00' },
  { name: '鈴木一郎', age: 58, gender: '男性', elapsedTime: '3:15', plannedTime: '3:00' },
]


export default function Dashboard() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">避難所管理ダッシュボード</h1>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col basis-8/12 gap-4">
          <div className="flex flex-row gap-4">
            <OccupancyChart setGender={setGender} />
            <SuppliesChart />
          </div>
          <StatusChart />
        </div>
        <div className="basis-4/12">
          <OutTable gender={gender} />
        </div>
      </div>
    </div>
  )
}
