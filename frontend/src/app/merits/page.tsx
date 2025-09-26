"use client";
import axi from "@/utils/api";
import MeritsMainSection from "@/widgets/mainSection/merits/DocsMainSection";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/user-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

const MeritsPage = () => {
    const [merits, setMerits] = useState<Merit[]>([])
    const { user } = useUser();
    console.log(user)
    useEffect(() => {
        axi.get("/content/merits/get").then((response) => {
            setMerits(response.data)
        })
    }, []);

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
            <div className="w-[80%]">
                {user && <div className="flex flex-row gap-2">
                    <Card className="p-1">

                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 31.5C9.675 31.5 8.96875 31.2063 8.38125 30.6188C7.79375 30.0313 7.5 29.325 7.5 28.5V9H6V6H13.5V4.5H22.5V6H30V9H28.5V28.5C28.5 29.325 28.2063 30.0313 27.6188 30.6188C27.0312 31.2063 26.325 31.5 25.5 31.5H10.5ZM25.5 9H10.5V28.5H25.5V9ZM13.5 25.5H16.5V12H13.5V25.5ZM19.5 25.5H22.5V12H19.5V25.5Z" fill="#636363" />
                            </svg>

                    </Card>
                    <Card className="p-1">
        
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 28.5H9.6375L24.3 13.8375L22.1625 11.7L7.5 26.3625V28.5ZM4.5 31.5V25.125L24.3 5.3625C24.6 5.0875 24.9312 4.875 25.2937 4.725C25.6562 4.575 26.0375 4.5 26.4375 4.5C26.8375 4.5 27.225 4.575 27.6 4.725C27.975 4.875 28.3 5.1 28.575 5.4L30.6375 7.5C30.9375 7.775 31.1562 8.1 31.2937 8.475C31.4312 8.85 31.5 9.225 31.5 9.6C31.5 10 31.4312 10.3812 31.2937 10.7437C31.1562 11.1062 30.9375 11.4375 30.6375 11.7375L10.875 31.5H4.5ZM23.2125 12.7875L22.1625 11.7L24.3 13.8375L23.2125 12.7875Z" fill="#636363" />
                            </svg>
                      
                    </Card>
                </div>
                }
                <MeritsMainSection
                    merit={merits[0]} />
            </div>
        </div>
  );
};

export default MeritsPage;
