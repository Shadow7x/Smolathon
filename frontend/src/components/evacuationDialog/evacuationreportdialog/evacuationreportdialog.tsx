'use client'

import { useState } from "react"
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
import axi from "@/utils/api"
import { useNotificationManager } from "@/hooks/notification-context"

interface EvacuationReportDialogProps {
  onSuccess?: (createdReport?: any) => void
}

export default function EvacuationReportDialog({ onSuccess }: EvacuationReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reportName, setReportName] = useState("")
  const { addNotification } = useNotificationManager()

  const handleCreate = async () => {
    if (!reportName.trim()) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: "Введите название отчёта",
        status: 400,
        createdAt: new Date().toISOString(),
      })
      return
    }

    try {
      setLoading(true)

      const name = reportName.endsWith(".xlsx")
        ? reportName
        : `${reportName}.xlsx`

      const res = await axi.post("/analytics/reports/create", { name })

      addNotification({
        id: Date.now().toString(),
        title: "Успех",
        description: "Отчёт создан",
        status: 201,
        createdAt: new Date().toISOString(),
      })

      setReportName("")
      setOpen(false)

      if (onSuccess) onSuccess(res.data)
    } catch (error: any) {
      console.error(error)
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: error.response?.data || "Не удалось создать отчёт",
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
        <Button>Создать отчёт</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый отчёт по эвакуации</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="reportName">Название отчёта</Label>
            <Input
              id="reportName"
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Например: Evacuation_September_2025"
            />
            <p className="text-xs text-gray-500 mt-1">Файл будет создан в формате .xlsx</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Создаём..." : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
