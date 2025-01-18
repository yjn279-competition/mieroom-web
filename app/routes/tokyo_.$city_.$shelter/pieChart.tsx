import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const TOTAL_PEOPLE = 235
const chartData = [
  { gender: "男性", evacuees: 47, fill: "var(--color-男性)" },
  { gender: "女性", evacuees: 63, fill: "var(--color-女性)" },
  { gender: "その他", evacuees: 49, fill: "var(--color-その他)" },
]

const chartConfig = {
  evacuees: {
    label: "人",
  },
  "男性": {
    label: "男性",
    color: "hsl(var(--chart-1))",
  },
  "女性": {
    label: "女性",
    color: "hsl(var(--chart-2))",
  },
  "その他": {
    label: "その他",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function OccupancyChart({
  setGender,
}: {
  setGender: (gender: "男性" | "女性" | "その他" | null) => void
}) {
  const totalEvacuees = chartData.reduce((acc, curr) => acc + curr.evacuees, 0)
  const endAngle = 360 * (totalEvacuees / TOTAL_PEOPLE) + 90

  const handleClick = (data: any) => {
    if (data && data.gender) {
      setGender(data.gender as "男性" | "女性" | "その他")
    }
  }
  
  return (
    <Card className="basis-1/2">
      <CardHeader className="items-center pb-0">
        <CardTitle>避難者数</CardTitle>
        <CardDescription>避難者数と性別ごとの内訳</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="evacuees"
              nameKey="gender"
              innerRadius={60}
              strokeWidth={5}
              onClick={handleClick}
              startAngle={90}
              endAngle={endAngle}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalEvacuees}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          人
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="gender" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
