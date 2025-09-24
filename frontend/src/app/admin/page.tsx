// app/admin/page.tsx
'use client'

import { useUser } from "@/hooks/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Admin() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isLoading && isClient) {
      const token = localStorage.getItem("token")
      
      // Двойная проверка: нет токена И нет пользователя в контексте
      if (!token && !user) {
        router.replace('/not-found')
        return
      }
      
      // Если есть токен, но пользователь не загрузился (ошибка авторизации)
      if (token && !user) {
        // Даем дополнительное время на загрузку
        const timeout = setTimeout(() => {
          if (!user) {
            router.replace('/not-found')
          }
        }, 2000)
        
        return () => clearTimeout(timeout)
      }
    }
  }, [user, isLoading, router, isClient])

  // Защита от рендеринга на сервере
  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
      <p className="text-gray-600 mb-8">Добро пожаловать, {user.name}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/penalties">
          <Button className="w-full h-32 text-lg">Штрафы</Button>
        </Link>
        <Link href="/admin/evacuationRoutes">
          <Button className="w-full h-32 text-lg">Маршруты эвакуации</Button>
        </Link>
        <Link href="/admin/users">
          <Button className="w-full h-32 text-lg">Пользователи</Button>
        </Link>
      </div>
    </div>
  )
}