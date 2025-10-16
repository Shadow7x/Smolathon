"use client";

import { cn } from "@/lib/utils";

interface SwitchmapProps {
  isAccompaniment: boolean;
  setIsAccompaniment: (value: boolean) => void;
}

const Switchmap = ({ isAccompaniment, setIsAccompaniment }: SwitchmapProps) => {
  return (
    <div
      className={cn(
        "relative flex items-center rounded-[1rem] overflow-hidden bg-gray-100",
        "w-[16.25rem] h-[2.375rem]"
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-1/2 bg-black rounded-[1rem] transition-transform duration-300",
          isAccompaniment ? "translate-x-0" : "translate-x-full"
        )}
      />

      <button
        className={cn(
          "relative z-10 w-1/2 h-full text-sm font-medium transition-colors duration-200",
          isAccompaniment ? "text-white" : "text-gray-600"
        )}
        onClick={() => setIsAccompaniment(true)}
      >
        Загруженность
      </button>

      <button
        className={cn(
          "relative z-10 w-1/2 h-full text-sm font-medium transition-colors duration-200",
          !isAccompaniment ? "text-white" : "text-gray-600"
        )}
        onClick={() => setIsAccompaniment(false)}
      >
        Смежность
      </button>
    </div>
  );
};

export default Switchmap;
