"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

interface Detector {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface Detection {
  id: number;
  detector: Detector;
  time: string;
  speed: number;
  car: number;
}

interface Workload {
  id: number;
  detections: Detection[];
  time_interval: string;
}

interface CarRouteData {
  id: number;
  workloads: Workload[];
  name: string;
}

interface Point {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface Route {
  points: Point[];
  color?: string;
  name?: string;
}

interface YandexMapRouteProps {
  cars: CarRouteData[];
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
      script.onload = () => {
        window.ymaps.ready(() => {
          setMapLoaded(true);
        });
      };
      document.head.appendChild(script);
    } else {
      window.ymaps.ready(() => {
        setMapLoaded(true);
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || cars.length === 0) return;
    if (mapInstance.current) return;

    const initMap = async () => {
      try {
        mapInstance.current = new window.ymaps.Map(mapRef.current, {
          center: [55.7558, 37.6173],
          zoom: 10,
          controls: [],
        });

        multiRoutes.current = [];
        mapInstance.current.geoObjects.removeAll();

        cars.slice(4, 5).forEach((car, index) => {
          const routeColor = getColorByIndex(index);

          // Собираем точки из всех детекций по времени
          const allDetections = car.workloads
            .flatMap((w) => w.detections)
            .sort(
              (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
            );

          const referencePoints = allDetections.map((d) => [
            d.detector.latitude,
            d.detector.longitude,
          ]);

          if (referencePoints.length === 0) return;

          const multiRoute = new window.ymaps.multiRouter.MultiRoute(
            {
              referencePoints,
              params: { routingMode: routeType },
            },
            {
              boundsAutoApply: false,
              wayPointVisible: false,
              wayPointStartIconColor: routeColor,
              wayPointFinishIconColor: routeColor,
              routeActiveStrokeWidth: 5,
              routeActiveStrokeColor: routeColor,
              routeStrokeStyle: "solid",
              pinIconFillColor: routeColor,
              routeOpenBalloonOnClick: false,
              routePanel: false,
              viaPointVisible: false,
            }
          );

          multiRoutes.current.push(multiRoute);
          mapInstance.current.geoObjects.add(multiRoute);
          const totalPoints = allDetections.length;

          allDetections.forEach((d, idx) => {
            const factor = totalPoints > 1 ? idx / (totalPoints - 1) : 0; // 0 → начало, 1 → конец
            const color = interpolateColor("#ff0000", "#00ff00", factor); // красный → зелёный

            const placemark = new window.ymaps.Placemark(
              [d.detector.latitude, d.detector.longitude],
              {},
              {
                preset: "islands#circleIcon",
                iconColor: color,
              }
            );

            mapInstance.current.geoObjects.add(placemark);
          });
        });

        // Подгоняем карту под все объекты
        if (cars.length > 0) {
          mapInstance.current.setBounds(
            mapInstance.current.geoObjects.getBounds(),
            { checkZoomRange: true, duration: 300 }
          );
        }
      } catch (error) {
        console.error("Error initializing Yandex Map:", error);
      }
    };

    initMap();
  }, [mapLoaded, cars, routeType]);

  // Функция для интерполяции цвета между красным и зелёным
  const interpolateColor = (
    startColor: string,
    endColor: string,
    factor: number
  ) => {
    const hexToRgb = (hex: string) => {
      const sanitized = hex.replace(/^#/, "");
      const bigint = parseInt(sanitized, 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    const rgbToHex = (r: number, g: number, b: number) => {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const startRGB = hexToRgb(startColor);
    const endRGB = hexToRgb(endColor);

    const result = startRGB.map((startVal, i) => {
      const endVal = endRGB[i];
      return Math.round(startVal + (endVal - startVal) * factor);
    });

    return rgbToHex(result[0], result[1], result[2]);
  };

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
