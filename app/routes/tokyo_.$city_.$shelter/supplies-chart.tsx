import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { item: "食料", shortage: 200, fill: "hsl(var(--chart-1))" },
  { item: "水", shortage: 150, fill: "hsl(var(--chart-2))" },
  { item: "衛生用品", shortage: 120, fill: "hsl(var(--chart-3))" },
  { item: "毛布", shortage: 80, fill: "hsl(var(--chart-4))" },
  { item: "医薬品", shortage: 45, fill: "hsl(var(--chart-5))" },
]

const chartConfig = {
  shortage: {
    label: "不足数",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function SuppliesChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>物資不足状況</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} layout="vertical">
            <CartesianGrid vertical={true} />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="item"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="shortage"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
