"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Default_Header from "./default_header";
import Admin_Header from "./header_admin";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  console.log(pathname)
  const isHome = pathname === "/";

  const navLinks = [
    { href: "/news", label: "Новости" },
    { href: "/statistics", label: "Статистика" },
    { href: "/services", label: "Услуги" },
    { href: "/contacts", label: "Контакты" },
    { href: "/projects", label: "Проекты" },
    { href: "/about", label: "О нас" },
  ];

  return (
    <>
    {
      pathname.startsWith("/admin") ? <Admin_Header /> : (
        <Default_Header />
      )
    }
    </>
  )
}
