import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"

export interface BarChartData {
  [key: string]: string | number | undefined
  fill?: string
}

export interface SuppliesChartProps {
  title?: string
  description?: string
  data: BarChartData[]
}

export function SuppliesChart({
  title = "物資不足状況",
  description = "物資の不足ランキングと不足物資数",
  data
}: SuppliesChartProps) {
  const chartConfig = {
    value: {
      label: "不足数",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row space-x-2 space-y-0 pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="key"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />} />
            <Bar
              dataKey="value"
              layout="vertical"
              radius={4}
            >
              <LabelList
                dataKey="key"
                position="insideLeft"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
              <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-black"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
