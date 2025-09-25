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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TowTruck {
  date: string
  routes_planned: number
  routes_completed: number
  towtrucks_involved: number
  time_spent: number // суммарное время (например, в минутах)
}

interface DiagramProps {
  evacuation2024?: TowTruck []
  evacuation2025?: TowTruck []
}

const fieldOptions = {
  routes_planned: "Запланированные маршруты",
  routes_completed: "Завершённые маршруты",
  towtrucks_involved: "Задействованные эвакуаторы",
  time_spent: "Время эвакуации (мин)",
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

export default function EvacuationDiagram({
  evacuation2024 = [],
  evacuation2025 = [],
}: DiagramProps) {
  const [show2024, setShow2024] = useState(true)
  const [show2025, setShow2025] = useState(true)
  const [selectedField, setSelectedField] = useState<keyof Evacuation>("routes_completed")
  const [period, setPeriod] = useState<"day" | "month" | "quarter">("month")
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1)

  // доступные месяцы
  const availableMonths = useMemo(() => {
    const months = new Set<number>()
    evacuation2024.concat(evacuation2025).forEach((item) => {
      if (!item.date) return
      const date = new Date(item.date)
      months.add(date.getMonth() + 1)
    })
    return Array.from(months).sort()
  }, [evacuation2024, evacuation2025])

  // подготовка данных
  const prepareChartData = () => {
    if (period === "month") {
      return monthNames.map((month, index) => {
        const monthNumber = index + 1
        const data2024 = evacuation2024.find(e => {
          const d = new Date(e.date)
          return d.getMonth() + 1 === monthNumber && d.getFullYear() === 2024
        })
        const data2025 = evacuation2025.find(e => {
          const d = new Date(e.date)
          return d.getMonth() + 1 === monthNumber && d.getFullYear() === 2025
        })
        return {
          period: month,
          value2024: data2024 ? data2024[selectedField] : 0,
          value2025: data2025 ? data2025[selectedField] : 0,
        }
      })
    }

    if (period === "quarter") {
      const quarterStart = (selectedQuarter - 1) * 3 + 1
      const quarterEnd = quarterStart + 2
      const monthsRange = monthNames.slice(quarterStart - 1, quarterEnd)

      return monthsRange.map((month, index) => {
        const monthNumber = quarterStart + index
        const data2024 = evacuation2024.find(e => {
          const d = new Date(e.date)
          return d.getMonth() + 1 === monthNumber && d.getFullYear() === 2024
        })
        const data2025 = evacuation2025.find(e => {
          const d = new Date(e.date)
          return d.getMonth() + 1 === monthNumber && d.getFullYear() === 2025
        })
        return {
          period: month,
          value2024: data2024 ? data2024[selectedField] : 0,
          value2025: data2025 ? data2025[selectedField] : 0,
        }
      })
    }

    // по дням месяца
    const daysInMonth = new Date(2024, selectedMonth, 0).getDate()
    const chartData = []
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr2024 = `2024-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      const dateStr2025 = `2025-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      const data2024 = evacuation2024.find(e => e.date === dateStr2024)
      const data2025 = evacuation2025.find(e => e.date === dateStr2025)
      chartData.push({
        period: day.toString(),
        value2024: data2024 ? data2024[selectedField] : 0,
        value2025: data2025 ? data2025[selectedField] : 0,
      })
    }
    return chartData
  }

  const chartData = prepareChartData()
  const total2024 = evacuation2024.reduce((sum, e) => sum + (e?.[selectedField] || 0), 0)
  const total2025 = evacuation2025.reduce((sum, e) => sum + (e?.[selectedField] || 0), 0)
  const growthPercentage = total2024 > 0
    ? ((total2025 - total2024) / total2024 * 100).toFixed(1)
    : "0.0"

  return (
    <Card className="w-full max-w-[950px]">
      <CardHeader>
        <CardTitle>Динамика эвакуации</CardTitle>
        <CardDescription>Сравнение данных за 2024 и 2025 годы</CardDescription>
      </CardHeader>

      {/* фильтры */}
      <CardContent className="flex flex-wrap gap-4">
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
          <Select value={selectedField} onValueChange={(v) => setSelectedField(v as keyof Evacuation)}>
            <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(fieldOptions).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span>Период:</span>
          <Select value={period} onValueChange={(v) => setPeriod(v as "day" | "month" | "quarter")}>
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
            <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
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
            <Select value={selectedQuarter.toString()} onValueChange={(v) => setSelectedQuarter(parseInt(v))}>
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

      {/* график */}
      <CardContent>
        <ChartContainer
          config={{
            value2024: { label: "2024", color: "hsl(220, 70%, 50%)" },
            value2025: { label: "2025", color: "hsl(160, 70%, 50%)" },
          }}
          className="h-[200px] w-full"
        >
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {show2024 && <Line type="monotone" dataKey="value2024" stroke="var(--color-value2024)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />}
            {show2025 && <Line type="monotone" dataKey="value2025" stroke="var(--color-value2025)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />}
          </LineChart>
        </ChartContainer>
      </CardContent>

      {/* итоги */}
      <CardFooter className="flex flex-wrap items-center gap-4 text-sm">
        {show2024 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(220,70%,50%)]"></div>
            <span>2024</span>
          </div>
        )}
        {show2025 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(160,70%,50%)]"></div>
            <span>2025</span>
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
