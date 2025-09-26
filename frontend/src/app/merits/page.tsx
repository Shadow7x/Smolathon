"use client";
import axi from "@/utils/api";
import MeritsMainSection from "@/widgets/mainSection/merits/DocsMainSection";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/user-context";

import InitMerit from "@/widgets/mainSection/merits/InitMirits";

interface Merit{
    id: number,
    images_first_block: {
        id: number,
        image: string
    }[],
    images_second_block: {
        id: number,
        image: string
    }[],
    logo_first_block: string,
    logo_second_block: string,
    title: string,
    decode: string,
    purposes: string,
    parents_name: string,
    parents_phone: string,
    parents_email: string,
    address: string


}
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
const MeritsPage = () => {
    const [merits, setMerits] = useState<Merit[]>([])
    const { user } = useUser();
    console.log(user)

    const [merit, setMerit] = useState<Merit | null>(null)
    useEffect(() => {
        axi.get("/content/merits/get").then((response) => {
            setMerits(response.data)
            const url = new URL(window.location.href);
            const currentName = url.searchParams.get("name");
            if (currentName === null) {
                setMerit(response.data[0])
            }
            else{
                const s =  response.data.find((merit) => merit.title === currentName) || null
                setMerit(s)
            }
        })
    }, []);

    

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)




    return (
        <div className="pt-[10rem] flex flex-col content-center items-center">
            
            <div className="flex flex-row content-center items-center gap-8">
                <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60.3503 52.9833L51.8503 44.4833L55.8169 40.5167L64.3169 49.0167L60.3503 52.9833ZM50.1503 18.9833L46.1836 15.0167L54.6836 6.51667L58.6503 10.4833L50.1503 18.9833ZM17.8503 18.9833L9.35026 10.4833L13.3169 6.51667L21.8169 15.0167L17.8503 18.9833ZM7.65026 52.9833L3.68359 49.0167L12.1836 40.5167L16.1503 44.4833L7.65026 52.9833ZM25.0753 47.6708L34.0003 42.2875L42.9253 47.7417L40.5878 37.5417L48.4503 30.7417L38.1086 29.8208L34.0003 20.1875L29.8919 29.75L19.5503 30.6708L27.4128 37.5417L25.0753 47.6708ZM16.5044 59.5L21.1086 39.5958L5.66693 26.2083L26.0669 24.4375L34.0003 5.66667L41.9336 24.4375L62.3336 26.2083L46.8919 39.5958L51.4961 59.5L34.0003 48.9458L16.5044 59.5Z" fill="#62A744" />
                </svg>
                <h1 className="text-5xl ">Наши Заслуги</h1>
                <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60.3503 52.9833L51.8503 44.4833L55.8169 40.5167L64.3169 49.0167L60.3503 52.9833ZM50.1503 18.9833L46.1836 15.0167L54.6836 6.51667L58.6503 10.4833L50.1503 18.9833ZM17.8503 18.9833L9.35026 10.4833L13.3169 6.51667L21.8169 15.0167L17.8503 18.9833ZM7.65026 52.9833L3.68359 49.0167L12.1836 40.5167L16.1503 44.4833L7.65026 52.9833ZM25.0753 47.6708L34.0003 42.2875L42.9253 47.7417L40.5878 37.5417L48.4503 30.7417L38.1086 29.8208L34.0003 20.1875L29.8919 29.75L19.5503 30.6708L27.4128 37.5417L25.0753 47.6708ZM16.5044 59.5L21.1086 39.5958L5.66693 26.2083L26.0669 24.4375L34.0003 5.66667L41.9336 24.4375L62.3336 26.2083L46.8919 39.5958L51.4961 59.5L34.0003 48.9458L16.5044 59.5Z" fill="#62A744" />
                </svg>
            </div>
            <div className="w-[60%]">
                <p className="text-3xl text-center">Благодаря профессионализму нашей команды, результаты нашей работы видны не только на бумаге, но и в статистике!</p>
            </div>
            {merit && <InitMerit merits={merit}/>}
        </div>
  );
};

export default MeritsPage;
