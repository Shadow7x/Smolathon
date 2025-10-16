"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

interface Point {
  latitude: number;
  longitude: number;
  name?: string;
}

interface Route {
  points: Point[];
  color?: string;
  name?: string;
}

interface YandexMapRouteProps {
  routes: Route[];
  routeType?: "auto" | "masstransit" | "pedestrian" | "bicycle";
  className?: string;
}

function YandexMapRoute({
  routes,
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
    if (!mapLoaded || !mapRef.current || routes.length === 0) return;

    const initMap = async () => {
      try {
        mapInstance.current = new window.ymaps.Map(mapRef.current, {
          center: [55.7558, 37.6173],
          zoom: 10,
          controls: [],
        });

        multiRoutes.current = [];
        mapInstance.current.geoObjects.removeAll();

        routes.forEach((route, index) => {
          const routeColor = route.color || getColorByIndex(index);

          const referencePoints = route.points.map((point) => [
            point.latitude,
            point.longitude,
          ]);

          const multiRoute = new window.ymaps.multiRouter.MultiRoute(
            {
              referencePoints,
              params: {
                routingMode: routeType,
              },
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
              routeActivePedestrianNoise: false,
              routeOpenBalloonOnClick: false,
              routePanel: false,
              viaPointVisible: false,
              routeEditorDrawOver: false,
              routeEditorMidPointsType: "none",
            }
          );

          multiRoutes.current.push(multiRoute);
          mapInstance.current.geoObjects.add(multiRoute);

          if (route.points.length > 0) {
            const startPoint = route.points[0];
            const endPoint = route.points[route.points.length - 1];

            const startPlacemark = new window.ymaps.Placemark(
              [startPoint.latitude, startPoint.longitude],
              {},
              {
                preset: "islands#circleIcon",
                iconColor: routeColor,
              }
            );

            const endPlacemark = new window.ymaps.Placemark(
              [endPoint.latitude, endPoint.longitude],
              {},
              {
                preset: "islands#circleIcon",
                iconColor: routeColor,
              }
            );

            mapInstance.current.geoObjects.add(startPlacemark);
            mapInstance.current.geoObjects.add(endPlacemark);

            if (route.points.length > 2) {
              for (let i = 1; i < route.points.length - 1; i++) {
                const intermediatePoint = route.points[i];
                const intermediatePlacemark = new window.ymaps.Placemark(
                  [intermediatePoint.latitude, intermediatePoint.longitude],
                  {},
                  {
                    preset: "islands#circleDotIcon",
                    iconColor: routeColor,
                  }
                );
                mapInstance.current.geoObjects.add(intermediatePlacemark);
              }
            }
          }
        });

        if (routes.length > 0) {
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
  }, [mapLoaded, routes, routeType]);

  // Функция для получения цвета по индексу
  const getColorByIndex = (index: number): string => {
    const colors = [
      "#1e98ff", // синий
      "#ff4444", // красный
      "#00c851", // зеленый
      "#ffbb33", // оранжевый
      "#aa66cc", // фиолетовый
      "#33b5e5", // голубой
      "#ff6b6b", // розовый
      "#4db6ac", // бирюзовый
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={className}>
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}

const MapPage = () => {
  // Маршруты с несколькими точками в пределах Москвы
  const routes = [
    {
      name: "Маршрут по центру Москвы",
      points: [
        {
          latitude: 55.7517,
          longitude: 37.6178,
          name: "Московский Кремль",
        },
        {
          latitude: 55.7525,
          longitude: 37.623,
          name: "Храм Василия Блаженного",
        },
        {
          latitude: 55.7539,
          longitude: 37.6208,
          name: "Красная площадь",
        },
        {
          latitude: 55.7514,
          longitude: 37.6289,
          name: "Парк Зарядье",
        },
      ],
      color: "#1e98ff",
    },
    {
      name: "Маршрут через парки",
      points: [
        {
          latitude: 55.7312,
          longitude: 37.6033,
          name: "Парк Горького",
        },
        {
          latitude: 55.7356,
          longitude: 37.5837,
          name: "Нескучный сад",
        },
        {
          latitude: 55.71,
          longitude: 37.5445,
          name: "Воробьевы горы",
        },
        {
          latitude: 55.7225,
          longitude: 37.5543,
          name: "МГУ",
        },
      ],
      color: "#ff4444",
    },
    {
      name: "Маршрут по северу Москвы",
      points: [
        {
          latitude: 55.8229,
          longitude: 37.6366,
          name: "ВДНХ",
        },
        {
          latitude: 55.8294,
          longitude: 37.6322,
          name: "Космонавтов аллея",
        },
        {
          latitude: 55.8198,
          longitude: 37.6117,
          name: "Останкинская башня",
        },
        {
          latitude: 55.8079,
          longitude: 37.6381,
          name: "Ботанический сад",
        },
      ],
      color: "#00c851",
    },
  ];

  return (
    <div className="pt-[5rem]">
      <YandexMapRoute routes={routes} routeType="auto" className="h-[600px]" />
    </div>
  );
};

export default MapPage;
