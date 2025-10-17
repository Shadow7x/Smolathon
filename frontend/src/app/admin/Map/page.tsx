"use client";
import YandexMapRoute from "@/components/map/YandexMapRoute";
import axi from "@/utils/api";
import Carsine from "@/widgets/Map/carsine/carsine";
import TableDetector from "@/widgets/Map/table/table_detector";
import TableCars from "@/widgets/Map/table/table_cars";
import WorkloadUpload from "@/widgets/Map/createCar/createCar";
import { useEffect, useState } from "react";

export default function Map() {
  const [isAccompaniment, setIsAccompaniment] = useState(true);
  const [segments, setSegments] = useState<Record<string, any>>({});
  const [segments2, setSegments2] = useState<Record<string, any>>({});
  const [routes, setRoutes] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    car: "",
    duration: "10",
    nodes: "1",
    interval: [0, 24] as [number, number] | null,
  });

  useEffect(() => {
    const fetchWorkloads = async (
      interval: [number, number],
      key: "segments" | "segments2"
    ) => {
      const { timeStart, timeEnd } = formatTimeInterval(interval);

      try {
        const response = await axi.get("/analytics/workload/get", {
          params: {
            car: filters.car,
            time_start: timeStart,
            time_end: timeEnd,
          },
        });

        if (key === "segments") setSegments(response.data);
        if (key === "segments2") setSegments2(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке:", err);
      }
    };

    if (isAccompaniment && filters.interval)
      fetchWorkloads(filters.interval, "segments");
    if (isAccompaniment && filters.interval2)
      fetchWorkloads(filters.interval2, "segments2");
  }, [filters, isAccompaniment]);

  const fetchRoutes = async () => {
    try {
      const response = await axi.get("analytics/workload/getAdjacencies", {
        params: {
          target: filters.car,
          nodes_count: filters.nodes,
          max_time_diff: filters.duration,
          time_interval: filters.period,
        },
      });
      setRoutes(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
    }
  };

  useEffect(() => {
    if (!isAccompaniment) fetchRoutes();
  }, [filters, isAccompaniment]);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 flex flex-col max-w-[1400px] mx-auto">
      {/* Верхний блок — фильтры и настройки */}
      <div className="bg-white border-gray-200 sm:p-6">
        <Carsine
          isAccompaniment={isAccompaniment}
          setIsAccompaniment={setIsAccompaniment}
          routes={routes}
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>

      {/* Блок карты */}
      {isAccompaniment ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <YandexMapRoute
            segmentsData1={segments || {}}
            segmentsData2={filters.interval2 ? segments2 || {} : undefined}
          />
        </div>
      ) : (
        <>
          {/* Блок загрузки */}
          <div className="bg-white border-gray-200 p-4 sm:p-6">
            <WorkloadUpload />
          </div>

          {/* Таблицы */}
          <div className="bg-white border-gray-200 p-4 sm:p-6 flex flex-col gap-6">
            <TableDetector />
            <TableCars />
          </div>
        </>
      )}
    </div>
  );
}

function formatTimeInterval(interval: [number, number]) {
  const [start, end] = interval;
  const timeStart =
    start === 24 ? "23:59" : start < 10 ? `0${start}:00` : `${start}:00`;
  const timeEnd = end === 24 ? "23:59" : end < 10 ? `0${end}:00` : `${end}:00`;
  return { timeStart, timeEnd };
}
