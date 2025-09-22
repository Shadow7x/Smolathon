import Link from "next/link";
import Authentication from "@/components/auth/authentication";

export default function Header() {
  return (
    <header className="flex items-center gap-3.5 mt-[3.125rem] bg-transparent shadow-sm absolute top-0 left-0 right-0 z-50 h-[12.5rem] md:h-[12.5rem]">
      <div className="flex justify-between w-full max-w-[1920px] mx-auto px-[7.5rem] items-start">
        <div className="flex flex-row h-full items-end text-white gap-2.5">
          <div className="w-[12.5rem] h-[12.5rem] bg-gray-200"></div>
          <p className="font-[400] text-[0.9375rem] leading-[1.25rem] tracking-[0%]">
            Центр организации дорожного <br />
            движения смоленской области
          </p>
        </div>
        <div className="flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-4">
            {[
              { href: "/news", label: "Новости" },
              { href: "/statistics", label: "Статистика" },
              { href: "/services", label: "Услуги" },
              { href: "/contacts", label: "Контакты" },
              { href: "/projects", label: "Проекты" },
              { href: "/about", label: "О нас" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white font-semibold text-sm hover:text-[#62A744] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Authentication />
        </div>
      </div>
    </header>
  );
}
