"use client";
import React, { useEffect, useState } from "react";
import CustomSelect from "@/components/common/CustomSelect"; // ← твой кастомный select

interface CarsProp {
  route: any[];
  filter: {
    isCars: string;
    time: number;
    graf: number;
  };
  onFilterChange: (filters: any) => void;
}

export default function InfoCarts({ route, filter, onFilterChange }: CarsProp) {
  const [matchedCars, setMatchedCars] = useState<{ label: string; value: string }[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [carTime, setCarTime] = useState<string>("");
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [routes, setRoutes] = useState(null)
  const [count, setCount] = useState(null)
  const [selectCar, setSelectCar] = useState(null)
  
  // Приходит массив route (совпавшие маршруты/авто)
  useEffect(() => {
    if (route) {
      setRoutes(route?.data)
      setCount(route?.count)
        
    }
  },[route]);

  useEffect(() =>{
    if (Array.isArray(routes) && Array.isArray(count) && routes.length > 0 && count.length > 0) {
        try{
            setSelectCar(routes[0])
            setMatchedCount(count[0])
        }
        catch{
            console.error("ну и хуйня виталя")
        }

    }
  },[routes, count])
  useEffect(() => {
    try{
    onFilterChange(selectCar)
    }
    catch{
        console.error("ну и хуйня виталя 2")
    }
  }, [selectCar])


    const handleChange = (value: string) => {
    if (!routes || !Array.isArray(routes)) return;

    const index = routes.findIndex((car) => car.name === value);
    if (index !== -1) {
        setSelectCar(routes[index]);
        setMatchedCount(count?.[index] ?? 0);
    }
    };




  return (
    <div className="w-full max-w-[500px] bg-white rounded-[10px] border border-gray-300 shadow-sm p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Информация о совместном движении
      </h1>

      <div className="space-y-6">
        {/* Гос. номер выбранного авто */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="font-medium whitespace-nowrap">
            Гос. номер выбранного авто:
          </p>

          {/* 🔽 Твой кастомный select */}
          <CustomSelect
            placeholder="Гос. Номер"
            options={routes ? [...routes?.map((a) => ({
                    label: a.name, 
                    value: a.name
                  }))
                ] : []}
            defaultt={selectCar !==null ? selectCar.name  : ""}
            onChange={(v) => handleChange(v)}
          />
        </div>

        {/* Время рейса */}
       

        {/* Количество совпавших узлов графа */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-gray-600 font-medium whitespace-nowrap">
            Количество совпавших узлов графа:
          </p>
          <span className="text-gray-800 font-semibold text-6xl">
            {matchedCount}
          </span>
        </div>
      </div>
    </div>
  );
}
