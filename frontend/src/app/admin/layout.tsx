"use client"
import LeftSidePanel from "@/components/admin/leftSidePanel";
import { useUser } from "@/hooks/user-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

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
    <div className="flex min-h-screen">
      {/* Левая панель */}
      <LeftSidePanel />

      {/* Контент */}
      <main className="flex-1">{children}</main>
    </div>
  );
}