"use client";
import React from "react";
import Switchmap from "@/widgets/Map/swithmap/swithmap";

import { Search } from "lucide-react";
import CustomSelect from "@/components/common/CustomSelect";
import CustomInput from "@/components/common/CustomInput";

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
  const handleChange = (field: string, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl mb-2 font-semibold">
          {isAccompaniment ? "Загруженность" : "Смежность"}
        </h1>

        <Switchmap
          isAccompaniment={isAccompaniment}
          setIsAccompaniment={setIsAccompaniment}
        />
      </div>
      {!isAccompaniment && (
        <>
          <div className="relative w-60 mt-4">
            <CustomInput
              type="text"
              placeholder="Выберите гос. номер ТС"
              className="pr-11 pl-5 shadow-md"
              icon={
                <Search className="absolute right-5 text-gray-600 w-4 h-4" />
              }
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <p className="mb-2 font-semibold">Фильтрация</p>
            <div className="flex flex-row gap-4">
              <div className="relative w-40">
                <CustomSelect
                  placeholder="Длительность"
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
                  options={[
                    { label: "с 0 до 2", value: "0-2" },
                    { label: "с 2 до 4", value: "2-4" },
                    { label: "с 4 до 6", value: "4-6" },
                    { label: "с 6 до 8", value: "6-8" },
                    { label: "с 8 до 10", value: "8-10" },
                    { label: "с 10 до 12", value: "10-12" },
                    { label: "с 12 до 14", value: "12-14" },
                    { label: "с 14 до 16", value: "14-16" },
                    { label: "с 16 до 18", value: "16-18" },
                    { label: "с 18 до 20", value: "18-20" },
                    { label: "с 20 до 22", value: "20-22" },
                    { label: "с 22 до 24", value: "22-24" },
                  ]}
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
