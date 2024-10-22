'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// 仮のデータ
const evacueeData = [
  { name: '避難済み', value: 3000, color: '#4caf50' },
  { name: '避難中', value: 1500, color: '#ff9800' },
  { name: '未避難', value: 5500, color: '#f44336' },
];

const municipalityData = [
  { name: '中央区', shelters: 10, availablePercentage: 80, evacuees: 1200, capacityPercentage: 60 },
  { name: '港区', shelters: 8, availablePercentage: 75, evacuees: 900, capacityPercentage: 55 },
  { name: '新宿区', shelters: 12, availablePercentage: 90, evacuees: 1500, capacityPercentage: 70 },
  { name: '渋谷区', shelters: 7, availablePercentage: 85, evacuees: 800, capacityPercentage: 50 },
];

const resourceData = [
  { name: '食料', current: 8000, required: 10000 },
  { name: '水', current: 15000, required: 20000 },
  { name: '毛布', current: 3000, required: 5000 },
];

export default function Prefecture() {
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>災害対策マップ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[calc(100vh-200px)] bg-gray-200 rounded">
              <p className="p-2 text-sm">ここに実際のマップが表示されます。</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>避難者状況</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center">
                  <span>避難済み: 3,000人</span>
                </div>
                <div className="flex items-center">
                  <span>未避難: 5,500人</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={evacueeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {evacueeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>物資状況</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={resourceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#2196f3" name="現在の在庫" />
                  <Bar dataKey="required" fill="#f44336" name="必要量" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>市区町村別避難所情報</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>市区町村</TableHead>
                <TableHead className="text-right">避難所数</TableHead>
                <TableHead className="text-right">使用可能率</TableHead>
                <TableHead className="text-right">避難者数</TableHead>
                <TableHead className="text-right">収容率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {municipalityData.map((row) => (
                <TableRow
                  key={row.name}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedMunicipality(row)}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-right">{row.shelters}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Progress value={row.availablePercentage} className="w-full mr-2" />
                      <span className="text-sm text-gray-500">{`${Math.round(row.availablePercentage)}%`}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{row.evacuees}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Progress value={row.capacityPercentage} className="w-full mr-2" />
                      <span className="text-sm text-gray-500">{`${Math.round(row.capacityPercentage)}%`}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedMunicipality && (
        <Card className="fixed bottom-4 right-4 w-72">
          <CardHeader>
            <CardTitle>{`${selectedMunicipality.name} の詳細情報`}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <span className="text-sm">避難所数: {selectedMunicipality.shelters}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm">避難者数: {selectedMunicipality.evacuees}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm">使用可能率: {selectedMunicipality.availablePercentage}%</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm">収容率: {selectedMunicipality.capacityPercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
