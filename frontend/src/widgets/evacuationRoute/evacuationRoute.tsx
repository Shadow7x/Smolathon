'use client'

import { useEffect, useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Eye, EyeOff, ArrowUpDown, Search } from "lucide-react"
import axi from "@/utils/api"
import { useNotificationManager } from "@/hooks/notification-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

interface EvacuationRoute {
  id: number
  year: number
  month: string
  routes: { id: number; street: string }[]
  report?: { id: number; name: string }
}

const RouteRow = memo(({ r }: { r: EvacuationRoute }) => (
  <TableRow className="hover:bg-gray-50/50 transition-colors">
    <TableCell className="text-sm py-3">{r.year}</TableCell>
    <TableCell className="text-sm py-3">{r.month}</TableCell>
    <TableCell className="text-sm py-3">
      {r.routes.map(rt => rt.street).join(" → ")}
    </TableCell>
    <TableCell className="text-sm py-3">{r.report?.name || "—"}</TableCell>
  </TableRow>
))
RouteRow.displayName = "RouteRow"

export default function EvacuationRoutePage() {
  const [routes, setRoutes] = useState<EvacuationRoute[]>([])
  const [displayed, setDisplayed] = useState<EvacuationRoute[]>([])
  const [loading, setLoading] = useState(false)
  const [showTable, setShowTable] = useState(true)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [search, setSearch] = useState("")
  const { addNotification } = useNotificationManager()
  const [refreshKey, setRefreshKey] = useState(0)

  // состояние формы загрузки
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchRoutes()
  }, [refreshKey])

  const fetchRoutes = async () => {
    try {
      setLoading(true)
      const res = await axi.get("/analytics/evacuationRoute/get")
      setRoutes(res.data || [])
    } catch (err: any) {
      console.error(err)
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Не удалось загрузить маршруты",
        status: err.response?.status || 500,
        createdAt: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let tmp = [...routes]
    if (search.trim()) {
      const q = search.toLowerCase()
      tmp = tmp.filter(r =>
        r.routes.some(rt => rt.street.toLowerCase().includes(q)) ||
        (r.report?.name || "").toLowerCase().includes(q) ||
        String(r.year).includes(q) ||
        r.month.toLowerCase().includes(q)
      )
    }
    tmp.sort((a, b) => {
      const aKey = `${a.year}-${a.month}`
      const bKey = `${b.year}-${b.month}`
      return sortOrder === "asc" ? aKey.localeCompare(bKey) : bKey.localeCompare(aKey)
    })
    setDisplayed(tmp)
  }, [routes, sortOrder, search])

  // выбор файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    } else {
      setFile(null)
    }
  }

  // загрузка файла
  const handleUpload = async () => {
    if (!file) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Пожалуйста, выберите Excel-файл",
        status: 400,
        createdAt: new Date().toISOString(),
      })
      return
    }
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      await axi.post("/analytics/evacuationRoute/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      addNotification({
        id: Date.now().toString(),
        title: "Успех",
        description: "Отчёт успешно загружен",
        status: 201,
        createdAt: new Date().toISOString(),
      })
      setIsUploadOpen(false)
      setFile(null)
      setRefreshKey(k => k + 1)
    } catch (err: any) {
      console.error(err)
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: err.response?.data || err.message || "Не удалось загрузить отчёт",
        status: err.response?.status || 500,
        createdAt: new Date().toISOString(),
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    // **prefer 1400px but allow shrinking on small screens**
    <div className="w-[1400px] max-w-full mx-auto px-2 sm:px-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6">
        Маршруты эвакуации
      </h1>

      {/* Управление */}
      <Card className="mb-6 w-full">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Данные о маршрутах</CardTitle>
              <CardDescription>Всего записей: {displayed.length}</CardDescription>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}
                className="flex items-center gap-2 h-9"
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortOrder === "asc" ? "Сначала старые" : "Сначала новые"}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowTable((s) => !s)}
                className="flex items-center gap-2 h-9"
              >
                {showTable ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showTable ? "Скрыть таблицу" : "Показать таблицу"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="w-full">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="search" className="text-sm font-medium mb-2 block">
                Поиск по году, месяцу, улице или отчёту
              </label>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-600 shrink-0" />
                <Input
                  id="search"
                  placeholder="Введите запрос для поиска..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <Button onClick={() => fetchRoutes()} disabled={loading} className="h-10">
              {loading ? "Загрузка..." : "Обновить данные"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Таблица — card занимает всегда ширину, а содержимое анимируется по высоте */}
      <Card className="w-full">
        {/* CardContent держит структуру: min-height + flex-col, чтобы карточка не "схлопывалась" */}
        <CardContent className="w-full flex flex-col min-h-[260px]">
          {/* animated area: меняем только высоту (max-h) */}
          <div
            className={`w-full transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden
              ${showTable ? "max-h-[1200px] opacity-100" : "max-h-[260px] opacity-80"}
            `}
          >
            {/* если таблица видима — показываем таблицу */}
            {showTable ? (
              <div className="rounded-lg border border-gray-200 overflow-x-auto">
                {/* min-w задаёт минимальную ширину таблицы (desktop) — при узком экране появится горизонтальный скролл */}
                <Table className="w-full min-w-[700px]">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[100px]">Год</TableHead>
                      <TableHead className="w-[120px]">Месяц</TableHead>
                      <TableHead>Маршрут</TableHead>
                      <TableHead className="w-[200px]">Отчёт</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayed.map((r) => (
                      <RouteRow key={r.id} r={r} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              /* placeholder — имеет ту же ширину родителя и минимальную высоту,
                 поэтому карточка НЕ схлопывается по ширине при скрытии */
              <div className="w-full min-h-[260px] flex flex-col items-center justify-center text-gray-400 px-6">
                <EyeOff className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-center">Таблица скрыта. Нажмите «Показать таблицу».</p>
              </div>
            )}
          </div>

          {/* дополнительная инфа/футер карточки — всегда внизу карточки */}
          <div className="mt-4 text-sm text-gray-500 text-center">
            Показано {displayed.length} маршрутов из {routes.length}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
