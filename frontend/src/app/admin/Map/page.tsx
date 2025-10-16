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
import Switchmap from "@/widgets/Map/swithmap/swithmap";

export default function Map() {
  const [isAccompaniment, setIsAccompaniment] = useState(true);
  const [activeTab, setActiveTab] = useState<"map" | "create">("map");

  const [segments, setSegments] = useState<Record<string, any>>({});
  const [routes, setRoutes] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    car: "",
    duration: "10",
    nodes: "1",
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
    console.log(filters)
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

            <div className="flex justify-center mt-6">
              <Switchmap
                isAccompaniment={activeTab === "map"} // true = Авто, false = Детекторы
                setIsAccompaniment={(val) =>
                  setActiveTab(val ? "map" : "create")
                }
                labels={["Авто", "Детекторы"]}
              />
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
