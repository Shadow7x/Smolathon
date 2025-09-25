"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Admin_Header() {
 

  return (
    <header
      className={`
    flex flex-wrap items-center gap-3.5 
    px-[2rem] md:px-[4rem] lg:px-[7.5rem] z-50
    relative bg-white text-black py-[1rem] md:py-[3.125rem]
     content-center
  `}
    >
        <img src="./images/LOGO_CODD.png" alt="" />
        <h1 className="text-2xl">СОГБУ <span className="text-[#62A744]">"ЦОДД"</span></h1>
        <h1 className="text-2xl font-bold">Панель администратора</h1>
    </header>
  );
}
