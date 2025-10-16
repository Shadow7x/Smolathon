"use client";
import YandexMapRoute from "@/components/map/YandexMapRoute";
import axi from "@/utils/api";
import Carsine from "@/widgets/Map/carsine/carsine";
import TableDetector from "@/widgets/Map/table/table_detector";
import TableCars from "@/widgets/Map/table/table_cars";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Upload } from "lucide-react";

export default function Map() {
  const [isAccompaniment, setIsAccompaniment] = useState(true);
  const [activeTab, setActiveTab] = useState<"map" | "create">("map");

  const [segments, setSegments] = useState<Record<string, any>>({});
  const [routes, setRoutes] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    car: "",
    duration: "",
    nodes: "3",
    period: "",
  });

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const res = await axi.get("analytics/workload/get");
        setSegments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (isAccompaniment) fetchSegments();
  }, [isAccompaniment]);

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
      setRoutes(response.data.joint_movements);
      console.log(filters);
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
    }
  };

  useEffect(() => {
    if (!isAccompaniment) fetchRoutes();
  }, [filters, isAccompaniment]);

  return (
    <div className="px-6">
      <Carsine
        isAccompaniment={isAccompaniment}
        setIsAccompaniment={setIsAccompaniment}
        routes={routes}
        filters={filters}
        onFilterChange={setFilters}
      />

      {isAccompaniment ? (
        Object.keys(segments).length === 0 ? (
          <div className="flex justify-center mt-6">
            <Skeleton className="h-[500px] w-full max-w-[1100px] rounded-2xl" />
          </div>
        ) : (
          <YandexMapRoute segmentsData={segments} />
        )
      ) : (
        <>
          <div className="outline rounded-2xl p-6 w-full max-w-[1100px] mx-auto mt-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-lg font-medium">Загрузка файлов</span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-md transition">
                  <Upload className="w-4 h-4" />
                  Выбрать файл
                </button>
                <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-md transition">
                  <Check className="w-4 h-4" />
                  Загрузить
                </button>
              </div>
            </div>

            <div
              className={cn(
                "relative flex rounded-[1rem] overflow-hidden bg-gray-100 mb-2",
                "w-[250px] h-[2.5rem] mx-auto"
              )}
            >
              <div
                className={cn(
                  "absolute top-0 left-0 h-full w-1/2 bg-black rounded-[1rem] transition-transform duration-300",
                  activeTab === "map" ? "translate-x-0" : "translate-x-full"
                )}
              />
              <button
                className={cn(
                  "relative z-10 w-1/2 h-full text-sm font-medium transition-colors duration-200",
                  activeTab === "map" ? "text-white" : "text-gray-600"
                )}
                onClick={() => setActiveTab("map")}
              >
                Авто
              </button>
              <button
                className={cn(
                  "relative z-10 w-1/2 h-full text-sm font-medium transition-colors duration-200",
                  activeTab === "create" ? "text-white" : "text-gray-600"
                )}
                onClick={() => setActiveTab("create")}
              >
                Детекторы
              </button>
            </div>
            <div>
              <TableDetector />
              <TableCars />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
