'use client'
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
import { useUser } from "@/hooks/user-context"
import { useNotificationManager } from "@/hooks/notification-context"

export default function Authentication() {
  const { fetchUser } = useUser();
  const { addNotification } = useNotificationManager();
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const formData = new FormData()
    formData.append("login", data.get("login"))
    formData.append("password", data.get("password"))
    try {
      const res = await axi.post("/account/login", formData)
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        await fetchUser?.();

        addNotification({
          id: Date.now().toString(),
          title: "Успешная авторизация",
          description: "Добро пожаловать!",
          status: 200,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка авторизации",
        description: err.response.data,
        status: err.response.status,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
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
              <Input name="login" type="name" placeholder="Name" className="text-gray-800"/>
            </div>
            <div className="grid gap-4">
              <Label htmlFor="name-1" className="text-black">Password</Label>
              <Input name = 'password' type="password" placeholder="Password" className="text-gray-800"/>
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

