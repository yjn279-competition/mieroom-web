import { useState } from 'react';
import { EvacueesChart } from "@/routes/tokyo_.$city_.$shelter/evacuees-chart";
import { SuppliesChart } from "@/routes/tokyo_.$city_.$shelter/supplies-chart";

export default function Prefecture() {
  const [gender, setGender] = useState<"男性" | "女性" | "その他" | null>(null);

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4">東京都ダッシュボード</h1>
      <div className="flex gap-4 h-[calc(100vh-7rem)]">
        <div className="basis-8/12 h-full bg-gray-200 rounded">
          <p className="p-2 text-sm">ここに実際のマップが表示されます。</p>
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
  );
}
