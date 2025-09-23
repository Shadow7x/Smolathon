"use client";
import axi from "@/utils/api";
import Image from "next/image";
import { useNotificationManager } from "@/hooks/notification-context";
import Second from "./second";
import { useState } from "react";

import Third from "./third";
import Foth from "./foth";
export default function Home() {
    const { addNotification } = useNotificationManager();
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData(e.target as HTMLFormElement);
        const file = data.get("file") as File;

        // Проверка формата файла
        if (!file.name.endsWith('.xlsx')) {
            addNotification({
                id: Date.now().toString(),
                title: "Ошибка формата",
                description: "Файл должен быть в формате .xlsx",
                status: 400,
                createdAt: new Date().toISOString(),
            });
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axi.post("/analytics/penalties/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            addNotification({
                id: Date.now().toString(),
                title: "Успешно",
                description: "Файл успешно загружен",
                status: res.status || 200,
                createdAt: new Date().toISOString(),
            });
        } catch (err: any) {
            console.log(err);
            addNotification({
                id: Date.now().toString(),
                title: "Ошибка загрузки",
                description: err.response?.data?.message || "Произошла ошибка",
                status: err.response?.status || 500,
                createdAt: new Date().toISOString(),
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="">
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-8 h-[calc(100%-50px)]"
            >
                Добавьте штрафы.xlsx
                <input 
                    type="file" 
                    name="file" 
                    id="file-input"
                    accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="text-black hover:underline text-sm disabled:opacity-50"
                >
                    {isLoading ? "Загрузка..." : "Отправить"}
                </button>
            </form>
            <Second />
            <Third />
            <Foth />
        </div>
    );
}

