"use client";

import { useState } from "react";
import Image from "next/image";
import GreenButton from "../common/GreenButton";
import IconButton from "../common/IconButton";

export default function EvacuationPopup({
  triggerClass,
}: {
  triggerClass?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Состояния формы
  const [fio, setFio] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Здесь можно отправить данные на сервер
    console.log({ fio, phone, address });
    alert("Заявка отправлена!");
    // Очистка формы
    setFio("");
    setPhone("");
    setAddress("");
    setIsOpen(false);
  };

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
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-7 right-7 z-10 group w-12 h-12"
              onClick={() => setIsOpen(false)}
            >
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
            {/* Left Content */}
            <div className="flex flex-col w-full md:w-1/2 p-11 overflow-y-auto min-w-0 gap-5">
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

              <form
                className="flex flex-col gap-4 mt-2"
                onSubmit={handleSubmit}
              >
                <input
                  value={fio}
                  onChange={(e) => setFio(e.target.value)}
                  placeholder="Ваше ФИО"
                  className="w-full h-[44px] border border-gray-200 rounded-[8px] px-4 text-[1.25rem] text-black placeholder:text-[#636363] focus:outline-none focus:ring-2 focus:ring-[#62A744]"
                  type="text"
                  required
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Номер телефона"
                  className="w-full h-[44px] border border-gray-200 rounded-[8px] px-4 text-[1.25rem] text-black placeholder:text-[#636363] focus:outline-none focus:ring-2 focus:ring-[#62A744]"
                  type="tel"
                  required
                />
                <div className="flex items-center gap-2 w-full">
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Адрес"
                    className="flex-1 h-[44px] border border-gray-200 rounded-[8px] px-4 text-[1.25rem] text-black placeholder:text-[#636363] focus:outline-none focus:ring-2 focus:ring-[#62A744]"
                    type="text"
                    required
                  />
                  <IconButton
                    onClick={() => alert("Нажата кнопка навигации")}
                    size={44}
                    className="flex-shrink-0 group bg-[#62A744] hover:bg-white transition duration-300"
                  >
                    <div className="relative w-[1.5rem] h-[1.5rem]">
                      <Image
                        src="/icons/whiteNavigationIcon.svg"
                        alt="Адрес"
                        fill
                        className="object-contain opacity-100 group-hover:opacity-0 transition duration-300"
                      />
                      <Image
                        src="/icons/greenNavigationIcon.svg"
                        alt="Адрес"
                        fill
                        className="object-contain opacity-0 group-hover:opacity-100 transition duration-300"
                      />
                    </div>
                  </IconButton>
                </div>

                <div className="pt-2 flex flex-row justify-between items-end">
                  <div className="flex flex-col gap-2 self-end">
                    <p className="font-nunito font-normal text-[16px] leading-[100%] text-[#636363]">
                      Стоимость:
                    </p>
                    <p className="font-nunito font-bold text-[24px] leading-[100%] text-black">
                      От 5000₽
                    </p>
                  </div>
                  <div className="flex items-end">
                    <GreenButton type="submit">Отправить заявку</GreenButton>
                  </div>
                </div>
              </form>
            </div>
            \
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
