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

interface PenaltyFormDialogProps {
  onSuccess: () => void
}

export default function PenaltyFormDialog({ onSuccess }: PenaltyFormDialogProps) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await axi.post("/analytics/penalties/create", form)

      addNotification({
        id: Date.now().toString(),
        title: "Успех",
        description: "Запись добавлена",
        status: 201,
        createdAt: new Date().toISOString(),
      })

      setOpen(false)
      onSuccess()
    } catch (error: any) {
      console.error("Ошибка добавления:", error)
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: error.response?.data || "Не удалось добавить запись",
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
        <Button>Добавить запись</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая запись</DialogTitle>
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
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Сохраняем..." : "Добавить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
