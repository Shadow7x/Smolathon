"use client"
import { useState, useEffect, useMemo, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNotificationManager } from "@/hooks/notification-context"
import axi from "@/utils/api"
import EvacuationDiagram from "@/components/diogramEvacuation/linediogramEvacuation/linediogramEvacuation"
import EvacuationDeleteDialog from "@/components/evacuationDialog/evacuationdeleatdialog/evacuationdeletedialog"
import EvacuationFormDialog from "@/components/evacuationDialog/evacuationformdialog/evacuationformdialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, Calendar, Filter, ArrowUpDown } from "lucide-react"
import EvacuationPieDiagram from "@/components/diogramEvacuation/piediogramEvacuation/piediogramEvacuation"

interface TowTruck {
  id: number
  date: string
  tow_truck_in_line: number
  count_departures: number
  count_evacuations: number
  summary_of_parking_lot: number
}

// --- маппинг данных для графика ---
const mapForDiagram = (trucks: TowTruck[]) =>
  trucks.map((t) => ({
    date: t.date,
    routes_planned: t.count_departures,       // кол-во выездов
    routes_completed: t.count_evacuations,   // кол-во эвакуаций
    towtrucks_involved: t.tow_truck_in_line, // эвакуаторов на линии
    time_spent: t.summary_of_parking_lot,    // сумма по штрафстоянке (пока сюда)
  }))

// --- Компонент строки таблицы ---
const EvacuationRow = memo(
  ({
    truck,
    formatDate,
    formatNumber,
    fetchTrucks,
  }: {
    truck: TowTruck
    formatDate: (date: string) => string
    formatNumber: (n: number) => string
    fetchTrucks: (year: string) => void
  }) => (
    <TableRow className="hover:bg-gray-50/50 transition-colors">
      <TableCell className="font-medium text-sm py-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          {formatDate(truck.date)}
        </div>
      </TableCell>
      <TableCell className="text-sm py-3 text-right font-mono">
        {formatNumber(truck.tow_truck_in_line)}
      </TableCell>
      <TableCell className="text-sm py-3 text-right font-mono">
        {formatNumber(truck.count_departures)}
      </TableCell>
      <TableCell className="text-sm py-3 text-right font-mono text-blue-600 font-semibold">
        {formatNumber(truck.count_evacuations)}
      </TableCell>
      <TableCell className="text-sm py-3 text-right font-mono text-green-600 font-semibold">
        {formatNumber(truck.summary_of_parking_lot)} ₽
      </TableCell>
      <TableCell className="py-3">
        <div className="flex gap-2 justify-end">
          <EvacuationFormDialog truck={truck} onSuccess={fetchTrucks} />
          <EvacuationDeleteDialog truckId={truck.id} onSuccess={fetchTrucks} />
        </div>
      </TableCell>
    </TableRow>
  )
)
EvacuationRow.displayName = "EvacuationRow"

