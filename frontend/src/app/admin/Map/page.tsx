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
        <div className="flex mt-4 w-[1014px] justify-center mx-auto">
          {activeTab === "map" && <AnaliticsMap />}
          {activeTab === "create" && <CreateDetector />}
        </div>
        <div
          className={cn(
            "relative flex items-center rounded-[1rem] overflow-hidden bg-gray-100 mb-4",
            "w-[450px] h-[2.5rem] mx-auto"
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
            Загрузить авто
          </button>
          <button
            className={cn(
              "relative z-10 w-1/2 h-full text-sm font-medium transition-colors duration-200",
              activeTab === "create" ? "text-white" : "text-gray-600"
            )}
            onClick={() => setActiveTab("create")}
          >
            Загрузить детекторы
          </button>
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
