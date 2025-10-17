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
  segmentsData1: SegmentData;
  segmentsData2?: SegmentData;
  routeType?: "auto" | "masstransit" | "pedestrian" | "bicycle";
  className?: string;
}

export default function YandexMapRoute({
  segmentsData1,
  segmentsData2,
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
    if (!mapLoaded || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: [54.7846, 32.0515], // Смоленск
        zoom: 12,
        controls: [],
      });
    }

    mapInstance.current.geoObjects.removeAll();
    multiRoutes.current = [];

    const renderSegments = (segmentsData: SegmentData, color: string) => {
      Object.keys(segmentsData).forEach((key) => {
        const segment = segmentsData[key];
        const start = [segment.start[1], segment.start[0]];
        const end = [segment.end[1], segment.end[0]];
        const referencePoints = [start, end];

        const multiRoute = new window.ymaps.multiRouter.MultiRoute(
          { referencePoints, params: { routingMode: routeType } },
          {
            boundsAutoApply: false,
            wayPointVisible: false,
            routeActiveStrokeWidth: 5,
            routeActiveStrokeColor: color,
            routeStrokeStyle: "solid",
            routeOpenBalloonOnClick: false,
          }
        );
        multiRoute.model.setParams({ results: 1 });
        multiRoutes.current.push(multiRoute);
        mapInstance.current.geoObjects.add(multiRoute);

        const startPlacemark = new window.ymaps.Placemark(
          start,
          {},
          { preset: "islands#circleIcon", iconColor: color }
        );
        const endPlacemark = new window.ymaps.Placemark(
          end,
          {},
          { preset: "islands#circleIcon", iconColor: color }
        );

        mapInstance.current.geoObjects.add(startPlacemark);
        mapInstance.current.geoObjects.add(endPlacemark);
      });
    };

    // Если данных нет, просто центр на Смоленск
    const hasData1 = segmentsData1 && Object.keys(segmentsData1).length > 0;
    const hasData2 = segmentsData2 && Object.keys(segmentsData2).length > 0;

    if (!hasData1 && !hasData2) {
      mapInstance.current.setCenter([54.7846, 32.0515]);
      mapInstance.current.setZoom(12);
      return;
    }

    if (hasData1) renderSegments(segmentsData1, "#00FF00");
    if (hasData2) renderSegments(segmentsData2, "#FF0000");

    if (multiRoutes.current.length > 0) {
      mapInstance.current.setBounds(
        mapInstance.current.geoObjects.getBounds(),
        { checkZoomRange: true, duration: 300 }
      );
    }
  }, [mapLoaded, segmentsData1, segmentsData2, routeType]);

  return (
    <div className={className}>
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
