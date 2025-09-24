"use client";

import React, { useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

export default function StreetHighlighter() {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [ymaps, setYmaps] = useState<any>(null);

  const handleSearch = () => {
    if (!address || !ymaps) {
      console.warn("Нет адреса или YMaps ещё не загрузились");
      return;
    }

    ymaps.geocode(address).then((res: any) => {
      const firstGeoObject = res.geoObjects.get(0);
      if (firstGeoObject) {
        const newCoords = firstGeoObject.geometry.getCoordinates();
        console.log("Нашли координаты:", newCoords);
        setCoords(newCoords);
      } else {
        alert("Адрес не найден");
      }
    });
  };

  return (
    <YMaps
      query={{
        apikey: "5547c71f-7034-4404-9cfc-e1a2d8198ea9", // ключ в .env.local
        lang: "ru_RU",
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Инпут и кнопка */}
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

        {/* Карта */}
        <Map
          defaultState={{ center: [55.75, 37.57], zoom: 9 }}
          width="100%"
          height="500px"
          modules={["geocode"]}
          onLoad={(ymapsInstance) => {
            console.log("YMaps загружен", ymapsInstance);
            setYmaps(ymapsInstance);
          }}
        >
          {coords && <Placemark geometry={coords} />}
        </Map>
      </div>
    </YMaps>
  );
}
