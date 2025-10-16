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

interface Detectors {
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
  const { addNotification } = useNotificationManager();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [carsRes, detectorsRes] = await Promise.all([
        axi.get("/analytics/workload/get"),
        axi.get("/analytics/detectors/get"),
      ]);
      console.log(carsRes)
      const carsData: Car[] = carsRes.data || [];
      const detectorsData: Detectors[] = detectorsRes.data || [];

      const flattened: MergedData[] = [];

      for (const car of carsData) {
        for (const workload of car.workloads || []) {
          for (const detection of workload.detections || []) {
            const detectorObj = detectorsData.find(
              (d) => d.name === detection.detector
            );

            flattened.push({
              id: detection.id,
              detectorName: detectorObj ? detectorObj.name : "—",
              timestamp: formatDate(detection.time),
              car: car.name,
              speed: Number(detection.speed) || 0,
            });
          }
        }
        console.log(mergedData)
      }

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
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">🚘 Таблица детекций</h2>
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
            {mergedData.length > 0 ? (
              mergedData.map((row) => (
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
    </div>
  );
}
