'use client'

import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OccupancyChart} from "@/app/cities/[cityId]/shelters/[shelterId]/components/PieChart"
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

const SuppliesChart = () => {
  const [selectedSupply, setSelectedSupply] = useState(null)

  const handleClick = (entry) => {
    setSelectedSupply(entry)
  }

  return (
    <Card className="basis-1/2">
      <CardHeader>
        <CardTitle>物資不足状況</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={suppliesData} layout="vertical" onClick={(data) => data && handleClick(data.activePayload[0].payload)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="shortage" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Dialog open={!!selectedSupply} onOpenChange={() => setSelectedSupply(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedSupply?.name}の在庫状況</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>物資名</TableHead>
                    <TableHead>残り貯蔵量</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSupply?.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.remaining}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}


const OutTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>外出中の避難市民</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>氏名</TableHead>
              <TableHead>年齢</TableHead>
              <TableHead>性別</TableHead>
              <TableHead>経過時間</TableHead>
              <TableHead>予定時間</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outData.map((person, index) => (
              <TableRow key={index}>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.age}</TableCell>
                <TableCell>{person.gender}</TableCell>
                <TableCell className={person.elapsedTime > person.plannedTime ? 'text-red-500' : ''}>
                  {person.elapsedTime}
                </TableCell>
                <TableCell>{person.plannedTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">避難所管理ダッシュボード</h1>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col basis-8/12 gap-4">
          <div className="flex flex-row gap-4">
            <OccupancyChart />
            <SuppliesChart />
          </div>
          <StatusChart />
        </div>
        <div className="basis-4/12">
          <OutTable />
        </div>
      </div>
    </div>
  )
}
