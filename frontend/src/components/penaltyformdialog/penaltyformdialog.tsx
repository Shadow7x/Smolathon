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
import PenaltyReportDialog from "../penaltyreportdialog/penaltyreportdialog"

interface PenaltyFormDialogProps {
  onSuccess: () => void
  penalty?: any
}

export default function PenaltyFormDialog({ onSuccess, penalty }: PenaltyFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addNotification } = useNotificationManager()

  const [form, setForm] = useState({
    date: "",
    violations_cumulative: 0,
    decrees_cumulative: 0,
    fines_imposed_cumulative: 0,
    fines_collected_cumulative: 0,
  })

  const [reports, setReports] = useState<any[]>([])
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  // Загружаем отчёты при открытии
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
      if (!penalty) {
        setForm({
          date: "",
          violations_cumulative: 0,
          decrees_cumulative: 0,
          fines_imposed_cumulative: 0,
          fines_collected_cumulative: 0,
        })
        setSelectedReport(null)
      }
    }
  }, [open])


  useEffect(() => {
    if (penalty) {
      setForm({
        date: penalty.date.split("T")[0],
        violations_cumulative: penalty.violations_cumulative,
        decrees_cumulative: penalty.decrees_cumulative,
        fines_imposed_cumulative: penalty.fines_imposed_cumulative,
        fines_collected_cumulative: penalty.fines_collected_cumulative,
      })
      setSelectedReport(penalty.report?.id?.toString() || null)
    }
  }, [penalty])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const payload: any = {
        date: form.date,
        violations_cumulative: Number(form.violations_cumulative),
        decrees_cumulative: Number(form.decrees_cumulative),
        fines_imposed_cumulative: Number(form.fines_imposed_cumulative),
        fines_collected_cumulative: Number(form.fines_collected_cumulative),
      }

      if (!penalty && !selectedReport) {
        throw new Error("Выберите отчёт или создайте новый")
      }

      if (penalty) {
        payload["id"] = penalty.id
        await axi.post("/analytics/penalties/update", payload)
        addNotification({
          id: Date.now().toString(),
          title: "Успех",
          description: "Запись обновлена",
          status: 201,
          createdAt: new Date().toISOString(),
        })
      } else {
        payload["report"] = Number(selectedReport)
        await axi.post("/analytics/penalties/create", payload)
        addNotification({
          id: Date.now().toString(),
          title: "Успех",
          description: "Запись добавлена",
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
        description: error.response?.data || error.message || "Не удалось сохранить запись",
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
        <Button>{penalty ? "Редактировать" : "Добавить запись"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{penalty ? "Редактирование записи" : "Новая запись"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="date">Дата</Label>
            <Input type="date" id="date" name="date" value={form.date} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="violations_cumulative">Нарушения</Label>
            <Input type="number" id="violations_cumulative" name="violations_cumulative" value={form.violations_cumulative} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="decrees_cumulative">Постановления</Label>
            <Input type="number" id="decrees_cumulative" name="decrees_cumulative" value={form.decrees_cumulative} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="fines_imposed_cumulative">Наложенные штрафы</Label>
            <Input type="number" id="fines_imposed_cumulative" name="fines_imposed_cumulative" value={form.fines_imposed_cumulative} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="fines_collected_cumulative">Взысканные штрафы</Label>
            <Input type="number" id="fines_collected_cumulative" name="fines_collected_cumulative" value={form.fines_collected_cumulative} onChange={handleChange} />
          </div>

          {/* Выбор отчёта */}
          <div>
            <Label htmlFor="report">Отчёт</Label>
            <div className="flex gap-2">
              <Select value={selectedReport || ""} onValueChange={setSelectedReport}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите отчёт" />
                </SelectTrigger>
                <SelectContent>
                  {reports.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      {r.file}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <PenaltyReportDialog onSuccess={fetchReports} />
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
