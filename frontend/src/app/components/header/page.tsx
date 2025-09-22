"use client"
import Link from "next/link"
import Register from "@/app/register/page"
import Authentication from "@/app/auth/page"
export default function Header(){
    return(
        <header>
            <div>
                <Register/>
                <Authentication/>
            </div>
        </header>
    )
}