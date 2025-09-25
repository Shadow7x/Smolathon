// app/admin/page.tsx
'use client'

import { useUser } from "@/hooks/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import AnaliticsSection from "@/widgets/analyticsSectionPenalties/analyticsSectionPenalties"
import AdminSidebar from "@/components/adminsidebar/adminsidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AnalyticsSectionEvacuation from "@/widgets/analyticsSectionEvacuation/analyticsSectionEvacuation"

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
    <div className="flex h-screen bg-white">
      {/* Боковая панель */}
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />
      
      {/* Основной контент */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Шапка */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Панель администратора</h1>
              <p className="text-gray-600">Добро пожаловать, {user.name}!</p>
            </div>
          </div>
        </header>

        {/* Контент */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}