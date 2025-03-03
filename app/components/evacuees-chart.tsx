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

export interface EvacueeGenderData {
  name: string
  value: number
  fill: string
}

export interface EvacueesChartProps {
  title?: string
  description?: string
  data: EvacueeGenderData[]
  totalPeople: number
  setGender: (gender: "男性" | "女性" | "その他" | null) => void
}

export function EvacueesChart({
  title = "避難者数",
  description = "避難者数と性別ごとの内訳",
  data,
  totalPeople,
  setGender
}: EvacueesChartProps) {
  const chartConfig = {
    value: {
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

  const totalEvacuees = data.reduce((acc, curr) => acc + curr.value, 0)
  const endAngle = 360 * (totalEvacuees / totalPeople) + 90

  const handleClick = (data: any) => {
    if (data && data.name) {
      setGender(data.name as "男性" | "女性" | "その他")
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[15rem]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
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
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
