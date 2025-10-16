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
        console.log(response.data[0].id);
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
      }
    };

    fetchWorkload();
  }, []);

  const [Routes, setRoute] = useState<Route[]>([]);

  const routes = [
    {
      name: "Маршрут по центру Москвы",
      points: [
        {
          latitude: 55.7517,
          longitude: 37.6178,
          name: "Московский Кремль",
        },
        {
          latitude: 55.7525,
          longitude: 37.623,
          name: "Храм Василия Блаженного",
        },
        {
          latitude: 55.7539,
          longitude: 37.6208,
          name: "Красная площадь",
        },
        {
          latitude: 55.7514,
          longitude: 37.6289,
          name: "Парк Зарядье",
        },
      ],
      color: "#1e98ff",
    },
    {
      name: "Маршрут через парки",
      points: [
        {
          latitude: 55.7312,
          longitude: 37.6033,
          name: "Парк Горького",
        },
        {
          latitude: 55.7356,
          longitude: 37.5837,
          name: "Нескучный сад",
        },
        {
          latitude: 55.71,
          longitude: 37.5445,
          name: "Воробьевы горы",
        },
        {
          latitude: 55.7225,
          longitude: 37.5543,
          name: "МГУ",
        },
      ],
      color: "#ff4444",
    },
    {
      name: "Маршрут по северу Москвы",
      points: [
        {
          latitude: 55.8229,
          longitude: 37.6366,
          name: "ВДНХ",
        },
        {
          latitude: 55.8294,
          longitude: 37.6322,
          name: "Космонавтов аллея",
        },
        {
          latitude: 55.8198,
          longitude: 37.6117,
          name: "Останкинская башня",
        },
        {
          latitude: 55.8079,
          longitude: 37.6381,
          name: "Ботанический сад",
        },
      ],
      color: "#00c851",
    },
  ];
  return (
    <div>
      <Carsine />
      <YandexMapRoute routes={routes} routeType="auto" />
      <AnaliticsMap />
      <CreateDetector/>
      <TableDetector/>
      <TableCars/>
    </div>
  );
}
