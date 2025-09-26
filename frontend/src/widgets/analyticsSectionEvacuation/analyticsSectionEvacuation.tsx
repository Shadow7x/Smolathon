"use client"

import { useState, useEffect, memo } from "react"
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
import EvacuationPieDiagram, { EvacuationData } from "@/components/diogramEvacuation/piediogramEvacuation/piediogramEvacuation"
import EvacuationDeleteDialog from "@/components/evacuationDialog/evacuationdeleatdialog/evacuationdeletedialog"
import EvacuationFormDialog from "@/components/evacuationDialog/evacuationformdialog/evacuationformdialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, Calendar, ArrowUpDown, Upload } from "lucide-react"

interface TowTruck {
  id: number
  date: string
  tow_truck_in_line: number
  count_departures: number
  count_evacuations: number
  summary_of_parking_lot: number
}

const mapForDiagram = (trucks: TowTruck[]) =>
  trucks.map((t) => ({
    date: t.date,
    routes_planned: t.count_departures,
    routes_completed: t.count_evacuations,
    towtrucks_involved: t.tow_truck_in_line,
    time_spent: t.summary_of_parking_lot,
  }))

const mapForPieDiagram = (trucks: TowTruck[]): EvacuationData[] => {
  const totalDepartures = trucks.reduce((acc, t) => acc + t.count_departures, 0)
  const totalCompleted = trucks.reduce((acc, t) => acc + t.count_evacuations, 0)
  const totalInProgress = totalDepartures - totalCompleted

  return [
    { name: "Завершено", value: totalCompleted, fill: "#4CAF50" },
    { name: "В процессе", value: totalInProgress, fill: "#FF9800" },
  ]
}

