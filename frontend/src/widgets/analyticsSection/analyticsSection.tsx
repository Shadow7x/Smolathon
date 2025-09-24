'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNotificationManager } from "@/hooks/notification-context"
import axi from "@/utils/api"
import Diogram from "@/components/diogram/diogram"

interface Penalty {
  id: number
  date: string
  violations_cumulative: number
  decrees_cumulative: number
  fines_imposed_cumulative: number
  fines_collected_cumulative: number
}

export default function AnaliticsSection() {
  const [file, setFile] = useState<File | null>(null)
  const [penalties, setPenalties] = useState<Penalty[]>([])
  const [penalties2024, setPenalties2024] = useState<Penalty[]>([])
  const [penalties2025, setPenalties2025] = useState<Penalty[]>([])
  const [loading, setLoading] = useState(false)
  const [yearFilter, setYearFilter] = useState('')
  const { addNotification } = useNotificationManager()

  useEffect(() => {
    fetchPenaltiesByYear()
  }, [])

  const fetchPenaltiesByYear = async () => {
    try {
      setLoading(true)
      
      // ПРАВИЛЬНЫЕ ПУТИ - используем /analytics/penalties/
      const [response2024, response2025] = await Promise.all([
        axi.get('/analytics/penalties/get?year=2024').catch(() => ({ data: [] })),
        axi.get('/analytics/penalties/get?year=2025').catch(() => ({ data: [] }))
      ])
      
      setPenalties2024(response2024?.data || [])
      setPenalties2025(response2025?.data || [])
    } catch (error) {
      console.error('Ошибка загрузки данных для диаграммы:', error)
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

  // Загрузка файла
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Выберите файл для загрузки",
        status: 400,
        createdAt: new Date().toISOString(),
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      // ПРАВИЛЬНЫЙ ПУТЬ - /analytics/penalties/create
      const response = await axi.post('/analytics/penalties/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 201) {
        addNotification({
          id: Date.now().toString(),
          title: "Успех",
          description: "Файл успешно загружен",
          status: 200,
          createdAt: new Date().toISOString(),
        })
        setFile(null)
        
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        
        await fetchPenaltiesByYear()
      }
    } catch (error: any) {
      console.error('Ошибка загрузки:', error)
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка загрузки",
        description: error.response?.data || "Произошла ошибка при загрузке файла",
        status: error.response?.status || 500,
        createdAt: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  // Получение данных для таблицы
  const fetchPenalties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (yearFilter) params.append('year', yearFilter)

      const response = await axi.get(`/analytics/penalties/get?${params}`)
      setPenalties(response.data)
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

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  // Форматирование чисел
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num)
  }

  return (
    <div className="space-y-5 p-4">
      <h1 className="text-3xl font-bold text-center">Аналитика штрафов</h1>

      {/* Диаграмма */}
      <Diogram penalties2024={penalties2024} penalties2025={penalties2025} />

      <Card className="w-full max-w-[1200px] mx-auto">
        <CardHeader>
          <CardTitle>Просмотр данных</CardTitle>
          <CardDescription>
            Загрузите данные о штрафах с возможностью фильтрации по году
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
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                min="2000"
                max="2030"
              />
            </div>
            <Button onClick={fetchPenalties} disabled={loading}>
              {loading ? "Загрузка..." : "Загрузить данные"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Таблица с данными */}
      {penalties.length > 0 && (
        <Card className="w-full max-w-[1400px] mx-auto">
          <CardHeader>
            <CardTitle>
              Данные о штрафах {yearFilter && `за ${yearFilter} год`}
            </CardTitle>
            <CardDescription>
              Всего записей: {penalties.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Нарушения</TableHead>
                    <TableHead>Постановления</TableHead>
                    <TableHead>Наложенные штрафы</TableHead>
                    <TableHead>Взысканные штрафы</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {penalties.map((penalty) => (
                    <TableRow key={penalty.id}>
                      <TableCell className="font-medium">
                        {formatDate(penalty.date)}
                      </TableCell>
                      <TableCell>{formatNumber(penalty.violations_cumulative)}</TableCell>
                      <TableCell>{formatNumber(penalty.decrees_cumulative)}</TableCell>
                      <TableCell>{formatNumber(penalty.fines_imposed_cumulative)} ₽</TableCell>
                      <TableCell>{formatNumber(penalty.fines_collected_cumulative)} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}