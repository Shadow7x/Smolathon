"use client";

import { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";

interface DoubleHourSliderProps {
  selectedHours?: [number, number];
  onChangeHours: (hours: [number, number]) => void;
}

export default function DoubleHourSlider({
  selectedHours,
  onChangeHours,
}: DoubleHourSliderProps) {
  const MIN = 0;
  const MAX = 24;
  const STEP = 2;

  const [values, setValues] = useState<[number, number]>(
    selectedHours || [8, 18]
  );

  useEffect(() => {
    if (selectedHours) setValues(selectedHours);
  }, [selectedHours]);

  const handleChange = (vals: number[]) => {
    const newValues: [number, number] = [vals[0], vals[1]];
    setValues(newValues);
    onChangeHours(newValues);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center w-full gap-4 sm:gap-7">
      {/* Слайдер */}
      <div className="hidden sm:flex flex-col flex-1 rounded-3xl border border-input items-center justify-center bg-white h-10 px-4 sm:px-6">
        <Range
          values={values}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={handleChange}
          renderTrack={({ props, children }) => {
            const { key, ...rest } = props;
            return (
              <div
                key={key}
                {...rest}
                className="relative w-full h-[3px] rounded cursor-pointer"
                style={{
                  background: getTrackBackground({
                    values,
                    colors: ["#C3C3C3", "#636363", "#C3C3C3"],
                    min: MIN,
                    max: MAX,
                  }),
                }}
              >
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => {
            const { key, ...rest } = props;
            return (
              <div
                key={key}
                {...rest}
                className="w-4 h-4 rounded-full bg-[#636363] cursor-pointer flex items-center justify-center"
              />
            );
          }}
        />
      </div>

      {/* Поля ввода */}
      <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
        <p className="text-sm sm:text-base">От</p>
        <input
          type="text"
          value={values[0]}
          onChange={(e) => {
            let strVal = e.target.value;
            strVal = strVal.replace(/^0+/, "");
            if (strVal === "") strVal = "0";
            const numVal = Number(strVal);
            const val = Math.min(
              Math.max(isNaN(numVal) ? MIN : numVal, MIN),
              values[1] - STEP
            );
            const newRange: [number, number] = [val, values[1]];
            setValues(newRange);
            onChangeHours(newRange);
          }}
          className="w-12 sm:w-14 h-10 flex items-center justify-center bg-white border border-input rounded-[10px] text-center font-nunito font-bold text-[14px] sm:text-[16px] focus:outline-none"
        />

        <p className="text-sm sm:text-base">до</p>
        <input
          type="number"
          min={values[0] + STEP}
          max={MAX}
          step={STEP}
          value={values[1]}
          onChange={(e) => {
            const inputVal = Number(e.target.value);
            const val = Math.max(
              Math.min(isNaN(inputVal) ? MAX : inputVal, MAX),
              values[0] + STEP
            );
            const newRange: [number, number] = [values[0], val];
            setValues(newRange);
            onChangeHours(newRange);
          }}
          className="w-12 sm:w-14 h-10 flex items-center justify-center bg-white border border-input rounded-[10px] text-center font-nunito font-bold text-[14px] sm:text-[16px] focus:outline-none"
        />

        <p className="text-sm sm:text-base">часов</p>
      </div>
    </div>
  );
}
