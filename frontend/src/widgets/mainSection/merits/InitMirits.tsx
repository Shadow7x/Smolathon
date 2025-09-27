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
        <div className="pt-[10rem] flex flex-col content-center items-center min-w-[80%]">
            <div className="w-[80%]">
                
                <MeritsMainSection
                    merit={merit} />
            </div>
        </div>
  );
};

export default InitMerit;
