"use client"
import Link from "next/link"
import Authentication from "@/components/auth/authentication"


export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-12">
    
        <nav className="flex items-center space-x-6">
          <Link 
            href="/news" 
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
          >
            Новости
          </Link>
          <Link 
            href="/statistics" 
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
          >
            Статистика
          </Link>
          <Link 
            href="/services" 
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
          >
            Услуги
          </Link>
          <Link 
            href="/contacts" 
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
          >
            Контакты
          </Link>
          <Link 
            href="/projects" 
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
          >
            Проекты
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
          >
            О нас
          </Link>
        </nav>
      </div>
    <Authentication/>

    </header>
    )
}