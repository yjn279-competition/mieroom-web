import { useState } from "react"
import { OccupancyChart } from "@/routes/tokyo_.$city_.$shelter/pieChart"
import { OutTable } from "@/routes/tokyo_.$city_.$shelter/table"
import { SuppliesChart } from "@/routes/tokyo_.$city_.$shelter/suppliesChart"
import { StatusChart } from "@/routes/tokyo_.$city_.$shelter/statusChart"


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
