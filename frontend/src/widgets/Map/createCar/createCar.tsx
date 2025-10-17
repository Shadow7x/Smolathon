"use client";

import React, { useState, useRef } from "react";
import axi from "@/utils/api";
import { useNotificationManager } from "@/hooks/notification-context";
import { Upload, Check, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadPanel({ yearFilter, fetchWorkloads, fetchAllWorkloads }: any) {
  const [mode, setMode] = useState<"auto" | "detectors">("auto");
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

  const handleUpload = async () => {
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

    const endpoint =
      mode === "auto"
        ? "/analytics/workload/createFromExcel"
        : "/analytics/detectors/createFromExcel";

    try {
      await axi.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addNotification({
        id: Date.now(),
        title: "Успешно",
        description: `Файл для ${mode === "auto" ? "авто" : "детекторов"} загружен`,
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
    <div
      className="
        bg-white border border-gray-200 rounded-xl shadow-sm 
        p-6 sm:p-10 w-full
        flex justify-center
      "
    >
      <div
        className="
          flex flex-col sm:flex-row justify-evenly items-center 
          gap-6 sm:gap-10 
          w-full max-w-[1200px]
        "
      >
        {/* Левая часть — заголовок и табы */}
        <div className="flex flex-col items-center sm:items-start gap-4 text-center sm:text-left w-full sm:w-auto">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-800">
            <Cloud className="w-5 h-5" />
            <span className="text-base sm:text-lg font-bold">Загрузка файлов</span>
          </div>

          <div className="flex bg-gray-100 rounded-full p-1 w-fit mx-auto sm:mx-0">
            <button
              onClick={() => setMode("auto")}
              className={cn(
                "px-4 py-1 text-sm sm:text-base font-medium rounded-full transition-all",
                mode === "auto"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              Авто
            </button>
            <button
              onClick={() => setMode("detectors")}
              className={cn(
                "px-4 py-1 text-sm sm:text-base font-medium rounded-full transition-all",
                mode === "detectors"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              Детекторы
            </button>
          </div>
        </div>

        {/* Правая часть — кнопки */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 
                       text-sm sm:text-base font-medium px-4 py-2 rounded-md transition w-full sm:w-auto"
          >
            <Upload className="w-4 h-4" />
            {file ? file.name : "Выбрать файл"}
          </button>

          <button
            disabled={loading}
            onClick={handleUpload}
            className={cn(
              "flex items-center justify-center gap-2 text-sm sm:text-base font-medium px-4 py-2 rounded-md transition w-full sm:w-auto",
              loading
                ? "bg-gray-300 text-gray-700"
                : "bg-black hover:bg-gray-800 text-white"
            )}
          >
            <Check className="w-4 h-4" />
            {loading ? "Загрузка..." : "Загрузить"}
          </button>

          <input
            type="file"
            accept=".xlsx"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
