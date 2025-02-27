import { useState } from "react"
import { EvacueesChart } from "@/routes/tokyo_.$city_.$shelter/evacuees-chart"
import { EvacueesTable } from "@/routes/tokyo_.$city_.$shelter/evacuees-table"
import { SuppliesChart } from "@/routes/tokyo_.$city_.$shelter/supplies-chart"

export default function ShelterDashboard() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null)
  const [status, setStatus] = useState<"無事" | "軽傷" | "重体" | "死亡" | "行方不明" | null>(null)

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4">避難所運営ダッシュボード</h1>
      <div className="flex gap-4 h-[calc(100vh-7rem)]">
        <div className="basis-8/12 h-full">
          <EvacueesTable gender={gender} status={status} />
        </div>
        <div className="flex flex-col basis-4/12 gap-4 h-full">
          <div className="h-1/2">
            <EvacueesChart setGender={setGender} />
          </div>
          <div className="h-1/2">
            <SuppliesChart />
          </div>
        </div>
      </div>
    </div>
  )
}
