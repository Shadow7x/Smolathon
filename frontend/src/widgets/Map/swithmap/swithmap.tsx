"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function StatusSwitch() {
  const [isAccompaniment, setIsAccompaniment] = useState(true);

  return (
    <div className="flex items-center border rounded-lg overflow-hidden w-max">
      {/* Сопровождение */}
      <button
        className={`px-4 py-2 transition-colors duration-200 ${
          isAccompaniment ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
        }`}
        onClick={() => setIsAccompaniment(true)}
      >
        Сопровождение
      </button>

      {/* Загруженность */}
      <button
        className={`px-4 py-2 transition-colors duration-200 ${
          !isAccompaniment ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
        }`}
        onClick={() => setIsAccompaniment(false)}
      >
        Загруженность
      </button>
    </div>
  );
}
