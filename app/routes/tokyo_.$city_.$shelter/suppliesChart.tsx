import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
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
  { category: "無事", number: 200, fill: "hsl(var(--chart-1))" },
  { category: "軽傷", number: 25, fill: "hsl(var(--chart-2))" },
  { category: "重体", number: 5, fill: "hsl(var(--chart-3))" },
  { category: "死亡", number: 0, fill: "hsl(var(--chart-4))" },
  { category: "行方不明", number: 5, fill: "hsl(var(--chart-5))" },
]

const chartConfig = {
  number: {
    label: "人数",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function SuppliesChart({
  setStatus,
}: {
  setStatus: (status: "無事" | "軽傷" | "重体" | "死亡" | "行方不明") => void
}) {
  const handleClick = (data: any) => {
    if (data && data.category) {
      setStatus(data.category as "無事" | "軽傷" | "重体" | "死亡" | "行方不明")
    }
  }
  
  return (
    <Card className="basis-1/2">
      <CardHeader className="items-center pb-0">
        <CardTitle>避難者の状況</CardTitle>
        <CardDescription>避難者の状態別の内訳</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="number"
              radius={[4, 4, 0, 0]}
              onClick={handleClick}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
