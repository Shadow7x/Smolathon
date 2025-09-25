"use client"

import { useState } from "react"
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

export const description = "Диаграмма штрафов"

const dataByYear = {
  2024: [
    { name: "Невыплаченные", value: 47, fill: "#8BC34A" },
    { name: "Выплаченные", value: 53, fill: "#4CAF50" },
  ],
  2025: [
    { name: "Невыплаченные", value: 40, fill: "#8BC34A" },
    { name: "Выплаченные", value: 60, fill: "#4CAF50" },
  ],
}

const chartConfig = {
  value: {
    label: "Штрафы",
  },
  unpaid: {
    label: "Невыплаченные",
    color: "#8BC34A",
  },
  paid: {
    label: "Выплаченные",
    color: "#4CAF50",
  },
} satisfies ChartConfig

export default function DTPPieDiagram() {
  const [year, setYear] = useState<"2024" | "2025">("2024")

  return (
    <Card className="flex flex-col max-w-[400px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Соотношение штрафов</CardTitle>
        <CardDescription>
          <Select value={year} onValueChange={(val) => setYear(val as "2024" | "2025")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Выберите год" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={dataByYear[year]} dataKey="value" nameKey="name" />
          </PieChart>
        </ChartContainer>

        <div className="flex justify-around mt-4">
          {dataByYear[year].map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: item.fill }}
              />
              {item.name} <b>{item.value}%</b>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
