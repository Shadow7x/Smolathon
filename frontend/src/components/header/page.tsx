"use client"
import Link from "next/link"
import Authentication from "@/components/auth/authentication"


export default function Header() {
  return (
    <header className="flex items-center justify-center py-4 bg-white shadow-sm">
      <div className="flex items-center px-80">
        <nav className="justufy-center space-x-4">
          <Link 
            href="/news" 
            className="text-sm font-semibold text-gray-700 hover:text-gray-800 transition-colors"
          >
            Новости
          </Link>
          <Link 
            href="/statistics" 
            className="text-sm font-semibold text-gray-700 hover:text-gray-800 transition-colors"
          >
            Статистика
          </Link>
          <Link 
            href="/services" 
            className="text-sm font-semibold text-gray-700 hover:text-gray-800 transition-colors"
          >
            Услуги
          </Link>
          <Link 
            href="/contacts" 
            className="text-sm font-semibold text-gray-700 hover:text-gray-800 transition-colors"
          >
            Контакты
          </Link>
          <Link 
            href="/projects" 
            className="text-sm font-semibold text-gray-700 hover:text-gray-800 transition-colors"
          >
            Проекты
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-semibold text-gray-700 hover:text-gray-800 transition-colors"
          >
            О нас
          </Link>
        </nav>
      </div>
        <Authentication/>
    </header>
    )
}