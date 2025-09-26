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
  report?: { id: number; file: string }
}

const RouteRow = memo(({ r }: { r: EvacuationRoute }) => (
  <TableRow className="hover:bg-gray-50/50 transition-colors">
    <TableCell className="text-sm py-3">{r.year}</TableCell>
    <TableCell className="text-sm py-3">{r.month}</TableCell>
    <TableCell className="text-sm py-3">
      {r.routes.map(rt => rt.street).join(" → ")}
    </TableCell>
    <TableCell className="text-sm py-3">{r.report?.file}</TableCell>
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
        (r.report?.file || "").toLowerCase().includes(q) ||
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

  // Обработчик выбора файла для загрузки
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    } else {
      setFile(null)
    }
  }

  // Отправка файла на бэк
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
    <div className="space-y-6 p-4 max-w-[1400px] mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-900">Маршруты эвакуации</h1>

      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Управление маршрутами</CardTitle>
              <CardDescription>Загрузить новый отчёт или просмотреть существующие</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button>Загрузить отчёт</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Загрузка Excel-отчёта</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input
                      id="file"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                    />
                    {file && (
                      <p className="text-sm text-gray-600">Выбран файл: {file.name}</p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button onClick={handleUpload} disabled={uploading}>
                      {uploading ? "Загружаем..." : "Загрузить"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-600" />
              <Input
                placeholder="Поиск по году, месяцу, улице или отчёту"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Сортировка:</span>
              <Button
                variant="outline"
                onClick={() => setSortOrder(s => (s === "asc" ? "desc" : "asc"))}
                className="h-8"
              >
                {sortOrder === "asc" ? "Сначала старые" : "Сначала новые"}
              </Button>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => setShowTable(s => !s)}
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
            </div>
          </div>

          {showTable && (
            <>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Год</TableHead>
                      <TableHead>Месяц</TableHead>
                      <TableHead>Маршрут</TableHead>
                      <TableHead>Отчёт</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayed.map(r => (
                      <RouteRow key={r.id} r={r} />
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 text-sm text-gray-500 text-center">
                Показано {displayed.length} маршрутов из {routes.length}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
