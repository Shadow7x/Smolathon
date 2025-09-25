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

interface PenaltyDeleteDialogProps {
  penaltyId: number
  onSuccess: () => void
}

export default function DTPDeleteDialog({ penaltyId, onSuccess }: PenaltyDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addNotification } = useNotificationManager()

  const handleDelete = async () => {
    try {
      setLoading(true)
      await axi.post("/analytics/penalties/delete", { id: penaltyId })
      addNotification({
        id: Date.now().toString(),
        title: "Успех",
        description: "Запись удалена",
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
        description: error.response?.data || "Не удалось удалить запись",
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
          <DialogTitle>Вы уверены, что хотите удалить запись?</DialogTitle>
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
