// app/admin/page.tsx
'use client'

import { useUser } from "@/hooks/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import AnaliticsSection from "@/widgets/analyticsSectionPenalties/analyticsSectionPenalties"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AnalyticsSectionEvacuation from "@/widgets/analyticsSectionEvacuation/analyticsSectionEvacuation"
import Link from "next/link"

export default function Admin() {
  const { user, isLoading, logout } = useUser()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeSection, setActiveSection] = useState('analytics')

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isLoading && isClient) {
      const token = localStorage.getItem("token")
      
      if (!token && !user) {
        router.replace('/not-found')
        return
      }
      
      if (token && !user) {
        const timeout = setTimeout(() => {
          if (!user) {
            router.replace('/not-found')
          }
        }, 2000)
        
        return () => clearTimeout(timeout)
      }
    }
  }, [user, isLoading, router, isClient])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'penalties':
        return <AnaliticsSection />
      case 'evacuation':
        return (
          <Card>
            <AnalyticsSectionEvacuation/>
          </Card>
        )
      case 'routes':
        return (
          <Card>
          </Card>
        )
      case 'users':
        return (
          <Card>
          
          </Card>
        )
      case 'settings':
        return (
          <Card>
            
          </Card>
        )
      default:
        return <AnaliticsSection />
    }
  }

  if (!isClient || isLoading) {
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
      <AnaliticsSection />
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