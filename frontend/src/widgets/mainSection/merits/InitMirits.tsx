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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

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

interface Props{
    merits: Merit | null
}

const InitMerit = (merits: Props) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useUser();
    console.log(user)
    const merit = merits.merits

    const router = useRouter();

        const handleDelete =(id: number) => {
        setLoading(true)
        axi.post("/content/merits/delete", {id: id}).then(() => {
            setOpen(false)
            setLoading(false)
            window.location.reload()
        })
    }

    return (
        <div className="pt-[10rem] flex flex-col content-center items-center">
            <div className="w-[80%]">
                {user.user && <div className="flex flex-row gap-2">
                    
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Card className="p-1">
                                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5 31.5C9.675 31.5 8.96875 31.2063 8.38125 30.6188C7.79375 30.0313 7.5 29.325 7.5 28.5V9H6V6H13.5V4.5H22.5V6H30V9H28.5V28.5C28.5 29.325 28.2063 30.0313 27.6188 30.6188C27.0312 31.2063 26.325 31.5 25.5 31.5H10.5ZM25.5 9H10.5V28.5H25.5V9ZM13.5 25.5H16.5V12H13.5V25.5ZM19.5 25.5H22.5V12H19.5V25.5Z" fill="#636363" />
                                    </svg>
                                </Card>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Вы уверены, что хотите удалить запись?</DialogTitle>
                                </DialogHeader>
                                <DialogFooter>
                                <Button variant="destructive" onClick={(mert) => {handleDelete(merit.id)}} disabled={loading}>
                                    {loading ? "Удаляем..." : "Удалить"}
                                </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    <Card className="p-1">

                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 28.5H9.6375L24.3 13.8375L22.1625 11.7L7.5 26.3625V28.5ZM4.5 31.5V25.125L24.3 5.3625C24.6 5.0875 24.9312 4.875 25.2937 4.725C25.6562 4.575 26.0375 4.5 26.4375 4.5C26.8375 4.5 27.225 4.575 27.6 4.725C27.975 4.875 28.3 5.1 28.575 5.4L30.6375 7.5C30.9375 7.775 31.1562 8.1 31.2937 8.475C31.4312 8.85 31.5 9.225 31.5 9.6C31.5 10 31.4312 10.3812 31.2937 10.7437C31.1562 11.1062 30.9375 11.4375 30.6375 11.7375L10.875 31.5H4.5ZM23.2125 12.7875L22.1625 11.7L24.3 13.8375L23.2125 12.7875Z" fill="#636363" />
                            </svg>
                      
                    </Card>
                </div>
                }
                <MeritsMainSection
                    merit={merit} />
            </div>
        </div>
  );
};

export default InitMerit;
