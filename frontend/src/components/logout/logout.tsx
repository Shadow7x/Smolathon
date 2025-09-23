"use client"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/user-context"
import { useNotificationManager } from "@/hooks/notification-context"
import axi from "@/utils/api"

export default function Logout() {
  const { user, clearUser } = useUser()
  const { addNotification } = useNotificationManager()

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        addNotification({
          id: Date.now().toString(),
          title: "Ошибка",
          description: "Токен не найден",
          status: 401,
          createdAt: new Date().toISOString(),
        })
        return
      }

      // Отправляем запрос на логаут
      const res = await axi.get("/account/logout", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (res.status === 200) {
        // Удаляем токен из localStorage
        localStorage.removeItem("token")
        
        // Очищаем данные пользователя в контексте
        clearUser?.()

        addNotification({
          id: Date.now().toString(),
          title: "Успешный выход",
          description: "Вы вышли из аккаунта",
          status: 200,
          createdAt: new Date().toISOString(),
        })

        // Обновляем страницу
        window.location.reload()
      }
    } catch (err) {
      // Даже если запрос не удался, очищаем локальные данные
      localStorage.removeItem("token")
      clearUser?.()

      addNotification({
        id: Date.now().toString(),
        title: "Выход выполнен",
        description: "Сессия завершена локально",
        status: 200,
        createdAt: new Date().toISOString(),
      })

      // Обновляем страницу
      window.location.reload()
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="text-black hover:bg-red-50 hover:text-red-600"
    >
      Выйти
    </Button>
  )
}