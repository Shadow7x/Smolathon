"use client"

import { useState, useMemo } from "react"
import { Pie, PieChart } from "recharts"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DTP {
  id: number
  statistical_factor: string
  count: number
  month: string
  year: number
}

interface Props {
  DTP2024?: DTP[]
  DTP2025?: DTP[]
}

const chartConfig = {
  injured: { label: "Раненые", color: "#4CAF50" },
  dead: { label: "Погибшие", color: "#F44336" },
} satisfies ChartConfig

export default function DTPPieDiagram({ DTP2024 = [], DTP2025 = [] }: Props) {
  const [year, setYear] = useState<"2024" | "2025">("2024")

  const data = useMemo(() => {
    const dataset = year === "2024" ? DTP2024 : DTP2025
    const injured = dataset
      .filter(d => d.statistical_factor.includes("ранения"))
      .reduce((s, d) => s + d.count, 0)
    const dead = dataset
      .filter(d => d.statistical_factor.includes("погибш"))
      .reduce((s, d) => s + d.count, 0)
    return [
      { name: "Раненые", value: injured, fill: chartConfig.injured.color },
      { name: "Погибшие", value: dead, fill: chartConfig.dead.color },
    ]
  }, [year, DTP2024, DTP2025])

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card className="flex flex-col max-w-[400px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Соотношение раненых и погибших</CardTitle>
        <CardDescription>
          <Select value={year} onValueChange={v => setYear(v as "2024" | "2025")}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" />
          </PieChart>
        </ChartContainer>

        <div className="flex justify-around mt-4">
          {data.map((item) => {
            const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0"
            return (
              <div key={item.name} className="flex flex-col items-center gap-1 text-center">
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
