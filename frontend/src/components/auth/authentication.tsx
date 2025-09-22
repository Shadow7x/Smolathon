import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Authentication() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-black">Аутентификация</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-black">Hello...</DialogTitle>
            <DialogDescription>
              Авторизация
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4">
              <Label htmlFor="name-1" className="text-black">Username</Label>
              <Input type="name" placeholder="Name" className="text-gray-800"/>
            </div>
            <div className="grid gap-4">
              <Label htmlFor="name-1" className="text-black">Password</Label>
              <Input type="password" placeholder="Password" className="text-gray-800"/>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button type="submit">Войти</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
