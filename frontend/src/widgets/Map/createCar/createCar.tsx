"use client";
import React, { useState, useRef } from "react";
import axi from "@/utils/api";
import { useNotificationManager } from "@/hooks/notification-context";
import { Button } from "@/components/ui/button";

export default function WorkloadUpload({ yearFilter, fetchWorkloads, fetchAllWorkloads }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationManager();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.name.endsWith(".xlsx")) {
      addNotification({
        id: Date.now(),
        title: "Ошибка",
        description: "Можно загружать только файлы .xlsx",
        status: 400,
        createdAt: new Date(),
      });
      e.target.value = "";
      return;
    }

    setFile(selected);
  };

  const handleUploadWorkload = async () => {
    if (!file) {
      addNotification({
        id: Date.now(),
        title: "Ошибка",
        description: "Файл не выбран",
        status: 400,
        createdAt: new Date(),
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axi.post("/analytics/workload/createFromExcel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addNotification({
        id: Date.now(),
        title: "Успешно",
        description: "Файл загружен",
        status: 200,
        createdAt: new Date(),
      });

      if (yearFilter) fetchWorkloads(yearFilter);
      else fetchAllWorkloads();
    } catch (err: any) {
      addNotification({
        id: Date.now(),
        title: "Ошибка данных",
        description: err.response?.data || "Не удалось загрузить файл",
        status: err.response?.status || 500,
        createdAt: new Date(),
      });
    } finally {
      setFile(null);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-[500px] h-[150px] justify-between">
      <h1 className="text-center text-2xl">Загрузка файлов</h1>

      {/* Скрытый input */}
      <input
        type="file"
        accept=".xlsx"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Кнопка с SVG */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 66 66"
          width="70"
          height="70"
          fill="currentColor"
        >
          <path d="M17.875 55C13.7042 55 10.1406 53.5563 7.18438 50.6688C4.22812 47.7812 2.75 44.2521 2.75 40.0813C2.75 36.5063 3.82708 33.3208 5.98125 30.525C8.13542 27.7292 10.9542 25.9417 14.4375 25.1625C15.5833 20.9458 17.875 17.5312 21.3125 14.9188C24.75 12.3062 28.6458 11 33 11C38.3625 11 42.9115 12.8677 46.6469 16.6031C50.3823 20.3385 52.25 24.8875 52.25 30.25C55.4125 30.6167 58.0365 31.9802 60.1219 34.3406C62.2073 36.701 63.25 39.4625 63.25 42.625C63.25 46.0625 62.0469 48.9844 59.6406 51.3906C57.2344 53.7969 54.3125 55 50.875 55H17.875ZM17.875 49.5H50.875C52.8 49.5 54.4271 48.8354 55.7563 47.5063C57.0854 46.1771 57.75 44.55 57.75 42.625C57.75 40.7 57.0854 39.0729 55.7563 37.7438C54.4271 36.4146 52.8 35.75 50.875 35.75H46.75V30.25C46.75 26.4458 45.4094 23.2031 42.7281 20.5219C40.0469 17.8406 36.8042 16.5 33 16.5C29.1958 16.5 25.9531 17.8406 23.2719 20.5219C20.5906 23.2031 19.25 26.4458 19.25 30.25H17.875C15.2167 30.25 12.9479 31.1896 11.0688 33.0688C9.18958 34.9479 8.25 37.2167 8.25 39.875C8.25 42.5333 9.18958 44.8021 11.0688 46.6813C12.9479 48.5604 15.2167 49.5 17.875 49.5Z" />
        </svg>
      </button>

      <Button
        variant="outline"
        className="w-[150px]"
        onClick={handleUploadWorkload}
        disabled={!file || loading}
      >
        {loading ? "Загрузка..." : "Загрузите файл"}
      </Button>
    </div>
  );
}
