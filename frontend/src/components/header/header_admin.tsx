"use client";
import Logout from "../logout/logout";
import Image from "next/image";
import { useUser } from "@/hooks/user-context";

export default function Admin_Header() {
  const { user } = useUser();

  return user && (
    <header
    className={`
    flex flex-wrap items-center gap-3.5 
    px-[2rem] md:px-[4rem] lg:px-[7.5rem] z-50
    relative bg-white text-black py-[1rem] md:py-[3.125rem]
     content-center
  `}
    >
      <div className="relative w-[6.625rem] h-[3.125rem] flex-shrink-0">
        <Image
          src="/icons/colorLogoIcon.svg"
          alt="СОГБУ ЦОДД"
          fill
          className="object-contain"
        />
      </div>

      <h1 className="text-2xl">
        СОГБУ <span className="text-[#62A744]">"ЦОДД"</span>
      </h1>
      <h1 className="text-2xl font-bold">Панель администратора</h1>
      <Logout/>
    </header>
  );
}
