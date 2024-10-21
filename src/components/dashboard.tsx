'use client'

import React, { useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

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

const OccupancyChart = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const data = [
    { name: '男性', value: shelterData.maleCount },
    { name: '女性', value: shelterData.femaleCount },
    { name: '残り', value: shelterData.capacity - shelterData.currentOccupancy },
  ]
  const COLORS = ['#0088FE', '#FF8042', '#CCCCCC']

  const handleClick = (entry, index) => {
    if (index !== 2) { // Ignore clicks on "残り" segment
      setSelectedCategory(entry.name)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>避難所収容状況</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                onClick={handleClick}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor={index !== 2 ? 'pointer' : 'default'} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}人`} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                {`${shelterData.currentOccupancy}/${shelterData.capacity}`}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center">
          {data.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center mr-4">
              <div className="w-3 h-3 mr-1" style={{ backgroundColor: COLORS[index] }}></div>
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
        <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedCategory}の避難者リスト</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>氏名</TableHead>
                    <TableHead>年齢</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shelterData.evacuees
                    .filter(e => e.gender === selectedCategory)
                    .map((evacuee, i) => (
                      <TableRow key={i}>
                        <TableCell>{evacuee.name}</TableCell>
                        <TableCell>{evacuee.age}</TableCell>
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

const SuppliesChart = () => {
  const [selectedSupply, setSelectedSupply] = useState(null)

  const handleClick = (entry) => {
    setSelectedSupply(entry)
  }

  return (
    <Card>
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
              <Bar dataKey="shortage" fill="#8884d8" />
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

const StatusChart = () => {
  const [selectedStatus, setSelectedStatus] = useState(null)

  const handleClick = (entry, gender) => {
    setSelectedStatus({ ...entry, selectedGender: gender })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>避難者ステータス</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={statusData} 
              layout="vertical"
              onClick={(data) => {
                if (data && data.activePayload) {
                  const entry = data.activePayload[0].payload
                  const gender = data.activeTooltipIndex === 0 ? '男性' : '女性'
                  handleClick(entry, gender)
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="status" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" stackId="a" fill="#0088FE" name="男性" />
              <Bar dataKey="female" stackId="a" fill="#FF8042" name="女性" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Dialog open={!!selectedStatus} onOpenChange={() => setSelectedStatus(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedStatus?.status}の{selectedStatus?.selectedGender}避難者リスト</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>氏名</TableHead>
                    <TableHead>年齢</TableHead>
                    <TableHead>性別</TableHead>
                    <TableHead>詳細</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedStatus?.details
                    .filter(d => d.gender === selectedStatus.selectedGender)
                    .map((detail, i) => (
                      <TableRow key={i}>
                        <TableCell>{detail.name}</TableCell>
                        <TableCell>{detail.age}</TableCell>
                        <TableCell>{detail.gender}</TableCell>
                        <TableCell>{detail.detail}</TableCell>
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

export function DashboardComponent() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">避難所管理ダッシュボード</h1>
      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-100px)]">
        <div className="col-span-1 space-y-4">
          <OccupancyChart />
          <SuppliesChart />
        </div>
        <div className="col-span-2 space-y-4">
          <StatusChart />
          <OutTable />
        </div>
      </div>
    </div>
  )
}