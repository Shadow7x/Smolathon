"use client"

import { useState, useMemo } from "react"
import { Pie, PieChart } from "recharts"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Evacuation {
  id: number
  count_departures: number
  count_evacuations: number
  month: string
  year: number
}

interface Props {
  evacuation2024?: Evacuation[]
  evacuation2025?: Evacuation[]
}

const chartConfig = {
  evacuated: { label: "Эвакуировано", color: "#4CAF50" },
  notEvacuated: { label: "Не эвакуировано", color: "#FF9800" },
} satisfies ChartConfig

export default function EvacuationPieDiagram({
  evacuation2024 = [],
  evacuation2025 = [],
}: Props) {
  const [year, setYear] = useState<"2024" | "2025">("2024")

  const data = useMemo(() => {
    const dataset = year === "2024" ? evacuation2024 : evacuation2025
    console.log(evacuation2024)
    console.log(evacuation2025)
    const totalDepartures = dataset.reduce(
      (s, d) => s + Number(d.count_departures ?? 0),
      0
    )
    const totalEvacuations = dataset.reduce(
      (s, d) => s + Number(d.count_evacuations ?? 0),
      0
    )

    const notEvacuated = Math.max(totalDepartures - totalEvacuations, 0)

    return [
      {
        name: "Эвакуировано",
        value: totalEvacuations,
        fill: chartConfig.evacuated.color,
      },
      {
        name: "Не эвакуировано",
        value: notEvacuated,
        fill: chartConfig.notEvacuated.color,
      },
    ]
  }, [year, evacuation2024, evacuation2025])

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <Card className="flex flex-col max-w-[400px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Доля эвакуированных</CardTitle>
        <CardDescription>
          <Select
            value={year}
            onValueChange={(v) => setYear(v as "2024" | "2025")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" />
          </PieChart>
        </ChartContainer>

        <div className="flex justify-around mt-4">
          {data.map((item) => {
            const percent =
              total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0"
            return (
              <div
                key={item.name}
                className="flex flex-col items-center gap-1 text-center"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: item.fill }}
                  />
                  {item.name}: <b>{item.value.toFixed(1)}</b>
                </div>
                <span className="text-xs text-gray-500">({percent}%)</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
