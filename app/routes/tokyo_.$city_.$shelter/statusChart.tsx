import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked bar chart with a legend"

const chartData = [
  { status: "重症", male: 186, female: 80 },
  { status: "軽傷", male: 305, female: 200 },
  { status: "要介護", male: 237, female: 120 },
  { status: "無事", male: 73, female: 190 },
  { status: "死亡", male: 209, female: 130 }
]

const chartConfig = {
  male: {
    label: "男性",
    color: "hsl(var(--chart-1))",
  },
  female: {
    label: "女性",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function StatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>避難者ステータス</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} layout="vertical">
            <CartesianGrid vertical={true} />
            <XAxis type="number" hide />
            <YAxis
              type ="category"
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="male"
              stackId="a"
              fill="var(--color-male)"
              radius={[0, 0, 4, 4]}
              barSize={50}
            />
            <Bar
              dataKey="female"
              stackId="a"
              fill="var(--color-female)"
              radius={[4, 4, 0, 0]}
              barSize={50}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          避難者の健康状態の一覧化です。
        </div>
      </CardFooter>
    </Card>
  )
}
