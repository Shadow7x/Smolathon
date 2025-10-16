"use client";

import { useEffect, useState } from "react";
import axi from "@/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNotificationManager } from "@/hooks/notification-context";

interface Detector {
  id: number;
  name: string;
}

interface Detection {
  id: number;
  detector: string;
  time: string;
  speed: number | null;
}

interface Workload {
  id: number;
  detections: Detection[];
}

interface Car {
  id: number;
  name: string;
  workloads: Workload[];
}

interface MergedData {
  id: number;
  detectorName: string;
  timestamp: string;
  car: string;
  speed: number;
}

export default function TableCars() {
  const [mergedData, setMergedData] = useState<MergedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { addNotification } = useNotificationManager();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [carsRes, detectorsRes] = await Promise.all([
        axi.get("/analytics/workload/get"),
        axi.get("/analytics/detectors/get"),
      ]);
      const carsData: Car[] = carsRes.data || [];
      const detectorsData: Detector[] = detectorsRes.data || [];

      const flattened: MergedData[] = carsData.flatMap((car) =>
        (car.workloads || []).flatMap((workload) =>
          (workload.detections || []).map((detection) => {
            const detectorName =
              detection.detector && typeof detection.detector === "object"
                ? detection.detector.name
                : String(detection.detector);

            return {
              id: detection.id,
              detectorName: detectorName || "—",
              timestamp: formatDate(detection.time),
              car: car.name,
              speed: Number(detection.speed) || 0,
            };
          })
        )
      );

      setMergedData(flattened);
    } catch (err: any) {
      addNotification({
        id: crypto.randomUUID(),
        title: "Ошибка",
        description: "Не удалось загрузить данные",
        status: err.response?.status || 500,
        createdAt: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // ====== ПАГИНАЦИЯ ======
  const totalPages = Math.ceil(mergedData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageData = mergedData.slice(startIdx, endIdx);

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Таблица детекций</h2>
        <Button variant="outline" size="sm" onClick={fetchData}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Обновить"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Детектор</TableHead>
              <TableHead>Дата и время</TableHead>
              <TableHead>Номер авто</TableHead>
              <TableHead>Скорость (км/ч)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.length > 0 ? (
              pageData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.detectorName}</TableCell>
                  <TableCell>{row.timestamp}</TableCell>
                  <TableCell>{row.car}</TableCell>
                  <TableCell>{row.speed.toFixed(1)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  {loading ? "Загрузка..." : "Нет данных"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ====== КНОПКИ ПАГИНАЦИИ ====== */}
      {mergedData.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={currentPage === 1}
          >
            Назад
          </Button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            disabled={currentPage === totalPages}
          >
            Вперед
          </Button>
        </div>
      )}
    </div>
  );
}
