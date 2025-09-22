import Link from "next/link"
export default function Header(){
    return(
        <header>
            <div>
                <Link href={"/register"}>Регистрация</Link>
            </div>
        </header>
    )
}