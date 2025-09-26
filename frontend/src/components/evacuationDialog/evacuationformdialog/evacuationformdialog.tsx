'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import axi from "@/utils/api"
import { useNotificationManager } from "@/hooks/notification-context"
import EvacuationReportDialog from "@/components/evacuationDialog/evacuationreportdialog/evacuationreportdialog"

interface EvacuationFormDialogProps {
  onSuccess: () => void
  route?: any
}

export default function EvacuationFormDialog({ onSuccess, route }: EvacuationFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addNotification } = useNotificationManager()

  const [form, setForm] = useState({
    date: "",
    start_point: "",
    end_point: "",
    towtruck: "",
    status: "planned",
    time_spent: 0,
  })

  const [reports, setReports] = useState<any[]>([])
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  // загрузка отчетов
  const fetchReports = async () => {
    try {
      const res = await axi.get("/analytics/reports/get")
      setReports(res.data)
    } catch (err) {
      console.error(err)
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Не удалось загрузить отчёты",
        status: 500,
        createdAt: new Date().toISOString(),
      })
    }
  }

  useEffect(() => {
    if (open) {
      fetchReports()
      if (!route) {
        setForm({
          date: "",
          start_point: "",
          end_point: "",
          towtruck: "",
          status: "planned",
          time_spent: 0,
        })
        setSelectedReport(null)
      }
    }
  }, [open])

  useEffect(() => {
    if (route) {
      setForm({
        date: route.date.split("T")[0],
        start_point: route.start_point,
        end_point: route.end_point,
        towtruck: route.towtruck,
        status: route.status,
        time_spent: route.time_spent,
      })
      setSelectedReport(route.report?.id?.toString() || null)
    }
  }, [route])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const payload: any = {
        date: form.date,
        start_point: form.start_point,
        end_point: form.end_point,
        towtruck: form.towtruck,
        status: form.status,
        time_spent: Number(form.time_spent),
      }

      if (!route && !selectedReport) {
        throw new Error("Выберите отчёт или создайте новый")
      }

      if (route) {
        payload["id"] = route.id
        await axi.post("/analytics/towTrucks/update", payload)
        addNotification({
          id: Date.now().toString(),
          title: "Успех",
          description: "Маршрут обновлён",
          status: 201,
          createdAt: new Date().toISOString(),
        })
      } else {
        payload["report"] = Number(selectedReport)
        await axi.post("/analytics/towTrucks/create", payload)
        addNotification({
          id: Date.now().toString(),
          title: "Успех",
          description: "Маршрут добавлен",
          status: 201,
          createdAt: new Date().toISOString(),
        })
      }

      setOpen(false)
      onSuccess()
    } catch (error: any) {
      console.error(error)
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: error.response?.data || error.message || "Не удалось сохранить маршрут",
        status: error.response?.status || 500,
        createdAt: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{route ? "Редактировать" : "Добавить маршрут"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{route ? "Редактирование" : "Новый маршрут"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="date">Дата</Label>
            <Input type="date" id="date" name="date" value={form.date} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="start_point">Начальная точка</Label>
            <Input type="text" id="start_point" name="start_point" value={form.start_point} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="end_point">Конечная точка</Label>
            <Input type="text" id="end_point" name="end_point" value={form.end_point} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="towtruck">Эвакуатор</Label>
            <Input type="text" id="towtruck" name="towtruck" value={form.towtruck} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="status">Статус</Label>
            <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
              <SelectTrigger className="w-full max-w-[300px]">
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Запланирован</SelectItem>
                <SelectItem value="in_progress">В процессе</SelectItem>
                <SelectItem value="completed">Завершён</SelectItem>
                <SelectItem value="canceled">Отменён</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="time_spent">Время (мин)</Label>
            <Input type="number" id="time_spent" name="time_spent" value={form.time_spent} onChange={handleChange} />
          </div>

          {/* выбор отчёта */}
          <div>
            <Label htmlFor="report">Отчёт</Label>
              <div className="flex gap-2 w-full">
                <Select value={selectedReport || ""} onValueChange={setSelectedReport}>
                  <SelectTrigger className="w-full max-w-[170px] truncate">
                    <SelectValue
                      placeholder="Выберите отчёт"
                      className="truncate"
                    />
                  </SelectTrigger>
                  <SelectContent className="max-w-[300px]">
                    {reports.map((r) => (
                      <SelectItem
                        key={r.id}
                        value={r.id.toString()}
                        className="truncate max-w-[280px]"
                      >
                        {r.title || r.file.split("/").pop()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <EvacuationReportDialog onSuccess={fetchReports} />
              </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Сохраняем..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
