"use client";

import React, { useState, useEffect } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import axi from "@/utils/api";

interface TrafficLight {
  id: number;
  name: string;
  address: string; // адрес с бэкенда
  coords?: [number, number]; // координаты после геокодинга
}

export default function StreetHighlighter() {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [ymaps, setYmaps] = useState<any>(null);
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([]);

  // Получение всех светофоров
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axi
      .get("analytics/trafficLight/get", {
        headers: {
          Accept: "application/json",
        },
      })
      .then((res) => {
        // Преобразуем под нашу структуру
        const lights: TrafficLight[] = res.data.map((item: any) => ({
          id: item.id,
          name: item.address || item.name, // если есть address, используем его
          address: item.address || item.name,
        }));
        setTrafficLights(lights);
      })
      .catch((err) => console.error("Ошибка при получении светофоров:", err));
  }, []);

  useEffect(() => {
    if (!ymaps || trafficLights.length === 0) return;

    // фильтруем только те метки, у которых нет coords
    const lightsToGeocode = trafficLights.filter((light) => !light.coords);
    if (lightsToGeocode.length === 0) return; // ничего геокодить не нужно

    const geocodeAll = async () => {
      try {
        const results = await Promise.all(
          lightsToGeocode.map(async (light) => {
            const formattedAddress =
              light.address.replace(/\s*\/\s*/g, ", ") + ", Смоленск";
            const res = await ymaps.geocode(formattedAddress);
            const firstGeoObject = res.geoObjects.get(0);
            if (firstGeoObject) {
              const coords = firstGeoObject.geometry.getCoordinates();
              return { ...light, coords };
            } else {
              console.warn("Адрес не найден:", formattedAddress);
              return light;
            }
          })
        );

        // обновляем только геокодированные метки, оставляя остальные
        setTrafficLights((prev) =>
          prev.map((light) => {
            const found = results.find((r) => r.id === light.id);
            return found ? found : light;
          })
        );
      } catch (err) {
        console.error("Ошибка при геокодинге светофоров:", err);
      }
    };

    geocodeAll();
  }, [ymaps, trafficLights]);

  const handleSearch = () => {
    if (!address || !ymaps) return;

    const formattedAddress = address.replace(/\s*\/\s*/g, ", ") + ", Смоленск";
    ymaps.geocode(formattedAddress).then((res: any) => {
      const firstGeoObject = res.geoObjects.get(0);
      if (firstGeoObject) setCoords(firstGeoObject.geometry.getCoordinates());
      else alert("Адрес не найден");
    });
  };

  return (
    <YMaps
      query={{ apikey: "5547c71f-7034-4404-9cfc-e1a2d8198ea9", lang: "ru_RU" }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Введите адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Найти
          </button>
        </div>

        <Map
          defaultState={{ center: [54.7867, 32.0406], zoom: 12 }}
          width="100%"
          height="500px"
          modules={["geocode", "geoObject.addon.balloon"]}
          onLoad={(ymapsInstance) => setYmaps(ymapsInstance)}
        >
          {coords && (
            <Placemark
              geometry={coords}
              properties={{ balloonContent: "Ваш адрес" }}
            />
          )}

          {/* Метки светофоров через geocode с балунами */}
          {trafficLights
            .filter((light) => light.coords)
            .map((light) => (
              <Placemark
                key={light.id}
                geometry={light.coords}
                properties={{
                  hintContent: light.name, // маленькая подсказка при наведении
                  balloonContentHeader: light.name, // заголовок балуна
                  balloonContentBody: `Адрес: ${light.address}`, // тело балуна
                }}
                options={{
                  balloonPanelMaxMapArea: 0, // всегда показывать балун
                }}
              />
            ))}
        </Map>
      </div>
    </YMaps>
  );
}
