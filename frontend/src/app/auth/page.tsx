'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
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
import axi from "@/utils/api"

export default function Authentication() {
  const { fetchUser } = useUser();
  const { addNotification } = useNotificationManager();
  const [isOpen, setIsOpen] = useState(false);

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
        setIsOpen(false);
        // Принудительно очищаем форму
        e.target.reset();
      }
    } catch (err) {
      console.log(err);
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка авторизации",
        description: err.response?.data || "Произошла ошибка",
        status: err.response?.status || 500,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black">Аутентификация</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} key={isOpen ? "open" : "closed"}>
          <DialogHeader>
            <DialogTitle className="text-black">Hello...</DialogTitle>
            <DialogDescription>Авторизация</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="login" className="text-black">Username</Label>
              <Input 
                name="login" 
                type="text" 
                placeholder="Name" 
                className="text-gray-800"
                autoComplete="off"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-black">Password</Label>
              <Input 
                name="password" 
                type="password" 
                placeholder="Password" 
                className="text-gray-800"
                autoComplete="new-password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Войти</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}