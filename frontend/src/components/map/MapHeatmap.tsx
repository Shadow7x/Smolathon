"use client";
import { useEffect, useRef, useState } from "react";

const MapHeatmap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [ymapsLoaded, setYmapsLoaded] = useState(false);

  // 🔹 тестовые данные (15 точек)
  const accidents = [
    [54.7818, 32.0454],
    [54.7825, 32.048],
    [54.79, 32.05],
    [54.77, 32.03],
    [54.785, 32.06],
    [54.783, 32.04],
    [54.786, 32.055],
    [54.788, 32.052],
    [54.791, 32.057],
    [54.792, 32.049],
    [54.775, 32.038],
    [54.776, 32.041],
    [54.779, 32.044],
    [54.781, 32.047],
    [54.784, 32.051],
  ];

  useEffect(() => {
    // ждём пока API Яндекс.Карт загрузится
    const checkYmaps = () => {
      if (typeof window !== "undefined" && (window as any).ymaps) {
        (window as any).ymaps.ready(() => {
          setYmapsLoaded(true);
        });
      } else {
        setTimeout(checkYmaps, 300);
      }
    };
    checkYmaps();
  }, []);

  useEffect(() => {
    if (!ymapsLoaded || !mapRef.current) return;

    const ymaps = (window as any).ymaps;

    // создаём карту
    const map = new ymaps.Map(mapRef.current, {
      center: [54.7818, 32.0454],
      zoom: 12,
      controls: ["zoomControl"],
    });

    // подключаем heatmap
    ymaps.modules.require(["Heatmap"], function (Heatmap: any) {
      const heatmap = new Heatmap(accidents, {
        radius: 25,
        dissipating: false,
        opacity: 0.8,
        intensityOfMidpoint: 0.2,
        gradient: {
          0.1: "rgba(128, 255, 0, 0.7)",
          0.2: "rgba(255, 255, 0, 0.8)",
          0.7: "rgba(234, 72, 58, 0.9)",
          1.0: "rgba(162, 36, 25, 1)",
        },
      });

      heatmap.setMap(map);
    });
  }, [ymapsLoaded]);

  return (
    <div className="w-full h-[600px] border rounded">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapHeatmap;
