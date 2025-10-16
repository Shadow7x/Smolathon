"use client";

import { usePathname } from "next/navigation"

export default function Admin_Header() {
  const pathname = usePathname()

  return (
    <footer className={pathname === "/auth" ? "" : "py-6"}></footer>
  );
}
