"use client"
import { useState, useEffect, useMemo, memo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNotificationManager } from "@/hooks/notification-context"
import axi from "@/utils/api"
import Diogram from "@/components/diogram/diogram"
import PenaltyDeleteDialog from '@/components/penaltydeletedialog/penaltydeletedialog'
import PenaltyFormDialog from '@/components/penaltyformdialog/penaltyformdialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff, Calendar, Filter, ArrowUpDown } from 'lucide-react'

interface Penalty {
  id: number
  date: string
  violations_cumulative: number
  decrees_cumulative: number
  fines_imposed_cumulative: number
  fines_collected_cumulative: number
}

// Улучшенный компонент строки таблицы
const PenaltyRow = memo(({ penalty, formatDate, formatNumber, fetchPenalties }: { 
  penalty: Penalty, 
  formatDate: (date: string) => string, 
  formatNumber: (n: number) => string, 
  fetchPenalties: (year: string) => void 
}) => (
  <TableRow className="hover:bg-gray-50/50 transition-colors">
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

PenaltyRow.displayName = 'PenaltyRow'

export default function AnaliticsSection() {
  const [showTable, setShowTable] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [allPenalties, setAllPenalties] = useState<Penalty[]>([])
  const [penalties2024, setPenalties2024] = useState<Penalty[]>([])
  const [penalties2025, setPenalties2025] = useState<Penalty[]>([])
  const [loading, setLoading] = useState(false)
  const [yearFilter, setYearFilter] = useState('')
  const { addNotification } = useNotificationManager()
  const [monthFilter, setMonthFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [penalties, setPenalties] = useState<Penalty[]>([]) 
  const [inputYear, setInputYear] = useState('')

  useEffect(() => {
    fetchPenaltiesByYear()
  }, [])

  const fetchPenaltiesByYear = async () => {
    try {
      setLoading(true)
      
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

  // Получение данных для таблицы
  const fetchPenalties = async (year: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (year) params.append('year', year)
      const response = await axi.get(`/analytics/penalties/get?${params}`)
      setAllPenalties(response.data)
      setPenalties(response.data)
      setMonthFilter('all')
      setSortOrder('desc')
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

    if (monthFilter !== 'all') {
      const month = Number(monthFilter)
      filtered = filtered.filter((p) => new Date(p.date).getMonth() + 1 === month)
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

    setPenalties(filtered)
  }, [allPenalties, monthFilter, sortOrder])

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  // Форматирование чисел
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num)
  }

  const displayedPenalties = useMemo(() => {
    let filtered = [...allPenalties]
    if (monthFilter !== 'all') {
      filtered = filtered.filter((p) => new Date(p.date).getMonth() + 1 === Number(monthFilter))
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })
    return filtered
  }, [allPenalties, monthFilter, sortOrder])

  return (
    <div className="space-y-6 p-4 max-w-[1400px] mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-900">Аналитика штрафов</h1>

      {/* Диаграмма */}
      <Diogram penalties2024={penalties2024} penalties2025={penalties2025} />

      {/* Загрузка данных */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Просмотр данных</CardTitle>
          <CardDescription>
            Загрузите данные о штрафах с возможностью фильтрации по году
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="year-filter" className="text-sm font-medium">Год</Label>
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
              className="h-10"
            >
              {loading ? "Загрузка..." : "Загрузить данные"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Таблица с данными */}
      {penalties.length > 0 && (
        <Card className="w-full">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">
                  Данные о штрафах {yearFilter && `за ${yearFilter} год`}
                </CardTitle>
                <CardDescription>
                  Всего записей: {displayedPenalties.length}
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowTable(!showTable)}
                  className="flex items-center gap-2 h-9"
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
              {/* Панель фильтров и сортировки */}
              <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Фильтры:</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Сортировка:</span>
                  <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'asc' | 'desc')}>
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
                      <SelectItem value="1">Январь</SelectItem>
                      <SelectItem value="2">Февраль</SelectItem>
                      <SelectItem value="3">Март</SelectItem>
                      <SelectItem value="4">Апрель</SelectItem>
                      <SelectItem value="5">Май</SelectItem>
                      <SelectItem value="6">Июнь</SelectItem>
                      <SelectItem value="7">Июль</SelectItem>
                      <SelectItem value="8">Август</SelectItem>
                      <SelectItem value="9">Сентябрь</SelectItem>
                      <SelectItem value="10">Октябрь</SelectItem>
                      <SelectItem value="11">Ноябрь</SelectItem>
                      <SelectItem value="12">Декабрь</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Таблица */}
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Дата</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Нарушения</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Постановления</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Наложенные штрафы</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Взысканные штрафы</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Действия</TableHead>
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

              {/* Подвал таблицы */}
              <div className="mt-4 text-sm text-gray-500 text-center">
                Показано {displayedPenalties.length} из {allPenalties.length} записей
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}