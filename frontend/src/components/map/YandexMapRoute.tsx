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
  const prevSegmentsData1 = useRef<SegmentData>({});
  const prevSegmentsData2 = useRef<SegmentData>({});

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
        center: [54.7846, 32.0515],
        zoom: 12,
        controls: [],
      });
    }

    const loadRoutes = async () => {
      if (segmentsData1) {
        await updateSegments(
          segmentsData1,
          prevSegmentsData1.current,
          "#00FF00"
        );
        prevSegmentsData1.current = { ...segmentsData1 };
      }

      if (segmentsData2) {
        await updateSegments(
          segmentsData2,
          prevSegmentsData2.current,
          "#FF0000"
        );
        prevSegmentsData2.current = { ...segmentsData2 };
      }

      if (multiRoutes.current.length > 0) {
        mapInstance.current.setBounds(
          mapInstance.current.geoObjects.getBounds(),
          {
            checkZoomRange: true,
            duration: 300,
          }
        );
      }
    };

    loadRoutes();
  }, [mapLoaded, segmentsData1, segmentsData2, routeType]);

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
        reject(new Error("Route building failed"))
      );

      mapInstance.current.geoObjects.add(multiRoute);
    });
  }

  const updateSegments = async (
    newData: SegmentData,
    prevData: SegmentData,
    color: string
  ) => {
    // Удаляем сегменты, которых больше нет
    for (const key of Object.keys(prevData)) {
      if (!newData[key] && multiRoutes.current[key]) {
        mapInstance.current.geoObjects.remove(multiRoutes.current[key]);
        delete multiRoutes.current[key];
      }
    }

    // Добавляем или обновляем сегменты
    for (const key of Object.keys(newData)) {
      if (
        !prevData[key] ||
        JSON.stringify(prevData[key]) !== JSON.stringify(newData[key])
      ) {
        // Если сегмент новый или изменился
        if (multiRoutes.current[key]) {
          mapInstance.current.geoObjects.remove(multiRoutes.current[key]);
        }

        const segment = newData[key];
        const start: [number, number] = [segment.start[1], segment.start[0]];
        const end: [number, number] = [segment.end[1], segment.end[0]];

        try {
          const multiRoute = await createRouteAsync(
            [start, end],
            routeType,
            color
          );
          multiRoute.model.setParams({ results: 1 });
          multiRoutes.current[key] = multiRoute;
          mapInstance.current.geoObjects.add(multiRoute);

          const startPlacemark = new window.ymaps.Placemark(
            start,
            {},
            { preset: "islands#icon", iconColor: color }
          );
          const endPlacemark = new window.ymaps.Placemark(
            end,
            {},
            { preset: "islands#dotIcon", iconColor: color }
          );

          mapInstance.current.geoObjects.add(startPlacemark);
          mapInstance.current.geoObjects.add(endPlacemark);
        } catch (err) {
          console.error("Маршрут не построен", err);
        }
      }
    }
  };

  return (
    <div className={className}>
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
