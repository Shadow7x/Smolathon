"use client";
import YandexMapRoute, { Route } from "@/components/map/YandexMapRoute";
import axi from "@/utils/api";
import AnaliticsMap from "@/widgets/Map/createCar/createCar";
import Carsine from "@/widgets/Map/carsine/carsine";
import CreateDetector from "@/widgets/Map/createDetector/createDetector";
import TableDetector from "@/widgets/Map/table/table_detector";
import TableCars from "@/widgets/Map/table/table_cars";
import { useEffect, useState } from "react";
export default function Map() {
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
      <AnaliticsMap />
      <CreateDetector/>
      <TableDetector/>
      <TableCars/>
    </div>
  );
}
