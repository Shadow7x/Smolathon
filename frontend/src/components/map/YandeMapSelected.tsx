"use client";

import axi from "@/utils/api";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function YandexMapSelected({
  routeType = "auto",
  className = "h-[500px] w-full",
  routeMain,
  routeSecond,
}: {
  routeType?: "auto" | "masstransit" | "pedestrian" | "bicycle";
  className?: string;
  routeMain: number | string;
  routeSecond?: number | string | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstance = useRef<any>(null);

  const [main, setMain] = useState<any | null>(null);
  const [second, setSecond] = useState<any | null>(null);

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
      if (mapInstance.current) mapInstance.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (!routeMain) {
      setMain(null);
      return;
    }

    axi
      .get("analytics/workload/getCars", { params: { id: routeMain } })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setMain(data || null);
      })
      .catch(console.error);
  }, [routeMain]);

  useEffect(() => {
    if (!routeSecond) {
      setSecond(null);
      return;
    }

    axi
      .get("analytics/workload/getCars", {
        params: {
          id:
            typeof routeSecond === "object"
              ? (routeSecond as any).name
              : routeSecond,
        },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setSecond(data || null);
      })
      .catch(console.error);
  }, [routeSecond]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: [54.7846, 32.0515], // Смоленск
        zoom: 12,
        controls: [],
      });
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !main) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: [54.7846, 32.0515],
        zoom: 12,
        controls: [],
      });
    }

    mapInstance.current.geoObjects.removeAll();

    const routesToDraw: { car: any; color: string; label: string }[] = [];
    routesToDraw.push({ car: main, color: "#0E9F6E", label: "Основной" });
    if (second)
      routesToDraw.push({ car: second, color: "#EF4444", label: "Сравнение" });

    const allPoints: [number, number][][] = [];

    const draw = async () => {
      for (const r of routesToDraw) {
        const points = buildRoutePoints(r.car);
        if (!points.length) continue;

        // Плейсмаркеры для каждой детекции
        points.forEach((p, idx) => {
          const mark = new window.ymaps.Placemark(
            p,
            { balloonContent: `${r.label}: Точка ${idx + 1}` },
            { preset: "islands#dotIcon", iconColor: r.color }
          );
          mapInstance.current.geoObjects.add(mark);
        });

        // Выделяем старт/финиш
        if (points.length >= 1) {
          const startMark = new window.ymaps.Placemark(
            points[0],
            { balloonContent: `${r.label}: Старт` },
            { preset: "islands#icon", iconColor: r.color }
          );
          mapInstance.current.geoObjects.add(startMark);
        }
        if (points.length >= 2) {
          const endMark = new window.ymaps.Placemark(
            points[points.length - 1],
            { balloonContent: `${r.label}: Финиш` },
            { preset: "islands#dotIcon", iconColor: r.color }
          );
          mapInstance.current.geoObjects.add(endMark);
        }

        // Строим маршрут по сегментам между каждой парой точек
        for (let i = 0; i < points.length - 1; i++) {
          try {
            const mr: any = await createRouteAsync(
              [points[i], points[i + 1]],
              routeType,
              r.color
            );
            mapInstance.current.geoObjects.add(mr);
          } catch (e) {
            console.error("Ошибка построения сегмента маршрута:", i, e);
          }
        }

        allPoints.push(points);
      }

      // Центровка карты по всем точкам
      const flat = allPoints.flat();
      if (flat.length) {
        const bounds = window.ymaps
          .geoQuery(flat.map((c) => new window.ymaps.Placemark(c)))
          .getBounds();
        if (bounds) {
          mapInstance.current.setBounds(bounds, {
            checkZoomRange: true,
            zoomMargin: 40,
          });
        }
      }
    };

    draw();
  }, [mapLoaded, main, second, routeType]);

  // Собираем точки маршрута из всех детекций, отсортированных по времени
  function buildRoutePoints(car: any): [number, number][] {
    const workloads = Array.isArray(car?.workloads) ? car.workloads : [];
    const detections = workloads
      .flatMap((w: any) => (Array.isArray(w?.detections) ? w.detections : []))
      .sort(
        (a: any, b: any) =>
          new Date(a.time).getTime() - new Date(b.time).getTime()
      );

    const points: [number, number][] = [];
    for (const d of detections) {
      const lat = d?.detector?.latitude;
      const lon = d?.detector?.longitude;
      if (typeof lat === "number" && typeof lon === "number") {
        points.push([lat, lon]);
      }
    }
    return points;
  }

  // Создание и ожидание построения маршрута в Yandex MultiRoute
  function createRouteAsync(
    referencePoints: [number, number][],
    routingMode: string,
    color: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const multiRoute = new window.ymaps.multiRouter.MultiRoute(
        { referencePoints, params: { routingMode } },
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
