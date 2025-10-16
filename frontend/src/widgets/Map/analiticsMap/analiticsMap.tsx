"use client";
import React, { useState } from "react";
import axi from "@/utils/api";
import { useNotificationManager } from "@/hooks/notification-context"; // путь к твоему NotificationContext
import { Button } from "@/components/ui/button";

export default function WorkloadUpload({ yearFilter, fetchWorkloads, fetchAllWorkloads }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationManager();

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
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleUploadWorkload}
        disabled={!file || loading}
      >
        {loading ? "Загрузка..." : "Upload File"}
      </Button>
    </div>
  );
}
