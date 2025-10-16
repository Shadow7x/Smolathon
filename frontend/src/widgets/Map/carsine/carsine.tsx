"use client";
import React, { useState, useEffect } from "react";
import Switchmap from "@/widgets/Map/swithmap/swithmap";
import { Search } from "lucide-react";
import CustomSelect from "@/components/common/CustomSelect";
import CustomInput from "@/components/common/CustomInput";
import axi from "@/utils/api";

interface CarsineProps {
  isAccompaniment: boolean;
  setIsAccompaniment: (value: boolean) => void;
  routes: any[]; // список машин или маршрутов
  filters: {
    car?: string;
    duration?: string;
    nodes?: string;
    period?: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function Carsine({
  isAccompaniment,
  setIsAccompaniment,
  routes,
  filters,
  onFilterChange,
}: CarsineProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showList, setShowList] = useState(false);
  const [cars, setCars] = useState([])
  const [selectCar, setSelectCar] = useState(null)
  useEffect(() =>{
    axi.get("/analytics/workload/getCars").then((e)=>{
        setCars(e.data);
    })

  },[])

  // фильтрация подсказок из routes
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowList(false);
      return;
    }
    console.log(cars);
    const filtered = cars.filter((r) => {
      const name = (r.name || r.car || "").toLowerCase();
      return name.includes(query.toLowerCase());
    });

    setSuggestions(filtered.slice(0, 6)); // максимум 6 подсказок
    setShowList(filtered.length > 0);
  }, [query, routes]);

  const handleSelect = (name: string) => {
    const selectedCar = cars.find(
      (r) => r.name.toLowerCase() === name.toLowerCase()
    );
    if (selectedCar) {
      setSelectCar(selectedCar);
      console.log(selectedCar);
    } else {
      setSelectCar(null);
    }
    setQuery(name);
    setShowList(false);
    onFilterChange({ ...filters, car: name });
  };

  const handleInputChange = (value: string) => {
    console.log(value);
    setQuery(value);
    onFilterChange({ ...filters, car: value });
  };

  const handleChange = (field: string, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="mb-6 relative">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl mb-2 font-semibold">
          {isAccompaniment ? "Загруженность" : "Смежность"}
        </h1>

        <Switchmap
          isAccompaniment={isAccompaniment}
          setIsAccompaniment={setIsAccompaniment}
        />
      </div>
      {isAccompaniment ? (
        <div className="flex flex-row mt-4">
          <div className="flex flex-col gap-3">
            <p>Выберите временной интервал</p>
            <div className="flex flex-row w-[506px] h-[32px] bg-red-700"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-60 mt-4">
            <CustomInput
              type="text"
              placeholder="Выберите гос. номер ТС"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              className="pr-11 pl-5 shadow-md"
              icon={
                <Search className="absolute right-5 text-gray-600 w-4 h-4" />
              }
            />

            {/* Выпадающие подсказки */}
            {showList && (
              <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(item.name || item.car)}
                    className="px-4 py-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-100"
                  >
                    {item.name || item.car}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Блок фильтров */}
          <div className="flex flex-col gap-2 mt-4">
            <p className="mb-2 font-semibold">Фильтрация</p>
            <div className="flex flex-row gap-4">
              {/* Длительность */}
              <div className="relative w-40">
                <CustomSelect
                  placeholder="Длительность"
                  defaultt={selectCar !==null ? "10" : "10"}
                  options={[
                    { label: "10 минут", value: "10" },
                    { label: "20 минут", value: "20" },
                    { label: "30 минут", value: "30" },
                    { label: "40 минут", value: "40" },

                  ]}
                  onChange={(v) => handleChange("duration", v)}
                />
              </div>

              {/* Кол-во узлов */}
              <div className="relative w-38">
                <CustomSelect
                  placeholder="Кол-во узлов"
                  defaultt={selectCar !==null ? "1" : "1"}
                  options={[
                    { label: "1", value: "1" },
                    { label: "3", value: "3" },
                    { label: "5", value: "5" },
                  ]}
                  onChange={(v) => handleChange("nodes", v)}
                />
              </div>

              {/* Период */}
              <div className="relative w-30">
                <CustomSelect
                  placeholder="Период"
                  
                  options={selectCar !==null ?[
                  ...selectCar?.workloads.map((a) => ({
                    label: a.time_interval, 
                    value: a.time_interval
                  })),
                ] : []}
                  defaultt={selectCar !==null ? selectCar?.workloads[0]?.time_interval : ""}
                  onChange={(v) => handleChange("period", v)}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
