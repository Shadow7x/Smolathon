"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function YandexMapSelected({
  routeType = "auto",
  className = "h-[500px] w-full",
}: {
  routeType?: "auto" | "masstransit" | "pedestrian" | "bicycle";
  className?: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstance = useRef<any>(null);
  const routesRef = useRef<any[]>([]);

  // Загрузка API Яндекс.Карт
  useEffect(() => {
    if (!window.ymaps && !document.querySelector("#ymaps-script")) {
      const script = document.createElement("script");
      script.id = "ymaps-script";
      script.src =
        "https://api-maps.yandex.ru/2.1/?apikey=43446600-2296-4713-9c16-4baf8af7f5fd&lang=ru_RU";
      script.async = true;
      script.onload = () => window.ymaps.ready(() => setMapLoaded(true));
      document.head.appendChild(script);
    } else if (window.ymaps) {
      window.ymaps.ready(() => setMapLoaded(true));
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: [55.751244, 37.618423], // Москва
        zoom: 10,
        controls: ["zoomControl"],
      });
    }

    // Очищаем старые маршруты
    routesRef.current.forEach((route) => {
      mapInstance.current.geoObjects.remove(route);
    });
    routesRef.current = [];

    // Генерация двух случайных маршрутов
    const randomRoutes = generateRandomRoutes(2);

    randomRoutes.forEach(async (points, index) => {
      const color = index === 0 ? "#00FF00" : "#FF0000";
      try {
        const multiRoute = await createRouteAsync(points, routeType, color);
        routesRef.current.push(multiRoute);
        mapInstance.current.geoObjects.add(multiRoute);

        // Добавляем маркеры начала и конца
        const startPlacemark = new window.ymaps.Placemark(
          points[0],
          {},
          { preset: "islands#circleIcon", iconColor: color }
        );
        const endPlacemark = new window.ymaps.Placemark(
          points[1],
          {},
          { preset: "islands#circleDotIcon", iconColor: color }
        );
        mapInstance.current.geoObjects.add(startPlacemark);
        mapInstance.current.geoObjects.add(endPlacemark);
      } catch (err) {
        console.error("Не удалось построить маршрут:", err);
      }
    });
  }, [mapLoaded, routeType]);

  // Функция генерации случайных маршрутов (по 2 точки)
  function generateRandomRoutes(count: number): [number, number][][] {
    const routes: [number, number][][] = [];
    const baseLat = 55.75;
    const baseLon = 37.6;

    for (let i = 0; i < count; i++) {
      const start: [number, number] = [
        baseLat + (Math.random() - 0.5) * 0.2,
        baseLon + (Math.random() - 0.5) * 0.4,
      ];
      const end: [number, number] = [
        baseLat + (Math.random() - 0.5) * 0.2,
        baseLon + (Math.random() - 0.5) * 0.4,
      ];
      routes.push([start, end]);
    }
    return routes;
  }

  // Создание маршрута (асинхронно)
  function createRouteAsync(
    referencePoints: [number, number][],
    routeType: string,
    color: string
  ) {
    return new Promise((resolve, reject) => {
      const multiRoute = new window.ymaps.multiRouter.MultiRoute(
        { referencePoints, params: { routingMode: routeType } },
        {
          routeActiveStrokeColor: color,
          routeActiveStrokeWidth: 5,
          routeOpenBalloonOnClick: false,
          wayPointVisible: false,
        }
      );

      multiRoute.model.events.add("requestsuccess", () => resolve(multiRoute));
      multiRoute.model.events.add("requestfail", () =>
        reject(new Error("Ошибка построения маршрута"))
      );
    });
  }

  return (
    <div className={className}>
      <div ref={mapRef} className="h-full w-full rounded-2xl shadow-md" />
    </div>
  );
}
