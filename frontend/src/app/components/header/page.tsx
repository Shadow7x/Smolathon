import Link from "next/link"
import Register from "@/app/register/page"
export default function Header(){
    return(
        <header>
            <div>
                <Register/>
                <Link href={"/auth"}>Аутентификация</Link>
            </div>
        </header>
    )
}