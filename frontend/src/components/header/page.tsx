"use client"
import { useState } from "react"
import Link from "next/link"
import Authentication from "@/components/auth/authentication"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/news", label: "Новости" },
    { href: "/statistics", label: "Статистика" },
    { href: "/services", label: "Услуги" },
    { href: "/contacts", label: "Контакты" },
    { href: "/projects", label: "Проекты" },
    { href: "/about", label: "О нас" },
  ]

  return (
    <header className="flex items-center justify-between py-4 bg-white shadow-sm px-4 sm:px-6 lg:px-8">
      {/* Бургер-меню для мобильных */}
      <div className="lg:hidden bg-black rounded-[10px]">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden bg-black">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Навигация для десктопа - по центру */}
      <nav className="hidden lg:flex items-center justify-center flex-1">
        <div className="flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-gray-700 hover:text-gray-800 transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}