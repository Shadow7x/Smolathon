import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

export default function MapWidget() {
  const center = [54.7818, 32.0454];
  const zoom = 11;

  const markers = [
    { id: 1, coords: [54.7818, 32.0454], title: "ДТП - январь" },
    { id: 2, coords: [54.79, 32.05], title: "Светофор" },
    { id: 3, coords: [54.77, 32.03], title: "Камера" },
  ];

  return (
    <YMaps>
      <Map
        defaultState={{
          center,
          zoom,
          controls: ["zoomControl"],
        }}
        width="100%"
        height="600px"
        modules={[
          "control.ZoomControl",
          "control.GeolocationControl",
          "geoObject.addon.balloon",
        ]}
        options={{
          suppressMapOpenBlock: true,
        }}
      >
        {markers.map((m) => (
          <Placemark
            key={m.id}
            geometry={m.coords}
            properties={{ balloonContent: m.title }}
          />
        ))}
      </Map>
    </YMaps>
  );
}
