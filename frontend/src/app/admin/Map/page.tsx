"use client";
import YandexMapRoute, { Route } from "@/components/map/YandexMapRoute";
import axi from "@/utils/api";
import AnaliticsMap from "@/widgets/Map/createCar/createCar";
import Carsine from "@/widgets/Map/carsine/carsine";
import CreateDetector from "@/widgets/Map/createDetector/createDetector";
import TableDetector from "@/widgets/Map/table/table_detector";
import TableCars from "@/widgets/Map/table/table_cars";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
export default function Map() {
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

  const [routes, setRoute] = useState<Route[]>([]);

  return (
    <div className="px-6">
      <Carsine />
      <YandexMapRoute cars={routes} routeType="auto" />

      <div className="p-4 min-h-[300px] flex flex-col justify-around outline-solid mt-4 rounded-2xl ">
          <div className="flex mt-4 w-[1014px] justify-center">
            {activeTab === "map" && <AnaliticsMap />}
            {activeTab === "create" && <CreateDetector />}
          </div>
        <div className="flex items-center max-w-[1400px] justify-center">
          <div className="flex w-[450px] justify-between">
            <Button
              className="w-[200px]"
              variant={activeTab === "map" ? "default" : "outline"}
              onClick={() => setActiveTab("map")}
            >
              Загрузить авто
            </Button>
            <Button
              className="w-[200px]"
              variant={activeTab === "create" ? "default" : "outline"}
              onClick={() => setActiveTab("create")}
            >
              Загрузить детекторы
            </Button>
          </div>
        </div>
      </div>

      <div>
        <TableDetector/>
        <TableCars/>
      </div>
    </div>
  );
}