// --- Основной компонент ---
export default function AnalyticsSectionEvacuation() {
  const [showTable, setShowTable] = useState(true)
  const [allTrucks, setAllTrucks] = useState<TowTruck[]>([])
  const [trucks2024, setTrucks2024] = useState<TowTruck[]>([])
  const [trucks2025, setTrucks2025] = useState<TowTruck[]>([])
  const [loading, setLoading] = useState(false)
  const [yearFilter, setYearFilter] = useState("")
  const { addNotification } = useNotificationManager()
  const [monthFilter, setMonthFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [trucks, setTrucks] = useState<TowTruck[]>([])
  const [inputYear, setInputYear] = useState("")

  // --- загрузка данных для графика ---
  useEffect(() => {
    fetchTrucksByYear()
  }, [])

  const fetchTrucksByYear = async () => {
    try {
      setLoading(true)
      const [response2024, response2025] = await Promise.all([
        axi.get("/analytics/towTrucks/get?year=2024").catch(() => ({ data: [] })),
        axi.get("/analytics/towTrucks/get?year=2025").catch(() => ({ data: [] })),
      ])
      setTrucks2024(response2024?.data || [])
      setTrucks2025(response2025?.data || [])
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Не удалось загрузить данные для диаграммы",
        status: 500,
        createdAt: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  // --- загрузка таблицы по году ---
  const fetchTrucks = async (year: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (year) params.append("year", year)
      const response = await axi.get(`/analytics/towTrucks/get?${params}`)
      setAllTrucks(response.data)
      setTrucks(response.data)
      setMonthFilter("all")
      setSortOrder("desc")
      setYearFilter(year)
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Не удалось загрузить данные",
        status: error.response?.status || 500,
        createdAt: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  // фильтры и сортировка
  useEffect(() => {
    let filtered = [...allTrucks]
    if (monthFilter !== "all") {
      const month = Number(monthFilter)
      filtered = filtered.filter(
        (p) => new Date(p.date).getMonth() + 1 === month
      )
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })
    setTrucks(filtered)
  }, [allTrucks, monthFilter, sortOrder])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ru-RU")

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("ru-RU").format(num)

  const displayedTrucks = useMemo(() => {
    let filtered = [...allTrucks]
    if (monthFilter !== "all") {
      filtered = filtered.filter(
        (p) => new Date(p.date).getMonth() + 1 === Number(monthFilter)
      )
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })
    return filtered
  }, [allTrucks, monthFilter, sortOrder])

  return (
    <div className="space-y-6 p-4 max-w-[1400px] mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Аналитика эвакуаторов
      </h1>
      <div className="flex max-w-[1400px] justify-between">
        <EvacuationDiagram
          evacuation2024={mapForDiagram(trucks2024)}
          evacuation2025={mapForDiagram(trucks2025)}
        />
        <EvacuationPieDiagram />
      </div>
      {/* загрузка данных */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Просмотр данных</CardTitle>
          <CardDescription>
            Загрузите данные об эвакуаторах с возможностью фильтрации по году
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="year-filter">Год</Label>
              <Input
                id="year-filter"
                type="number"
                placeholder="Например: 2024"
                value={inputYear}
                onChange={(e) => setInputYear(e.target.value)}
                min="2000"
                max="2030"
                className="h-10"
              />
            </div>
            <Button
              onClick={() => fetchTrucks(inputYear)}
              disabled={loading || !inputYear.trim()}
              className="h-10"
            >
              {loading ? "Загрузка..." : "Загрузить данные"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* таблица */}
      {trucks.length > 0 && (
        <Card className="w-full">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">
                  Данные об эвакуаторах {yearFilter && `за ${yearFilter} год`}
                </CardTitle>
                <CardDescription>
                  Всего записей: {displayedTrucks.length}
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTable(!showTable)}
                  className="flex items-center gap-2 h-9"
                >
                  {showTable ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  {showTable ? "Скрыть таблицу" : "Показать таблицу"}
                </Button>
                <EvacuationFormDialog onSuccess={fetchTrucks} />
              </div>
            </div>
          </CardHeader>

          {showTable && (
            <CardContent>
              {/* фильтры */}
              <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Фильтры:
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Сортировка:</span>
                  <Select
                    value={sortOrder}
                    onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
                  >
                    <SelectTrigger className="w-[160px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Сначала новые</SelectItem>
                      <SelectItem value="asc">Сначала старые</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Месяц:</span>
                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="Все месяцы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все месяцы</SelectItem>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {new Date(0, i).toLocaleString("ru-RU", { month: "long" })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* таблица */}
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead className="text-right">
                        Эвакуаторов на линии
                      </TableHead>
                      <TableHead className="text-right">Выезды</TableHead>
                      <TableHead className="text-right">Эвакуации</TableHead>
                      <TableHead className="text-right">
                        Сумма по штрафстоянке
                      </TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedTrucks.map((truck) => (
                      <EvacuationRow
                        key={truck.id}
                        truck={truck}
                        formatDate={formatDate}
                        formatNumber={formatNumber}
                        fetchTrucks={fetchTrucks}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 text-sm text-gray-500 text-center">
                Показано {displayedTrucks.length} записей из {allTrucks.length}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
