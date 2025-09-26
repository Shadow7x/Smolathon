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
import PenaltyDeleteDialog from "@/components/penaltyDialog/penaltydeletedialog/penaltydeletedialog"
import PenaltyFormDialog from "@/components/penaltyDialog/penaltyformdialog/penaltyformdialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, Calendar, Filter, ArrowUpDown } from "lucide-react"
import Piediogram from "@/components/diogramPenalty/piediogramPenalties/piediogramPenalties"
import PenaltyDiagram from "@/components/diogramPenalty/linediogramPenalties/linediogramPenalties"

// 🔹 форма загрузки Excel
function PenaltyUploadForm() {
  const { addNotification } = useNotificationManager()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const data = new FormData(e.currentTarget)
    const file = data.get("file") as File

    if (!file?.name.endsWith(".xlsx")) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка формата",
        description: "Файл должен быть в формате .xlsx",
        status: 400,
        createdAt: new Date().toISOString(),
      })
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axi.post("/analytics/penalties/createFromExcel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      addNotification({
        id: Date.now().toString(),
        title: "Успешно",
        description: "Файл успешно загружен",
        status: res.status || 200,
        createdAt: new Date().toISOString(),
      })
    } catch (err: any) {
      console.error(err)
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка загрузки",
        description: err.response?.data?.message || "Произошла ошибка",
        status: err.response?.status || 500,
        createdAt: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Загрузка штрафов</CardTitle>
        <CardDescription>Добавьте Excel-файл (.xlsx) с данными о штрафах</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="grid w-full sm:max-w-sm gap-1.5">
            <Label htmlFor="file-input">Файл Excel</Label>
            <Input
              id="file-input"
              type="file"
              name="file"
              accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              disabled={isLoading}
              className="h-10"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="h-10 w-full sm:w-auto">
            {isLoading ? "Загрузка..." : "Отправить"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// 🔹 таблица строка
interface Penalty {
  id: number
  date: string
  violations_cumulative: number
  decrees_cumulative: number
  fines_imposed_cumulative: number
  fines_collected_cumulative: number
}

const PenaltyRow = memo(({ penalty, formatDate, formatNumber, fetchPenalties }: {
  penalty: Penalty
  formatDate: (date: string) => string
  formatNumber: (n: number) => string
  fetchPenalties: (year: string) => void
}) => (
  <TableRow className="hover:bg-gray-50/70 transition-colors">
    <TableCell className="font-medium text-sm py-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        {formatDate(penalty.date)}
      </div>
    </TableCell>
    <TableCell className="text-sm py-3 text-right font-mono">
      {formatNumber(penalty.violations_cumulative)}
    </TableCell>
    <TableCell className="text-sm py-3 text-right font-mono">
      {formatNumber(penalty.decrees_cumulative)}
    </TableCell>
    <TableCell className="text-sm py-3 text-right font-mono font-semibold text-blue-600">
      {formatNumber(penalty.fines_imposed_cumulative)} ₽
    </TableCell>
    <TableCell className="text-sm py-3 text-right font-mono font-semibold text-green-600">
      {formatNumber(penalty.fines_collected_cumulative)} ₽
    </TableCell>
    <TableCell className="py-3">
      <div className="flex gap-2 justify-end">
        <PenaltyFormDialog penalty={penalty} onSuccess={fetchPenalties} />
        <PenaltyDeleteDialog penaltyId={penalty.id} onSuccess={fetchPenalties} />
      </div>
    </TableCell>
  </TableRow>
))
PenaltyRow.displayName = "PenaltyRow"

export default function AnaliticsSection() {
  const [showTable, setShowTable] = useState(true)
  const [allPenalties, setAllPenalties] = useState<Penalty[]>([])
  const [penalties2024, setPenalties2024] = useState<Penalty[]>([])
  const [penalties2025, setPenalties2025] = useState<Penalty[]>([])
  const [loading, setLoading] = useState(false)
  const [yearFilter, setYearFilter] = useState("")
  const { addNotification } = useNotificationManager()
  const [monthFilter, setMonthFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [penalties, setPenalties] = useState<Penalty[]>([])
  const [inputYear, setInputYear] = useState("")

  useEffect(() => {
    fetchPenaltiesByYear()
  }, [])

  const fetchPenaltiesByYear = async () => {
    try {
      setLoading(true)
      const [response2024, response2025] = await Promise.all([
        axi.get("/analytics/penalties/get?year=2024").catch(() => ({ data: [] })),
        axi.get("/analytics/penalties/get?year=2025").catch(() => ({ data: [] })),
      ])
      setPenalties2024(response2024?.data || [])
      setPenalties2025(response2025?.data || [])
    } catch {
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

  const fetchPenalties = async (year: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (year) params.append("year", year)
      const response = await axi.get(`/analytics/penalties/get?${params}`)
      setAllPenalties(response.data)
      setPenalties(response.data)
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

  useEffect(() => {
    let filtered = [...allPenalties]
    if (monthFilter !== "all") {
      const month = Number(monthFilter)
      filtered = filtered.filter((p) => new Date(p.date).getMonth() + 1 === month)
    }
    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    setPenalties(filtered)
  }, [allPenalties, monthFilter, sortOrder])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ru-RU")

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("ru-RU").format(num)

  const displayedPenalties = useMemo(() => {
    let filtered = [...allPenalties]
    if (monthFilter !== "all") {
      filtered = filtered.filter(
        (p) => new Date(p.date).getMonth() + 1 === Number(monthFilter)
      )
    }
    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return filtered
  }, [allPenalties, monthFilter, sortOrder])

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6 flex items-center justify-center gap-3">
        Аналитика штрафов
      </h1>

      {/* графики */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Динамика штрафов */}
        <Card className="shadow-md rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Динамика штрафов</CardTitle>
            <CardDescription>
              Сравнение данных за 2024 и 2025 годы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PenaltyDiagram
              penalties2024={penalties2024}
              penalties2025={penalties2025}
            />
          </CardContent>
        </Card>

        {/* Соотношение штрафов */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Соотношение штрафов</CardTitle>
            <CardDescription>
              Распределение оплаченных и неоплаченных
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Piediogram
              penalties2024={penalties2024}
              penalties2025={penalties2025}
            />
          </CardContent>
        </Card>
      </div>



      {/* фильтр по году */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Фильтрация данных</CardTitle>
          <CardDescription>Выберите год и загрузите данные</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="grid w-full sm:max-w-sm gap-1.5">
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
            onClick={() => fetchPenalties(inputYear)}
            disabled={loading || !inputYear.trim()}
            className="h-10 w-full sm:w-auto"
          >
            {loading ? "Загрузка..." : "Загрузить"}
          </Button>
        </CardContent>
      </Card>
      <PenaltyUploadForm />
      {/* таблица */}
      {penalties.length > 0 && (
        <Card className="shadow-md rounded-2xl overflow-hidden min-w-[320px]">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-lg">
                  Данные о штрафах {yearFilter && `за ${yearFilter} год`}
                </CardTitle>
                <CardDescription>
                  Всего записей: {displayedPenalties.length}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTable(!showTable)}
                  className="flex items-center gap-2"
                >
                  {showTable ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showTable ? "Скрыть таблицу" : "Показать таблицу"}
                </Button>
                <PenaltyFormDialog onSuccess={fetchPenalties} />
              </div>
            </div>
          </CardHeader>

          {showTable && (
            <CardContent>
              {/* фильтры */}
              <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-xl min-w-[200px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Фильтры:</span>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Сортировка:</span>
                  <Select
                    value={sortOrder}
                    onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
                  >
                    <SelectTrigger className="w-[100px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Новые</SelectItem>
                      <SelectItem value="asc">Старые</SelectItem>
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
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {new Date(2000, i).toLocaleString("ru", { month: "long" })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* таблица (desktop) */}
              <div className="hidden md:block rounded-lg border border-gray-200 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead className="text-right">Нарушения</TableHead>
                      <TableHead className="text-right">Постановления</TableHead>
                      <TableHead className="text-right">Наложенные штрафы</TableHead>
                      <TableHead className="text-right">Взысканные штрафы</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedPenalties.map((penalty) => (
                      <PenaltyRow
                        key={penalty.id}
                        penalty={penalty}
                        formatDate={formatDate}
                        formatNumber={formatNumber}
                        fetchPenalties={fetchPenalties}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* карточки (mobile) */}
              <div className="grid gap-4 md:hidden w-full">
                {displayedPenalties.map((p) => (
                  <div
                    key={p.id}
                    className="w-full max-w-full border rounded-xl p-4 shadow-sm bg-white flex flex-col gap-2 text-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{formatDate(p.date)}</span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                        {p.violations_cumulative} нарушений
                      </span>
                    </div>
                    <div className="text-gray-700">
                      Постановлений: {formatNumber(p.decrees_cumulative)}
                    </div>
                    <div className="text-blue-600 font-medium">
                      Наложено: {formatNumber(p.fines_imposed_cumulative)} ₽
                    </div>
                    <div className="text-green-600 font-medium">
                      Взыскано: {formatNumber(p.fines_collected_cumulative)} ₽
                    </div>
                    <div className="flex gap-2 justify-between mt-2">
                      <PenaltyFormDialog penalty={p} onSuccess={fetchPenalties} />
                      <PenaltyDeleteDialog penaltyId={p.id} onSuccess={fetchPenalties} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-500 text-center">
                Показано {displayedPenalties.length} из {allPenalties.length}
              </div>
            </CardContent>
          )}

        </Card>
      )}
    </div>
  )
}
