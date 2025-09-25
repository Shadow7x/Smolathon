'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import axi from "@/utils/api"
import { useState } from "react"
import { useNotificationManager } from "@/hooks/notification-context"

interface EvacuationDeleteDialogProps {
  routeId: number
  onSuccess: () => void
}

export default function EvacuationDeleteDialog({ routeId, onSuccess }: EvacuationDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addNotification } = useNotificationManager()

  const handleDelete = async () => {
    try {
      setLoading(true)
      await axi.post("/analytics/towTrucks/delete", { id: routeId })
      addNotification({
        id: Date.now().toString(),
        title: "Успех",
        description: "Маршрут удалён",
        status: 201,
        createdAt: new Date().toISOString(),
      })
      setOpen(false)
      onSuccess()
    } catch (error: any) {
      console.error(error)
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка",
        description: error.response?.data || "Не удалось удалить маршрут",
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
        <Button variant="destructive">Удалить</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы уверены, что хотите удалить маршрут?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Удаляем..." : "Удалить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