const EvacuationRow = memo(
  ({
    truck,
    formatDate,
    formatNumber,
  }: {
    truck: TowTruck
    formatDate: (date: string) => string
    formatNumber: (n: number) => string
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
        <div className="flex gap-2 justify-end flex-wrap">
          <EvacuationFormDialog truck={truck} onSuccess={() => {}} />
          <EvacuationDeleteDialog truckId={truck.id} onSuccess={() => {}} />
        </div>
      </TableCell>
    </TableRow>
  )
)
EvacuationRow.displayName = "EvacuationRow"

export default function AnalyticsSectionEvacuation() {
  const [showTable, setShowTable] = useState(true)
  const [allTrucks, setAllTrucks] = useState<TowTruck[]>([])
  const [trucks2024, setTrucks2024] = useState<TowTruck[]>([])
  const [trucks2025, setTrucks2025] = useState<TowTruck[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [yearFilter, setYearFilter] = useState("")
  const { addNotification } = useNotificationManager()
  const [monthFilter, setMonthFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [displayedTrucks, setDisplayedTrucks] = useState<TowTruck[]>([])
  const [inputYear, setInputYear] = useState("")

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

  const fetchTrucks = async (year: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (year) params.append("year", year)
      const response = await axi.get(`/analytics/towTrucks/get?${params}`)
      setAllTrucks(response.data)
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData(e.target as HTMLFormElement)
    const file = data.get("file") as File
    if (!file) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const res = await axi.post("/analytics/towTrucks/createFromExcel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      addNotification({
        id: Date.now().toString(),
        title: "Успешно",
        description: "Файл загружен",
        status: res.status || 200,
        createdAt: new Date().toISOString(),
      })

      fetchTrucksByYear()
    } catch (err: any) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка данных",
        description: err.response?.data || "Не удалось загрузить файл",
        status: err.response?.status || 500,
        createdAt: new Date().toISOString(),
      })
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    let filtered = [...allTrucks]
    if (monthFilter !== "all") {
      const month = Number(monthFilter)
      filtered = filtered.filter((p) => new Date(p.date).getMonth() + 1 === month)
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })
    setDisplayedTrucks(filtered)
  }, [allTrucks, monthFilter, sortOrder])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ru-RU")

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("ru-RU").format(num)

  return (
    <div className="space-y-6 p-4 max-w-[1400px] mx-auto pt-[6rem]">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Аналитика эвакуаторов
      </h1>

      {/* Диаграммы */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Динамика эвакуаций</CardTitle>
              <CardDescription>Сравнение по месяцам (2024 vs 2025)</CardDescription>
            </CardHeader>
            <CardContent>
              <EvacuationDiagram
                evacuation2024={mapForDiagram(trucks2024)}
                evacuation2025={mapForDiagram(trucks2025)}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Статус эвакуаций</CardTitle>
              <CardDescription>Завершённые и в процессе</CardDescription>
              <EvacuationPieDiagram evacuation2024={trucks2024} evacuation2025={trucks2025} />
            </CardHeader>
            <CardContent className="flex justify-center"></CardContent>
          </Card>
        </div>
      </div>

      {/* Форма загрузки Excel */}
      <Card className="w-full mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Загрузка данных
          </CardTitle>
          <CardDescription>
            Добавьте файл эвакуаций в формате <code>.xlsx</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleUpload}
            className="flex flex-col sm:flex-row gap-4 items-end"
          >
            <Input type="file" name="file" accept=".xlsx" className="h-10" />
            <Button
              type="submit"
              disabled={uploading}
              className="h-10 w-full sm:w-auto flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Отправка..." : "Загрузить"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Просмотр данных */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Просмотр данных</CardTitle>
          <CardDescription>
            Загрузите данные об эвакуаторах с возможностью фильтрации по году
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="grid w-full sm:max-w-sm items-center gap-1.5">
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
              className="h-10 w-full sm:w-auto"
            >
              {loading ? "Загрузка..." : "Загрузить данные"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Таблица */}
      {displayedTrucks.length > 0 && (
        <Card className="w-full">
          <CardHeader className="pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <CardTitle className="text-xl">
                Данные об эвакуаторах {yearFilter && `за ${yearFilter} год`}
              </CardTitle>
              <CardDescription>
                Всего записей: {displayedTrucks.length}
              </CardDescription>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setShowTable(!showTable)}
                className="flex items-center gap-2 h-9"
              >
                {showTable ? (
                  <>
                    <EyeOff className="h-4 w-4" /> Скрыть таблицу
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" /> Показать таблицу
                  </>
                )}
              </Button>
              <EvacuationFormDialog onSuccess={() => {}} />
            </div>
          </CardHeader>

          <CardContent>
            {showTable && (
              <>
                {/* фильтры */}
                <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
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
                            {new Date(0, i).toLocaleString("ru-RU", {
                              month: "long",
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {displayedTrucks.length === 0 ? (
                  <div className="w-full min-h-[150px] flex items-center justify-center text-gray-500">
                    📭 Нет данных за выбранный период
                  </div>
                ) : (
                  <>
                    {/* таблица (desktop) */}
                    <div className="hidden md:block rounded-lg border border-gray-200 overflow-x-auto">
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
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* карточки (mobile) */}
                    <div className="gap-4 md:hidden w-full flex flex-col">
                      {displayedTrucks.map((t) => (
                        <div
                          key={t.id}
                          className="w-full max-w-full border rounded-xl p-4 shadow-sm bg-white flex flex-col gap-2 text-sm"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">
                              {formatDate(t.date)}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                              {t.tow_truck_in_line} эвакуаторов
                            </span>
                          </div>
                          <div className="text-gray-700">Выезды: {t.count_departures}</div>
                          <div className="text-blue-600 font-medium">
                            Эвакуации: {t.count_evacuations}
                          </div>
                          <div className="text-green-600 font-medium">
                            Сумма: {formatNumber(t.summary_of_parking_lot)} ₽
                          </div>
                          <div className="flex gap-2 justify-between mt-2">
                            <EvacuationFormDialog route={t} onSuccess={() => {}} />
                            <EvacuationDeleteDialog truckId={t.id} onSuccess={() => {}} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
            <div className="mt-4 text-sm text-gray-500 text-center">
              Показано {displayedTrucks.length} записей из {allTrucks.length}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
