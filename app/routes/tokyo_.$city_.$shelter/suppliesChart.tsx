import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart"

const chartData = [
  { category: "食料品", number: 10 },
  { category: "衛生用品", number: 5 },
  { category: "医薬品", number: 9 },
  { category: "その他", number: 7 }
]

const chartConfig = {
  number: {
    label: "カテゴリ数",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function SuppliesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>物資不足状況</CardTitle>
        <CardDescription>不足している物資のカテゴリ数</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="number" fill="var(--color-number)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
      </CardFooter>
    </Card>
  )
}
