'use client'

import { useEffect, useState } from "react"
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

interface RouteFormProps {
  onSuccess: () => void
}

export default function RouteFormDialog({ onSuccess }: RouteFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addNotification } = useNotificationManager()

  const [form, setForm] = useState({
    name: "",
    start_point: "",
    end_point: "",
    length_km: 0,
    status: "planned",
  })

  useEffect(() => {
    if (open) {
      // сброс формы при открытии
      setForm({
        name: "",
        start_point: "",
        end_point: "",
        length_km: 0,
        status: "planned",
      })
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === "length_km" ? Number(value) : value }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      // базовая валидация
      if (!form.name.trim()) throw new Error("Укажите название маршрута")
      if (!form.start_point.trim() || !form.end_point.trim()) throw new Error("Укажите точки начала и конца")
      if (form.length_km <= 0) throw new Error("Длина должна быть больше 0")

      const payload = { ...form }

      await axi.post("/analytics/evacuationRoute/create", payload)
      addNotification({
        id: Date.now().toString(),
        title: "Успех",
        description: "Маршрут добавлен",
        status: 201,
        createdAt: new Date().toISOString(),
      })

      setOpen(false)
      onSuccess()
    } catch (err: any) {
      console.error(err)
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: err.response?.data || err.message || "Не удалось сохранить маршрут",
        status: err.response?.status || 500,
        createdAt: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Добавить маршрут</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый маршрут эвакуации</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Название</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="start_point">Точка начала</Label>
            <Input id="start_point" name="start_point" value={form.start_point} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="end_point">Точка конца</Label>
            <Input id="end_point" name="end_point" value={form.end_point} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="length_km">Длина (км)</Label>
            <Input
              id="length_km"
              name="length_km"
              type="number"
              value={String(form.length_km)}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="status">Статус</Label>
            <Select value={form.status} onValueChange={(v) => setForm(prev => ({ ...prev, status: v as any }))}>
              <SelectTrigger className="w-full max-w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Планируемый</SelectItem>
                <SelectItem value="active">Активный</SelectItem>
                <SelectItem value="inactive">Неактивный</SelectItem>
              </SelectContent>
            </Select>
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
