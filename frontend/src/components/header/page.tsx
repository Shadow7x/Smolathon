"use client";
import { usePathname } from "next/navigation";
import Default_Header from "./default_header";
import Admin_Header from "./header_admin";

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return isAdmin ? <Admin_Header /> : <Default_Header />;
}
