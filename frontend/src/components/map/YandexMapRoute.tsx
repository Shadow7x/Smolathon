"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

interface SegmentData {
  [key: string]: {
    count: number;
    start: [number, number]; // [long, lat]
    end: [number, number]; // [long, lat]
    speed: number;
    time: number;
  };
}

interface YandexMapRouteProps {
  segmentsData: SegmentData;
  routeType?: "auto" | "masstransit" | "pedestrian" | "bicycle";
  className?: string;
}

export default function YandexMapRoute({
  segmentsData,
  routeType = "auto",
  className = "h-[500px] w-full",
}: YandexMapRouteProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstance = useRef<any>(null);
  const multiRoutes = useRef<any[]>([]);

  // Загрузка Yandex Maps API
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
    if (!mapLoaded || !mapRef.current || !segmentsData) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: [54.7846, 32.0515], // центр можно взять первый сегмент
        zoom: 12,
        controls: [],
      });
    }

    mapInstance.current.geoObjects.removeAll();
    multiRoutes.current = [];

    const keys = Object.keys(segmentsData);
    keys.forEach((key, index) => {
      const segment = segmentsData[key];

      // Важно: новые данные [long, lat] → [lat, long]
      const start = [segment.start[1], segment.start[0]];
      const end = [segment.end[1], segment.end[0]];
      const referencePoints = [start, end];

      const routeColor = getColorByIndex(index);

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
          routeOpenBalloonOnClick: false,
        }
      );
      multiRoute.model.setParams({ results: 1 });

      multiRoutes.current.push(multiRoute);

      mapInstance.current.geoObjects.add(multiRoute);

      // Начальная и конечная точки
      const startPlacemark = new window.ymaps.Placemark(
        start,
        {},
        {
          preset: "islands#circleIcon",
          iconColor: routeColor,
        }
      );
      const endPlacemark = new window.ymaps.Placemark(
        end,
        {},
        {
          preset: "islands#circleIcon",
          iconColor: routeColor,
        }
      );

      mapInstance.current.geoObjects.add(startPlacemark);
      mapInstance.current.geoObjects.add(endPlacemark);
    });

    if (multiRoutes.current.length > 0) {
      mapInstance.current.setBounds(
        mapInstance.current.geoObjects.getBounds(),
        { checkZoomRange: true, duration: 300 }
      );
    }
  }, [mapLoaded, segmentsData, routeType]);

  const getColorByIndex = (index: number): string => {
    const hue = (index * 137.5) % 360;
    const c = 255;
    const x = Math.round(c * (1 - Math.abs(((hue / 60) % 2) - 1)));
    const m = 0;
    let r = 0,
      g = 0,
      b = 0;

    if (hue < 60) [r, g, b] = [c, x, 0];
    else if (hue < 120) [r, g, b] = [x, c, 0];
    else if (hue < 180) [r, g, b] = [0, c, x];
    else if (hue < 240) [r, g, b] = [0, x, c];
    else if (hue < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    const toHex = (v: number) => v.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return (
    <div className={className}>
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
