"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DTP {
  id: number
  point_FPSR: string
  statistical_factor: string
  count: number
  month: string
  year: number
}

interface Props {
  DTP2024?: DTP[]
  DTP2025?: DTP[]
}

const factorOptions: Record<string, string> = {
  "Количество ДТП с пострадавшими": "Количество ДТП с пострадавшими",
  "Количество лиц, погибших в результате ДТП": "Количество погибших",
  "Количество лиц, получивших ранения в результате совершения ДТП": "Количество раненых",
  "Число погибших на 100 пострадавших": "Погибшие на 100 пострадавших",
}

const monthNames = [
  "январь","февраль","март","апрель","май","июнь",
  "июль","август","сентябрь","октябрь","ноябрь","декабрь"
]

function normalizeMonth(month: string): number {
  const idx = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase())
  return idx >= 0 ? idx + 1 : 0
}

export default function DTPLineDiagram({ DTP2024 = [], DTP2025 = [] }: Props) {
  const [show2024, setShow2024] = useState(true)
  const [show2025, setShow2025] = useState(true)
  const [selectedFactor, setSelectedFactor] = useState<string>("Количество ДТП с пострадавшими")
  const [period, setPeriod] = useState<"month" | "quarter">("month")
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1)

  const chartData = (() => {
    if (period === "month") {
      return monthNames.map((month, idx) => {
        const monthNum = idx + 1
        const d2024 = DTP2024.find(d => d.year === 2024 && normalizeMonth(d.month) === monthNum && d.statistical_factor === selectedFactor)
        const d2025 = DTP2025.find(d => d.year === 2025 && normalizeMonth(d.month) === monthNum && d.statistical_factor === selectedFactor)
        return {
          period: month[0].toUpperCase() + month.slice(1),
          value_2024: d2024 ? d2024.count : 0,
          value_2025: d2025 ? d2025.count : 0,
        }
      })
    }
    if (period === "quarter") {
      const start = (selectedQuarter - 1) * 3 + 1
      const end = start + 2
      return monthNames.slice(start - 1, end).map((month, idx) => {
        const monthNum = start + idx
        const d2024 = DTP2024.find(d => d.year === 2024 && normalizeMonth(d.month) === monthNum && d.statistical_factor === selectedFactor)
        const d2025 = DTP2025.find(d => d.year === 2025 && normalizeMonth(d.month) === monthNum && d.statistical_factor === selectedFactor)
        return {
          period: month[0].toUpperCase() + month.slice(1),
          value_2024: d2024 ? d2024.count : 0,
          value_2025: d2025 ? d2025.count : 0,
        }
      })
    }
    return []
  })()

  const total2024 = DTP2024.filter(d => d.statistical_factor === selectedFactor).reduce((s, d) => s + d.count, 0)
  const total2025 = DTP2025.filter(d => d.statistical_factor === selectedFactor).reduce((s, d) => s + d.count, 0)
  const growth = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(1) : "0.0"

  return (
    <Card className="w-full max-w-[950px]">
      <CardHeader>
        <CardTitle>Динамика ДТП</CardTitle>
        <CardDescription>Сравнение данных за 2024 и 2025 годы</CardDescription>
      </CardHeader>

      {/* фильтры */}
      <CardContent className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Checkbox checked={show2024} onCheckedChange={v => setShow2024(!!v)} /> 2024
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={show2025} onCheckedChange={v => setShow2025(!!v)} /> 2025
        </div>
        <div className="flex items-center gap-2">
          Метрика:
          <Select value={selectedFactor} onValueChange={setSelectedFactor}>
            <SelectTrigger className="w-[250px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(factorOptions).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          Период:
          <Select value={period} onValueChange={v => setPeriod(v as any)}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {period === "quarter" && (
          <Select value={selectedQuarter.toString()} onValueChange={v => setSelectedQuarter(Number(v))}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 квартал (Янв–Мар)</SelectItem>
              <SelectItem value="2">2 квартал (Апр–Июн)</SelectItem>
              <SelectItem value="3">3 квартал (Июл–Сен)</SelectItem>
              <SelectItem value="4">4 квартал (Окт–Дек)</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardContent>

      {/* график */}
      <CardContent>
        <ChartContainer
          config={{
            value_2024: { label: "2024", color: "hsl(220, 70%, 50%)" },
            value_2025: { label: "2025", color: "hsl(160, 70%, 50%)" },
          }}
          className="h-[200px] w-full"
        >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis tickFormatter={(v) => v.toFixed(1)} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {show2024 && <Line type="monotone" dataKey="value_2024" stroke="var(--color-value_2024)" />}
            {show2025 && <Line type="monotone" dataKey="value_2025" stroke="var(--color-value_2025)" />}
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex gap-4 text-sm">
        {show2024 && <span className="flex items-center gap-1"><div className="w-3 h-3 bg-[hsl(220,70%,50%)] rounded-full"></div>2024</span>}
        {show2025 && <span className="flex items-center gap-1"><div className="w-3 h-3 bg-[hsl(160,70%,50%)] rounded-full"></div>2025</span>}
        {show2024 && show2025 && <span className="ml-auto flex items-center gap-1"><TrendingUp className="h-4 w-4" />{growth}%</span>}
      </CardFooter>
    </Card>
  )
}
