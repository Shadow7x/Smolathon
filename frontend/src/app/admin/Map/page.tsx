"use client";
import YandexMapRoute from "@/components/map/YandexMapRoute";
import axi from "@/utils/api";
import Carsine from "@/widgets/Map/carsine/carsine";
import TableDetector from "@/widgets/Map/table/table_detector";
import TableCars from "@/widgets/Map/table/table_cars";
import { useEffect, useState } from "react";
import { Check, Upload } from "lucide-react";
import Switchmap from "@/widgets/Map/swithmap/swithmap";
import InfoCarts from "@/widgets/Map/infocarts/InsoCarts";
import formatTimeInterval from "@/utils/formatTimeInterval";
import YandexMapSelected from "@/components/map/YandeMapSelected";
// import YandexMapSelected from "@/components/map/YandexMapSelected";
export default function Map() {
  const [isAccompaniment, setIsAccompaniment] = useState(true);
  const [activeTab, setActiveTab] = useState<"map" | "create">("map");
  const [segments, setSegments] = useState<Record<string, any>>({});
  const [segments2, setSegments2] = useState<Record<string, any>>({});
  const [selected, setSelected] = useState(null);

  const [routes, setRoutes] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    car: "",
    duration: "10",
    nodes: "1",
    interval: [0, 24] as [number, number] | null,
  });

  useEffect(() => {
    console.log(selected);
  }, [selected]);

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
      console.log(filters);
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
    }
    console.log(filters);
  };

  useEffect(() => {
    if (!isAccompaniment) fetchRoutes();
  }, [filters, isAccompaniment]);

  return (
    <div className="px-6">
      <div className="flex items-center justify-between max-w-[1400px]">
        <div>
          <Carsine
            isAccompaniment={isAccompaniment}
            setIsAccompaniment={setIsAccompaniment}
            routes={routes}
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
        <div>
          <InfoCarts
            route={routes}
            filter={selected}
            onFilterChange={(a) => setSelected(a)}
            // ← обязательно функция!
          />
        </div>
      </div>
      {isAccompaniment ? (
        <YandexMapRoute
          segmentsData1={segments || {}}
          segmentsData2={filters.interval2 ? segments2 || {} : undefined}
        />
      ) : (
        <>
          <YandexMapSelected />
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
                isAccompaniment={activeTab === "map"}
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
