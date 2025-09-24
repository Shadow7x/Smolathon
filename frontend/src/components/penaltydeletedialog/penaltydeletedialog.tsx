'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import axi from "@/utils/api"

interface PenaltyDeleteDialogProps {
  penaltyId: number
  onSuccess: () => void
}

export default function PenaltyDeleteDialog({ penaltyId, onSuccess }: PenaltyDeleteDialogProps) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await axi.delete(`/analytics/penalties/${penaltyId}`)
      onSuccess()
      setOpen(false)
    } catch (e) {
      console.error("Ошибка удаления", e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Удалить</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить запись?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
