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

// Тип для данных графика
export type EvacuationData = {
  name: "departures" | "evacuations"
  value: number
  fill: string
}

interface Props {
  evacuation2024: EvacuationData[]
  evacuation2025: EvacuationData[]
}

// Конфиг (ключи = name в данных)
const chartConfig: ChartConfig = {
  departures: { label: "Выезды", color: "#FF9800" },
  evacuations: { label: "Эвакуации", color: "#4CAF50" },
}

export default function EvacuationPieDiagram({
  evacuation2024 = [],
  evacuation2025 = [],
}: Props) {
  const [year, setYear] = useState<"2024" | "2025">("2024")

  // Данные для выбранного года
  const data = useMemo(() => {
    const dataset = year === "2024" ? evacuation2024 : evacuation2025
    if (!dataset || dataset.length === 0) return []

    const total = dataset.reduce((sum, d) => sum + (d.value || 0), 0)

    return dataset.map((d) => ({
      ...d,
      percent: total > 0 ? ((d.value / total) * 100).toFixed(1) : "0.0",
      value: d.value || 0,
    }))
  }, [year, evacuation2024, evacuation2025])

  if (!data || data.length === 0)
    return (
      <Card className="flex flex-col max-w-[400px]">
        <CardHeader className="items-center pb-0">
          <CardTitle>Соотношение выездов и эвакуаций</CardTitle>
          <CardDescription>
            <Select value={year} onValueChange={(v) => setYear(v as "2024" | "2025")}>
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
        <CardContent className="text-center py-12 text-gray-500">
          Данных за {year} год нет
        </CardContent>
      </Card>
    )

  return (
    <Card className="flex flex-col max-w-[400px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Соотношение выездов и эвакуаций</CardTitle>
        <CardDescription>
          <Select value={year} onValueChange={(v) => setYear(v as "2024" | "2025")}>
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

      <CardContent className="flex flex-col items-center">
        <ChartContainer config={chartConfig} className="w-full max-w-[300px] aspect-square">
          <PieChart key={year}>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" />
          </PieChart>
        </ChartContainer>

        <div className="flex justify-around mt-4 flex-wrap w-full">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center gap-1 text-center min-w-[100px]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: item.fill }}
                />
                {chartConfig[item.name].label}: <b>{item.value}</b>
              </div>
              <span className="text-xs text-gray-500">({item.percent}%)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
