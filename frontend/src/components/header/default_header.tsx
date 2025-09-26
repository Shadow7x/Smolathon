"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import EvacuationPopup from "../evacuationPopup/EvacuationPopup";
import { usePathname } from "next/navigation";

export default function Default_Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/news", label: "Новости" },
    { href: "/statistics", label: "Статистика" },
    { href: "/contacts", label: "Контакты" },
    { href: "/docs", label: "Документы" },
    { href: "/about", label: "О нас" },
  ];

  const isTransparent = pathname === "/" || pathname.startsWith("/news");

  const headerClasses = isTransparent
    ? "bg-black/30 text-white"
    : "bg-white text-black ";

  const logoSrc = isTransparent
    ? "/icons/logoIcon.svg"
    : "/icons/colorLogoIcon.svg";

  const linkTextClasses = isTransparent
    ? "text-white hover:text-[#62A744]"
    : "text-black hover:text-[#62A744]";

  return (
    <header
      className={`absolute top-0 left-0 right-0 flex items-center justify-between py-5 px-[clamp(2rem,5vw,10rem)] z-50 transition-colors duration-300 ${headerClasses}`}
    >
      <Link href="/" className="flex items-center gap-6">
        <div className="relative w-32 h-15 sm:w-50 sm:h-24 md:max-w-[12.5rem] md:max-h-[6rem] flex-shrink-0">
          <Image
            src={logoSrc}
            alt="СОГБУ ЦОДД"
            fill
            className="object-contain"
          />
        </div>

        <p className="hidden sm:block text-[32px] font-normal mt-7">
          СОГБУ <span className="font-bold text-[#62A744]">“ЦОДД”</span>
        </p>
      </Link>

      <nav className="hidden lg:flex items-center gap-[clamp(1rem,2vw,3.25rem)]">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative group whitespace-nowrap flex-shrink-0"
            >
              <div
                className={`
                  font-bold text-center transition-all duration-300
                  ${
                    isActive
                      ? "text-[24px] translate-y-[2px] text-[#62A744]"
                      : "text-[20px] " + linkTextClasses
                  }
                `}
              >
                {link.label}
              </div>

              {isActive ? (
                <span className="absolute left-0 bottom-0 h-[2px] w-full bg-[#62A744]" />
              ) : (
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#62A744] group-hover:w-full transition-all duration-300 origin-left"></span>
              )}
            </Link>
          );
        })}
        <EvacuationPopup
          triggerClass={`relative group whitespace-nowrap flex-shrink-0 text-[20px] font-bold text-center transition-all duration-300 ${linkTextClasses}`}
        />
      </nav>

      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="bg-transparent p-2">
              <Menu
                className={isTransparent ? "text-white" : "text-black"}
                style={{ width: "30px", height: "30px" }}
              />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72 sm:w-100 bg-white">
            <div className="flex flex-col space-y-4 mt-12 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-bold text-gray-700 hover:text-[#62A744] transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <EvacuationPopup triggerClass="text-lg font-bold text-gray-700 hover:text-[#62A744] transition-colors py-2" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
