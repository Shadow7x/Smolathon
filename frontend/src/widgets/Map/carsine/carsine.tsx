"use client";
import React, { useState, useEffect } from "react";
import Switchmap from "@/widgets/Map/swithmap/swithmap";
import { Search } from "lucide-react";
import CustomSelect from "@/components/common/CustomSelect";
import CustomInput from "@/components/common/CustomInput";
import axi from "@/utils/api";
import { Range, getTrackBackground } from "react-range";
import { cn } from "@/lib/utils";
import DoubleHourSlider from "@/components/common/DoubleHourSlider";
import { Checkbox } from "@radix-ui/react-checkbox";
import InsoCarts from "../infocarts/InsoCarts";

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
  const [cars, setCars] = useState([]);
  const [selectCar, setSelectCar] = useState(null)
  const [isComparison, setIsComparison] = useState(false);

  const [firstInterval, setFirstInterval] = useState<[number, number]>([0, 24]);
  const [secondInterval, setSecondInterval] = useState<[number, number]>([
    0, 24,
  ]);

  useEffect(() => {
    axi.get("/analytics/workload/getCars").then((e) => {
      setCars(e.data);
    });
  }, []);

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

// если найден ровно один результат и он полностью совпадает с поисковым запросом — ничего не делаем
if (
  filtered.length === 1 &&
  (filtered[0].name?.toLowerCase() === query.toLowerCase() ||
    filtered[0].car?.toLowerCase() === query.toLowerCase())
) {
  return;
}


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
        <div className="flex flex-wrap mt-4 gap-8 md:gap-14">
          {/* Первый слайдер */}
          <div className="flex flex-col gap-3 min-w-[18rem]">
            <p>Выберите временной интервал</p>
            <div className="flex flex-row w-[38rem] max-w-full h-[2rem]">
              <DoubleHourSlider
                selectedHours={firstInterval}
                onChangeHours={(hours) => {
                  setFirstInterval(hours);
                  onFilterChange({ ...filters, interval: hours });
                }}
              />
            </div>
          </div>

          {/* Блок сравнения */}
          <div className="flex flex-col gap-3 min-w-[18rem]">
            <div className="flex flex-row gap-2 items-center">
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isComparison}
                  onChange={(e) => {
                    setIsComparison(e.target.checked);
                    if (e.target.checked) {
                      // включаем второй сегмент, записываем фильтр
                      onFilterChange({ ...filters, interval2: secondInterval });
                    } else {
                      // отключаем второй сегмент, удаляем фильтр
                      const newFilters = { ...filters };
                      delete newFilters.interval2;
                      onFilterChange(newFilters);
                    }
                  }}
                  className="peer appearance-none rounded-[3px] border-2 border-black w-[1.25rem] h-[1.25rem] cursor-pointer"
                />

                <svg
                  className="absolute w-[1.25rem] h-[1.25rem] opacity-0 peer-checked:opacity-100 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </label>

              <p>Добавить сравнение</p>
            </div>

            <div
              className={cn(
                "flex flex-row w-[38rem] max-w-full h-[2rem]",
                !isComparison && "opacity-50 pointer-events-none"
              )}
            >
              <DoubleHourSlider
                selectedHours={secondInterval}
                onChangeHours={(hours) => {
                  setSecondInterval(hours);

                  if (isComparison) {
                    onFilterChange({ ...filters, interval2: hours });
                  }
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          <div className="relative flex flex-col w-60">
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
          <div className="flex flex-col gap-2 ml-4">
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
                    { label: "50 минут", value: "50" },
                    { label: "1 час", value: "60" },
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

          <InsoCarts isCars={"A414PF"} time={58} graf={23} />
        </div>
      )}
    </div>
  );
}
