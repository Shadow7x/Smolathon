"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
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
  ChartConfig,
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

export default function Diogram({ 
  penalties2024 = [],
  penalties2025 = [] 
}: DiogramProps) {
  const [show2024, setShow2024] = useState(true)
  const [show2025, setShow2025] = useState(true)
  const [selectedField, setSelectedField] = useState<keyof Penalty>("fines_collected_cumulative")

  const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ]

  const chartData = months.map((month, index) => {
    const monthNumber = index + 1
    
    const data2024 = penalties2024?.find(penalty => {
      if (!penalty?.date) return false
      const date = new Date(penalty.date)
      return date.getMonth() + 1 === monthNumber && date.getFullYear() === 2024
    }) || null

    const data2025 = penalties2025?.find(penalty => {
      if (!penalty?.date) return false
      const date = new Date(penalty.date)
      return date.getMonth() + 1 === monthNumber && date.getFullYear() === 2025
    }) || null

    return {
      month,
      fines_2024: data2024 ? data2024[selectedField] : 0,
      fines_2025: data2025 ? data2025[selectedField] : 0,
    }
  })

  const total2024 = penalties2024?.reduce((sum, p) => sum + (p?.[selectedField] || 0), 0) || 0
  const total2025 = penalties2025?.reduce((sum, p) => sum + (p?.[selectedField] || 0), 0) || 0
  const growthPercentage = total2024 > 0 
    ? ((total2025 - total2024) / total2024 * 100).toFixed(1)
    : "0.0"

  if (!penalties2024.length && !penalties2025.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Динамика штрафов</CardTitle>
          <CardDescription>Нет данных для отображения</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-30">
          <p className="text-muted-foreground">Загрузите данные о штрафах</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Динамика штрафов</CardTitle>
        <CardDescription>Сравнение данных за 2024 и 2025 годы</CardDescription>
      </CardHeader>
      
      {/* Фильтры */}
      <CardContent className="flex gap-6 flex-wrap mb-4">
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
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Выберите поле" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fieldOptions).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      {/* Чарт */}
      <CardContent>
        <ChartContainer
          config={{
            fines_2024: { label: "2024", color: "hsl(220, 70%, 50%)" },
            fines_2025: { label: "2025", color: "hsl(160, 70%, 50%)" },
          }}
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                return value.toString()
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            
            {show2024 && (
              <Line
                dataKey="fines_2024"
                type="monotone"
                stroke="var(--color-fines_2024)"
                strokeWidth={2}
                dot={{ fill: "var(--color-fines_2024)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            
            {show2025 && (
              <Line
                dataKey="fines_2025"
                type="monotone"
                stroke="var(--color-fines_2025)"
                strokeWidth={2}
                dot={{ fill: "var(--color-fines_2025)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>

      {/* Итоги */}
      <CardFooter>
        <div className="flex w-full items-center gap-2 text-sm flex-wrap">
          {show2024 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[hsl(220,70%,50%)]"></div>
              <span>2024: {total2024.toLocaleString('ru-RU')}</span>
            </div>
          )}
          {show2025 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[hsl(160,70%,50%)]"></div>
              <span>2025: {total2025.toLocaleString('ru-RU')}</span>
            </div>
          )}
          {show2024 && show2025 && growthPercentage !== "0.0" && (
            <div className="flex items-center gap-1 ml-auto">
              <TrendingUp className="h-4 w-4" />
              <span>{growthPercentage}%</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
