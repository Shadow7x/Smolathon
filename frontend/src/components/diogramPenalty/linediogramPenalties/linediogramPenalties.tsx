"use client"

import { useState, useMemo } from "react"
import { TrendingUp, Calendar } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Penalty {
  date: string
  violations_cumulative: number
  decrees_cumulative: number
  fines_imposed_cumulative: number
  fines_collected_cumulative: number
}

interface DiogramProps {
  penalties2024?: Penalty[]
  penalties2025?: Penalty[]
}

const fieldOptions = {
  violations_cumulative: "Нарушения",
  decrees_cumulative: "Постановления",
  fines_imposed_cumulative: "Наложенные штрафы",
  fines_collected_cumulative: "Взысканные штрафы",
}

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
]

const quarterOptions = [
  { value: 1, label: "Первый квартал (Январь–Март)" },
  { value: 2, label: "Второй квартал (Апрель–Июнь)" },
  { value: 3, label: "Третий квартал (Июль–Сентябрь)" },
  { value: 4, label: "Четвёртый квартал (Октябрь–Декабрь)" },
]

export default function PenaltyDiagram({
  penalties2024 = [],
  penalties2025 = [],
}: DiogramProps) {
  const [show2024, setShow2024] = useState(true)
  const [show2025, setShow2025] = useState(true)
  const [selectedField, setSelectedField] =
    useState<keyof Penalty>("fines_collected_cumulative")
  const [period, setPeriod] = useState<"day" | "month" | "quarter">("month")
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  )
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1)

  // Доступные месяцы из данных
  const availableMonths = useMemo(() => {
    const months = new Set<number>()
    penalties2024.concat(penalties2025).forEach((p) => {
      if (!p.date) return
      months.add(new Date(p.date).getMonth() + 1)
    })
    return Array.from(months).sort()
  }, [penalties2024, penalties2025])

  // Подготовка данных
  const chartData = useMemo(() => {
    if (period === "month") {
      return monthNames.map((month, idx) => {
        const monthNum = idx + 1
        const p2024 = penalties2024.find(
          (p) =>
            new Date(p.date).getMonth() + 1 === monthNum &&
            new Date(p.date).getFullYear() === 2024
        )
        const p2025 = penalties2025.find(
          (p) =>
            new Date(p.date).getMonth() + 1 === monthNum &&
            new Date(p.date).getFullYear() === 2025
        )
        return {
          period: month,
          fines_2024: p2024 ? p2024[selectedField] : 0,
          fines_2025: p2025 ? p2025[selectedField] : 0,
        }
      })
    }

    if (period === "quarter") {
      const start = (selectedQuarter - 1) * 3 + 1
      const monthsRange = monthNames.slice(start - 1, start + 2)
      return monthsRange.map((m, i) => {
        const monthNum = start + i
        const p2024 = penalties2024.find(
          (p) =>
            new Date(p.date).getMonth() + 1 === monthNum &&
            new Date(p.date).getFullYear() === 2024
        )
        const p2025 = penalties2025.find(
          (p) =>
            new Date(p.date).getMonth() + 1 === monthNum &&
            new Date(p.date).getFullYear() === 2025
        )
        return {
          period: m,
          fines_2024: p2024 ? p2024[selectedField] : 0,
          fines_2025: p2025 ? p2025[selectedField] : 0,
        }
      })
    }

    // По дням
    const days = new Date(2024, selectedMonth, 0).getDate()
    return Array.from({ length: days }, (_, i) => {
      const day = i + 1
      const d2024 = `2024-${String(selectedMonth).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`
      const d2025 = `2025-${String(selectedMonth).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`
      const p2024 = penalties2024.find((p) => p.date === d2024)
      const p2025 = penalties2025.find((p) => p.date === d2025)
      return {
        period: day.toString(),
        fines_2024: p2024 ? p2024[selectedField] : 0,
        fines_2025: p2025 ? p2025[selectedField] : 0,
      }
    })
  }, [period, selectedField, selectedMonth, selectedQuarter, penalties2024, penalties2025])

  // Итоги
  const total2024 = penalties2024.reduce(
    (s, p) => s + (p?.[selectedField] || 0),
    0
  )
  const total2025 = penalties2025.reduce(
    (s, p) => s + (p?.[selectedField] || 0),
    0
  )
  const growth =
    total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(1) : "0.0"

  return (
    <div className="flex flex-col w-full max-w-[1000px]">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Динамика штрафов</h2>
        {show2024 && show2025 && growth !== "0.0" && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>{growth}%</span>
          </div>
        )}
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <label className="flex items-center gap-2">
          <Checkbox checked={show2024} onCheckedChange={(v) => setShow2024(!!v)} />
          2024
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={show2025} onCheckedChange={(v) => setShow2025(!!v)} />
          2025
        </label>

        <div className="flex items-center gap-2">
          <span>Метрика:</span>
          <Select
            value={selectedField}
            onValueChange={(v) => setSelectedField(v as keyof Penalty)}
          >
            <SelectTrigger className="w-[180px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fieldOptions).map(([k, l]) => (
                <SelectItem key={k} value={k}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span>Период:</span>
          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as "day" | "month" | "quarter")}
          >
            <SelectTrigger className="w-[120px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">День</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {period === "day" && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Select
              value={selectedMonth.toString()}
              onValueChange={(v) => setSelectedMonth(parseInt(v))}
            >
              <SelectTrigger className="w-[140px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((m) => (
                  <SelectItem key={m} value={m.toString()}>
                    {monthNames[m - 1]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {period === "quarter" && (
          <div className="flex items-center gap-2">
            <Select
              value={selectedQuarter.toString()}
              onValueChange={(v) => setSelectedQuarter(parseInt(v))}
            >
              <SelectTrigger className="w-[220px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {quarterOptions.map((q) => (
                  <SelectItem key={q.value} value={q.value.toString()}>
                    {q.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Чарт */}
      <ChartContainer
        config={{
          fines_2024: { label: "2024", color: "hsl(220, 70%, 50%)" },
          fines_2025: { label: "2025", color: "hsl(160, 70%, 50%)" },
        }}
        className="w-full h-[250px]"
      >
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) =>
              v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
            }
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {show2024 && (
            <Line
              type="monotone"
              dataKey="fines_2024"
              stroke="var(--color-fines_2024)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
          {show2025 && (
            <Line
              type="monotone"
              dataKey="fines_2025"
              stroke="var(--color-fines_2025)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
        </LineChart>
      </ChartContainer>
    </div>
  )
}
