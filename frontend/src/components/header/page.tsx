"use client";
import { useState } from "react";
import Link from "next/link";
import Authentication from "@/components/auth/authentication";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/news", label: "Новости" },
    { href: "/statistics", label: "Статистика" },
    { href: "/services", label: "Услуги" },
    { href: "/contacts", label: "Контакты" },
    { href: "/projects", label: "Проекты" },
    { href: "/about", label: "О нас" },
  ];

  return (
    <header className="flex flex-wrap items-center gap-3.5 mt-[1rem] md:mt-[3.125rem] bg-transparent shadow-sm absolute top-0 left-0 right-0 z-50 h-[6rem] md:h-[12.5rem] px-[2rem] md:px-[7.5rem]">
      <div className="flex justify-between w-full items-start">
        <div className="flex flex-row h-full items-end text-white gap-2.5">
          <div className="w-[3.5rem] h-[3.5rem] sm:w-[12.5rem] sm:h-[12.5rem] bg-gray-200"></div>
          <p className="hidden sm:block font-[400] text-[0.9375rem] leading-[1.25rem] tracking-[0%]">
            Центр организации дорожного <br />
            движения смоленской области
          </p>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <nav className="hidden lg:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white font-semibold text-[1rem] hover:text-[#62A744] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="lg:hidden ml-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="bg-transparent p-2 md:p-0">
                  <Menu
                    style={{ width: "30px", height: "30px" }}
                    className="text-white"
                  />
                  <span className="sr-only">Открыть меню</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] bg-white"
              >
                <div className="flex flex-col space-y-4 mt-12 items-center">
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
        </div>
      </div>
    </header>
  );
}
