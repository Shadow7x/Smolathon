"use client";

import { useEffect, useState } from "react";
import axi from "@/utils/api";
import { useNotificationManager } from "@/hooks/notification-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface TDetector {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function TableDetector() {
  const [detectors, setDetectors] = useState<TDetector[]>([]);
  const [loading, setLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const { addNotification } = useNotificationManager();

  const fetchDetectors = async (year?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);

      const response = await axi.get(`/analytics/detectors/get?${params}`);
      setDetectors(response.data || []);
    } catch (error: any) {
      addNotification({
        id: crypto.randomUUID(),
        title: "Ошибка",
        description: "Не удалось загрузить данные детекторов",
        status: error.response?.status || 500,
        createdAt: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchDetectors();
  }, [isOpen]);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-semibold">Таблица детекторов</h1>
        <div className="flex gap-2">
          {isOpen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDetectors(yearFilter)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Обновить"
              )}
            </Button>
          )}
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? (
              <>
                Скрыть <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Показать <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Контейнер с плавным открытием */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Широта</TableHead>
                <TableHead>Долгота</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detectors.length > 0 ? (
                detectors.map((detector) => (
                  <TableRow key={detector.id}>
                    <TableCell>{detector.id}</TableCell>
                    <TableCell>{detector.name}</TableCell>
                    <TableCell>{detector.latitude}</TableCell>
                    <TableCell>{detector.longitude}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    {loading
                      ? "Загрузка данных..."
                      : "Нет данных для отображения"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
