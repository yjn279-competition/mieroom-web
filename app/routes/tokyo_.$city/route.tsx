import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CityMap } from './cityMap.client'

// 仮のデータ
const evacueeData = {
  total: 10000,
  evacuated: 7500,
  statuses: [
    { status: '要支援', percentage: 15 },
    { status: '要介護', percentage: 10 },
    { status: 'その他', percentage: 75 },
  ]
}

const shelterData = [
  { name: '中央区体育館', capacity: 500, currentOccupancy: 375, availableSpace: 125, lat: 35.6894, lng: 139.6917 },
  { name: '港区市民センター', capacity: 300, currentOccupancy: 180, availableSpace: 120, lat: 35.6586, lng: 139.7454 },
  { name: '新宿区立学校', capacity: 400, currentOccupancy: 340, availableSpace: 60, lat: 35.6938, lng: 139.7034 },
]

export default function DashboardComponent() {
	if (typeof document === 'undefined') {
		return null
	}

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 地図エリア（左側 2/3） */}
      <div className="w-2/3 p-4">
				<CityMap />
      </div>

      {/* 情報エリア（右側 1/3） */}
      <div className="w-1/3 p-4 space-y-4">
        {/* 避難者情報 */}
        <Card>
          <CardHeader>
            <CardTitle>避難者情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl font-bold">{evacueeData.evacuated} / {evacueeData.total}</div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="space-y-2">
              {evacueeData.statuses.map((status, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-24">{status.status}</div>
                  <Progress value={status.percentage} className="flex-1" />
                  <div className="w-12 text-right">{status.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 避難所別情報 */}
        <Card>
          <CardHeader>
            <CardTitle>避難所別情報</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th>避難所名</th>
                  <th>収容可能</th>
                  <th>現在の避難者</th>
                  <th>空き</th>
                  <th>使用率</th>
                </tr>
              </thead>
              <tbody>
                {shelterData.map((shelter, index) => (
                  <tr key={index} className="border-t">
                    <td>{shelter.name}</td>
                    <td>{shelter.capacity}</td>
                    <td>{shelter.currentOccupancy}</td>
                    <td>{shelter.availableSpace}</td>
                    <td>
                      <div className="flex items-center">
                        <Progress value={(shelter.currentOccupancy / shelter.capacity) * 100} className="w-16 mr-2" />
                        {Math.round((shelter.currentOccupancy / shelter.capacity) * 100)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
