"use client"

import { useState, useMemo } from "react"
import { Pie, PieChart } from "recharts"
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

interface Penalty {
  id: number
  date: string
  violations_cumulative: number
  decrees_cumulative: number
  fines_imposed_cumulative: number
  fines_collected_cumulative: number
}

interface Props {
  penalties2024: Penalty[]
  penalties2025: Penalty[]
}

const chartConfig = {
  unpaid: { label: "Невыплаченные", color: "#F44336" },
  paid: { label: "Выплаченные", color: "#4CAF50" },
} satisfies ChartConfig

export default function Piediogram({ penalties2024, penalties2025 }: Props) {
  const [year, setYear] = useState<"2024" | "2025">("2024")

  const data = useMemo(() => {
    const dataset = year === "2024" ? penalties2024 : penalties2025

    const imposed = dataset.reduce(
      (sum, p) => sum + Number(p.fines_imposed_cumulative ?? 0),
      0
    )
    const collected = dataset.reduce(
      (sum, p) => sum + Number(p.fines_collected_cumulative ?? 0),
      0
    )
    const unpaid = Math.max(imposed - collected, 0)

    return [
      { name: "Выплаченные", value: collected, fill: chartConfig.paid.color },
      { name: "Невыплаченные", value: unpaid, fill: chartConfig.unpaid.color },
    ]
  }, [year, penalties2024, penalties2025])

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex flex-col items-center w-full max-w-[400px]">
      {/* Заголовок + селект */}
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-lg font-semibold">Соотношение штрафов</h2>
        <Select value={year} onValueChange={(v) => setYear(v as "2024" | "2025")}>
          <SelectTrigger className="w-[120px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Диаграмма */}
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-h-[220px] sm:max-h-[280px]"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={data} dataKey="value" nameKey="name" />
        </PieChart>
      </ChartContainer>

      {/* Легенда */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mt-4">
        {data.map((item) => {
          const percent =
            total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0"
          return (
            <div
              key={item.name}
              className="flex flex-col items-center text-center text-sm"
            >
              <div className="flex items-center flex-col gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: item.fill }}
                />
                {item.name}: <b>{item.value.toLocaleString("ru-RU")} ₽</b>
              </div>
              <span className="text-xs text-gray-500">({percent}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
