"use client";
import { Button } from "@/components/ui/button";
import YandexMapRoute from "@/components/map/YandexMapRoute";
import axi from "@/utils/api";
import Carsine from "@/widgets/Map/carsine/carsine";
import TableDetector from "@/widgets/Map/table/table_detector";
import TableCars from "@/widgets/Map/table/table_cars";
import CreateDetector from "@/widgets/Map/createDetector/createDetector";
import WorkloadUpload from "@/widgets/Map/createCar/createCar";
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
      <Carsine
        isAccompaniment={isAccompaniment}
        setIsAccompaniment={setIsAccompaniment}
      />

      {!isAccompaniment ? (
        <>
        <YandexMapRoute cars={routes} routeType="auto" />
        <WorkloadUpload/>
        <CreateDetector/>
        {/* Контент вкладок */}
        <div className="outline rounded-2xl">
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
