"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

interface Detection {
  detector: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

interface Workload {
  detections: Detection[];
}

interface CarData {
  id: number;
  name: string;
  workloads: Workload[];
}

interface YandexMapRouteProps {
  cars: CarData[];
  routeType?: "auto" | "masstransit" | "pedestrian" | "bicycle";
  className?: string;
}

function YandexMapRoute({
  cars,
  routeType = "auto",
  className = "h-[500px] w-full",
}: YandexMapRouteProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstance = useRef<any>(null);
  const multiRoutes = useRef<any[]>([]);

  useEffect(() => {
    if (!window.ymaps) {
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=43446600-2296-4713-9c16-4baf8af7f5fd&lang=ru_RU`;
      script.async = true;
      script.onload = () => window.ymaps.ready(() => setMapLoaded(true));
      document.head.appendChild(script);
    } else {
      window.ymaps.ready(() => setMapLoaded(true));
    }

    return () => {
      if (mapInstance.current) mapInstance.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || cars.length === 0) return;
    if (mapInstance.current) return;

    mapInstance.current = new window.ymaps.Map(mapRef.current, {
      center: [55.7558, 37.6173],
      zoom: 10,
      controls: [],
    });

    multiRoutes.current = [];
    mapInstance.current.geoObjects.removeAll();

    cars.slice(1).forEach((car, carIndex) => {
      // Извлекаем все detections и сортируем по времени
      const detections = car.workloads
        .flatMap((wl) => wl.detections)
        .sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );

      if (detections.length === 0) return;

      const referencePoints = detections.map((d) => [
        d.detector.latitude,
        d.detector.longitude,
      ]);
      const routeColor = getColorByIndex(carIndex);

      const multiRoute = new window.ymaps.multiRouter.MultiRoute(
        {
          referencePoints,
          params: { routingMode: routeType },
        },
        {
          boundsAutoApply: false,
          wayPointVisible: false,
          routeActiveStrokeWidth: 5,
          routeActiveStrokeColor: routeColor,
          routeStrokeStyle: "solid",
          pinIconFillColor: routeColor,
          routeOpenBalloonOnClick: false,
        }
      );

      multiRoutes.current.push(multiRoute);
      mapInstance.current.geoObjects.add(multiRoute);

      // Маркеры начала и конца маршрута
      const startPlacemark = new window.ymaps.Placemark(
        referencePoints[0],
        {},
        {
          preset: "islands#circleIcon",
          iconColor: routeColor,
        }
      );
      const endPlacemark = new window.ymaps.Placemark(
        referencePoints[referencePoints.length - 1],
        {},
        {
          preset: "islands#circleIcon",
          iconColor: routeColor,
        }
      );
      mapInstance.current.geoObjects.add(startPlacemark);
      mapInstance.current.geoObjects.add(endPlacemark);

      // Промежуточные точки
      for (let i = 1; i < referencePoints.length - 1; i++) {
        const intermediatePlacemark = new window.ymaps.Placemark(
          referencePoints[i],
          {},
          {
            preset: "islands#circleDotIcon",
            iconColor: routeColor,
          }
        );
        mapInstance.current.geoObjects.add(intermediatePlacemark);
      }
    });

    // Устанавливаем границы карты
    if (multiRoutes.current.length > 0) {
      mapInstance.current.setBounds(
        mapInstance.current.geoObjects.getBounds(),
        { checkZoomRange: true, duration: 300 }
      );
    }
  }, [mapLoaded, cars, routeType]);

  const getColorByIndex = (index: number): string => {
    const colors = [
      "#1e98ff",
      "#ff4444",
      "#00c851",
      "#ffbb33",
      "#aa66cc",
      "#33b5e5",
      "#ff6b6b",
      "#4db6ac",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={className}>
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}

export default YandexMapRoute;
