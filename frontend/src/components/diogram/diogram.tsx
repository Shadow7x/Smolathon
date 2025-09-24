"use client"

import { useState, useMemo } from "react"
import { TrendingUp, Calendar } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
]

export default function Diogram({
  penalties2024 = [],
  penalties2025 = []
}: DiogramProps) {
  const [show2024, setShow2024] = useState(true)
  const [show2025, setShow2025] = useState(true)
  const [selectedField, setSelectedField] = useState<keyof Penalty>("fines_collected_cumulative")
  const [period, setPeriod] = useState<"day" | "month" | "quarter">("month")
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1)

  // Доступные месяцы
  const availableMonths = useMemo(() => {
    const months = new Set<number>()
    penalties2024.concat(penalties2025).forEach((penalty) => {
      if (!penalty.date) return
      const date = new Date(penalty.date)
      months.add(date.getMonth() + 1)
    })
    return Array.from(months).sort()
  }, [penalties2024, penalties2025])

  // Подготовка данных
  const prepareChartData = () => {
    if (period === "month") {
      return monthNames.map((month, index) => {
        const monthNumber = index + 1
        const data2024 = penalties2024.find(p => {
          const date = new Date(p.date)
          return date.getMonth() + 1 === monthNumber && date.getFullYear() === 2024
        })
        const data2025 = penalties2025.find(p => {
          const date = new Date(p.date)
          return date.getMonth() + 1 === monthNumber && date.getFullYear() === 2025
        })
        return {
          period: month,
          fines_2024: data2024 ? data2024[selectedField] : 0,
          fines_2025: data2025 ? data2025[selectedField] : 0,
        }
      })
    }

    if (period === "quarter") {
      const quarterStart = (selectedQuarter - 1) * 3 + 1
      const quarterEnd = quarterStart + 2
      const monthsRange = monthNames.slice(quarterStart - 1, quarterEnd)

      return monthsRange.map((month, index) => {
        const monthNumber = quarterStart + index
        const data2024 = penalties2024.find(p => {
          const date = new Date(p.date)
          return date.getMonth() + 1 === monthNumber && date.getFullYear() === 2024
        })
        const data2025 = penalties2025.find(p => {
          const date = new Date(p.date)
          return date.getMonth() + 1 === monthNumber && date.getFullYear() === 2025
        })
        return {
          period: month,
          fines_2024: data2024 ? data2024[selectedField] : 0,
          fines_2025: data2025 ? data2025[selectedField] : 0,
        }
      })
    }

    // По дням месяца
    const daysInMonth = new Date(2024, selectedMonth, 0).getDate()
    const chartData = []
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr2024 = `2024-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      const dateStr2025 = `2025-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      const data2024 = penalties2024.find(p => p.date === dateStr2024)
      const data2025 = penalties2025.find(p => p.date === dateStr2025)
      chartData.push({
        period: day.toString(),
        fines_2024: data2024 ? data2024[selectedField] : 0,
        fines_2025: data2025 ? data2025[selectedField] : 0,
      })
    }
    return chartData
  }

  const chartData = prepareChartData()
  const total2024 = penalties2024.reduce((sum, p) => sum + (p?.[selectedField] || 0), 0)
  const total2025 = penalties2025.reduce((sum, p) => sum + (p?.[selectedField] || 0), 0)
  const growthPercentage = total2024 > 0
    ? ((total2025 - total2024) / total2024 * 100).toFixed(1)
    : "0.0"

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Динамика штрафов</CardTitle>
        <CardDescription>Сравнение данных за 2024 и 2025 годы</CardDescription>
      </CardHeader>

      {/* Фильтры */}
      <CardContent className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Checkbox id="year2024" checked={show2024} onCheckedChange={(v) => setShow2024(!!v)} />
          <label htmlFor="year2024">Показать 2024</label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="year2025" checked={show2025} onCheckedChange={(v) => setShow2025(!!v)} />
          <label htmlFor="year2025">Показать 2025</label>
        </div>

        <div className="flex items-center gap-2">
          <span>Метрика:</span>
          <Select value={selectedField} onValueChange={(v) => setSelectedField(v as keyof Penalty)}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(fieldOptions).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span>Период:</span>
          <Select
            value={period}
            onValueChange={(v) => {
              setPeriod(v as "day" | "month" | "quarter")
            }}
          >
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
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
            <span>Месяц:</span>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(v) => setSelectedMonth(parseInt(v))}
            >
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {availableMonths.map(month => (
                  <SelectItem key={month} value={month.toString()}>{monthNames[month - 1]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {period === "quarter" && (
          <div className="flex items-center gap-2">
            <span>Квартал:</span>
            <Select
              value={selectedQuarter.toString()}
              onValueChange={(v) => setSelectedQuarter(parseInt(v))}
            >
              <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {quarterOptions.map(q => (
                  <SelectItem key={q.value} value={q.value.toString()}>{q.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>

      {/* График */}
      <CardContent>
        <ChartContainer
          config={{
            fines_2024: { label: "2024", color: "hsl(220, 70%, 50%)" },
            fines_2025: { label: "2025", color: "hsl(160, 70%, 50%)" },
          }}
          className="h-[300px] w-full"
        >
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                return value.toString()
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            {show2024 && <Line type="monotone" dataKey="fines_2024" stroke="var(--color-fines_2024)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />}
            {show2025 && <Line type="monotone" dataKey="fines_2025" stroke="var(--color-fines_2025)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />}
          </LineChart>
        </ChartContainer>
      </CardContent>

      {/* Итоги */}
      <CardFooter className="flex flex-wrap items-center gap-4 text-sm">
        {show2024 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(220,70%,50%)]"></div>
            <span>2024: {total2024.toLocaleString('ru-RU')}</span>
          </div>
        )}
        {show2024 && show2025 && growthPercentage !== "0.0" && (
          <div className="flex items-center gap-1 ml-auto">
            <TrendingUp className="h-4 w-4" />
            <span>{growthPercentage}%</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
