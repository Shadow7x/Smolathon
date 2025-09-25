"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

interface YandexMapProps {
  apiKey: string;
  address: string; // например "Смоленск, Большая Советская 30"
}

export default function YandexMap({ apiKey, address }: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const ymapsRef = useRef<any>(null);
  const mapInstance = useRef<any>(null);
  const placemarkRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  // Загружаем скрипт Яндекс.Карт
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.getElementById("yandex-maps-script")) {
      const script = document.createElement("script");
      script.id = "yandex-maps-script";
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    } else {
      setLoaded(true);
    }
  }, [apiKey]);

  // Инициализация карты с Москвой
  useEffect(() => {
    if (!loaded || !window.ymaps) return;

    window.ymaps.ready(() => {
      ymapsRef.current = window.ymaps;

      const initialCoords = [55.751244, 37.618423]; // Москва

      const map = new ymapsRef.current.Map(mapRef.current, {
        center: initialCoords,
        zoom: 12,
      });

      const placemark = new ymapsRef.current.Placemark(initialCoords, {
        balloonContent: "Москва",
      });

      map.geoObjects.add(placemark);

      mapInstance.current = map;
      placemarkRef.current = placemark;
    });
  }, [loaded]);

  // Функция перехода к адресу
  const goToAddress = async () => {
    if (!ymapsRef.current || !mapInstance.current) return;

    const res = await ymapsRef.current.geocode(address);
    const firstGeoObject = res.geoObjects.get(0);

    if (!firstGeoObject) {
      console.error("Адрес не найден:", address);
      return;
    }

    const coords = firstGeoObject.geometry.getCoordinates();

    // Обновляем центр карты
    mapInstance.current.setCenter(coords, 16);

    // Убираем старую метку и добавляем новую
    if (placemarkRef.current) {
      mapInstance.current.geoObjects.remove(placemarkRef.current);
    }

    const newPlacemark = new ymapsRef.current.Placemark(coords, {
      balloonContent: address,
    });

    mapInstance.current.geoObjects.add(newPlacemark);
    placemarkRef.current = newPlacemark;
  };

  return (
    <div>
      <div ref={mapRef} className="w-full h-[500px] rounded-xl shadow mb-4" />
      <button
        onClick={goToAddress}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Перейти на {address}
      </button>
    </div>
  );
}
