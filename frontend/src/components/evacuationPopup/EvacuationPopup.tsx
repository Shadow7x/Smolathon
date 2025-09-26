"use client";

import { useState } from "react";
import Image from "next/image";
import GreenButton from "../common/GreenButton";

export default function EvacuationPopup({
  triggerClass,
}: {
  triggerClass?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger */}
      <button className={triggerClass} onClick={() => setIsOpen(true)}>
        Услуги
        {triggerClass?.includes("group") && (
          <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#62A744] group-hover:w-full transition-all duration-300 origin-left"></span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* Dialog */}
          <div
            className="relative w-[min(100%,64rem)] h-[min(100%,41rem)] max-w-[64rem] max-h-[41rem] bg-white rounded-lg overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()} // чтобы клик внутри диалога не закрывал
          >
            <button
              className="absolute top-7 right-7 z-10 group w-12 h-12"
              onClick={() => setIsOpen(false)}
            >
              {/* Десктоп */}
              <div className="hidden md:block relative w-full h-full">
                <Image
                  src="/icons/whiteLeftArrowIcon.svg"
                  alt="Закрыть"
                  fill
                  className="absolute top-0 left-0 w-full h-full opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                  priority
                />
                <Image
                  src="/icons/greenLeftArrowIcon.svg"
                  alt="Закрыть"
                  fill
                  className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  priority
                />
              </div>

              {/* Мобильные */}
              <div className="block md:hidden relative w-full h-full">
                <Image
                  src="/icons/blackLeftArrowIcon.svg"
                  alt="Закрыть"
                  fill
                  className="absolute top-0 left-0 w-full h-full opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                  priority
                />
                <Image
                  src="/icons/greenLeftArrowIcon.svg"
                  alt="Закрыть"
                  fill
                  className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  priority
                />
              </div>
            </button>

            {/* Левая колонка — контент */}
            <div className="flex flex-col w-full md:w-1/2 p-11 overflow-y-auto min-w-0 gap-5 ">
              <div className="flex flex-col md:max-w-[23rem] gap-10">
                <h2 className="text-[40px] font-bold leading-[100%] font-nunito mb-6">
                  <span className="text-black">Услуги</span>{" "}
                  <span className="text-[#62A744]">эвакуатора</span>
                </h2>
                <div className="flex flex-col w-full md:h-[12rem] justify-between">
                  <p className="text-[20px] font-normal text-black leading-[140%]">
                    Вы можете заказать услуги эвакуатора в любую точку города
                    Смоленска.
                  </p>
                  <p className="text-[20px] font-normal text-black leading-[140%]">
                    Цена вызова будет зависеть от вашего расположения, размера
                    авто, а также дальности перевозки.
                  </p>
                </div>
              </div>
              <div>
                <GreenButton>Отправить заявку</GreenButton>
              </div>
            </div>

            <div className="hidden md:block w-1/2 relative min-h-[200px] md:min-h-0">
              <Image
                src="/images/towTruck.webp"
                alt="Эвакуатор"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
