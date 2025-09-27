"use client";
import axi from "@/utils/api";
import { useNotificationManager } from "@/hooks/notification-context";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OPTION() {
  const { addNotification } = useNotificationManager();
  const [reports, setReports] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    axi
      .get("/analytics/reports/get")
      .then((res) => setReports(res.data))
      .catch((err) => console.log(err));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const file_id = data.get("file");
    const format = data.get("format");

    const file = reports.find((report) => Number(report.id) === Number(file_id));
    if (!file) return;

    const formData = new FormData();
    formData.append("id", String(file.id));
    formData.append("format", String(format));

    axi
      .post("/analytics/reports/download", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `report_${file.name}.${format === "xlsx" ? "xlsx" : "zip"}`
        );
        link.click();
        window.URL.revokeObjectURL(url);

        addNotification({
          id: Date.now().toString(),
          title: "Успешно",
          description: "Файл успешно скачан",
          status: 200,
          createdAt: new Date().toISOString(),
        });
      })
      .catch((err) => {
        console.log(err);
        addNotification({
          id: Date.now().toString(),
          title: "Ошибка данных",
          description: err.response?.data || "Ошибка загрузки",
          status: err.response?.status || 500,
          createdAt: new Date().toISOString(),
        });
      });
  }

return (
  <div className="flex justify-center items-start min-h-screen px-2 py-8 pt-12 sm:pt-24">
    <Card className="w-full max-w-[800px]">
      <CardHeader>
        <CardTitle className="text-lg">Скачивание отчётов</CardTitle>
        <CardDescription>
          Выберите файл и формат для скачивания отчёта
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-end"
        >
          {/* Выбор файла */}
          <div className="w-full sm:w-1/2">
            <label className="block text-sm text-gray-700 mb-1">
              Файл отчёта
            </label>
            <select
              className="w-full border rounded px-3 h-10 text-sm"
              name="file"
              required
            >
              <option value="">Выберите файл</option>
              {reports.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.name}
                </option>
              ))}
            </select>
          </div>

          {/* Выбор формата */}
          <div className="w-full sm:w-1/4">
            <label className="block text-sm text-gray-700 mb-1">Формат</label>
            <select
              className="w-full border rounded px-3 h-10 text-sm"
              name="format"
              defaultValue="xlsx"
            >
              <option value="xlsx">XLSX</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          {/* Кнопка */}
          <Button type="submit" className="h-10 px-6">
            Скачать
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
);


}
