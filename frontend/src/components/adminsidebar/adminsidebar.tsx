// components/admin-sidebar/admin-sidebar.tsx
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarChart3, Users, Car, Shield, Settings, ChevronsLeft, ChevronsRight } from "lucide-react"

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  className?: string
}

const menuItems = [
  { id: 'penalties', label: 'Штрафы ₽', icon: BarChart3, description: 'Графики и статистика' },
  { id: 'evacuation', label: 'Статистика эвакуаций', icon: Car, description: 'Графики и статистика' },
  { id: 'routes', label: 'Реестр светофоров', icon: Car, description: 'Графики и статистика' },
  { id: 'users', label: 'ДТП МВД', icon: Users, description: 'Графики и статистика' },
  { id: 'settings', label: 'Пути эвакуаторов', icon: Settings, description: 'Системные настройки' }
]

export default function AdminSidebar({ activeSection, onSectionChange, className }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "bg-gray-50 border-r border-gray-200 p-4 flex flex-col transition-all",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && <h3 className="font-semibold text-lg">Панель управления</h3>}
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={cn(
              "w-full h-auto transition-all",
              activeSection === item.id
                ? "bg-blue-100 text-blue-900 border border-blue-200"
                : "hover:bg-gray-100",
              "flex items-center gap-3",
              isCollapsed && "justify-center" // если свернута, иконка по центру
            )}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon className="h-5 w-3 flex-shrink-0" />
            {!isCollapsed && (
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
