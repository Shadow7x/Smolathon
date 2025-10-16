"use client";
import { Button } from "@/components/ui/button";
import YandexMapRoute from "@/components/map/YandexMapRoute";
import axi from "@/utils/api";
import AnaliticsMap from "@/widgets/Map/createCar/createCar";
import Carsine from "@/widgets/Map/carsine/carsine";
import CreateDetector from "@/widgets/Map/createDetector/createDetector";
import TableDetector from "@/widgets/Map/table/table_detector";
import TableCars from "@/widgets/Map/table/table_cars";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Upload } from "lucide-react";

export default function Map() {
  const [routes, setRoute] = useState([]);
  const [isAccompaniment, setIsAccompaniment] = useState(true);
  const [activeTab, setActiveTab] = useState<"map" | "create">("map");

  useEffect(() => {
    const fetchWorkload = async () => {
      try {
        const response = await axi.get("analytics/workload/get");
        setRoute(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
      }
    };

    fetchWorkload();
  }, []);

  return (
    
    <div className="px-6">
      < Carsine
        isAccompaniment={isAccompaniment}
        setIsAccompaniment={setIsAccompaniment}
      />

      {!isAccompaniment ? (
        <>
          <YandexMapRoute cars={routes} routeType="auto" />

        {/* Контент вкладок */}
        <div className="outline rounded-2xl p-6 w-full max-w-[1100px] mx-auto">
              {/* Верхняя панель */}
              <div className="flex justify-between items-center mb-6">
                {/* Левая часть */}
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-lg font-medium">Загрузка файлов</span>
                </div>

                {/* Правая часть */}
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

              {/* Переключатель вкладок */}
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
            </div>
          <div>
            <TableDetector />
            <TableCars />
          </div>
        </>
      ) : (
        <div className="text-xl font-medium">Загруженность</div>
      )}
    </div>
  );
}
