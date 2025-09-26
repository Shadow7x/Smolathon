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

  const [fio, setFio] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // тут можно сделать запрос к API
    console.log({ fio, phone, address });
    setIsOpen(false);
  };

  return (
    <>
      <button className={triggerClass} onClick={() => setIsOpen(true)}>
        Услуги
        {triggerClass?.includes("group") && (
          <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#62A744] group-hover:w-full transition-all duration-300 origin-left"></span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-[min(100%,64rem)] h-[min(100%,41rem)] max-w-[64rem] max-h-[41rem] bg-white rounded-lg overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="flex flex-col w-full md:w-1/2 p-8 overflow-y-auto min-w-0 gap-6">
              <div className="flex flex-col md:max-w-[23rem] gap-4">
                <h2 className="text-[32px] md:text-[40px] font-bold leading-[100%] font-nunito mb-2">
                  <span className="text-black">Услуги</span>{" "}
                  <span className="text-[#62A744]">эвакуатора</span>
                </h2>
                <p className="text-[16px] md:text-[20px] font-normal text-black leading-[140%]">
                  Вы можете заказать услуги эвакуатора в любую точку города
                  Смоленска.
                </p>
                <p className="text-[16px] md:text-[20px] font-normal text-black leading-[140%]">
                  Цена вызова будет зависеть от вашего расположения, размера
                  авто, а также дальности перевозки.
                </p>
              </div>

              <form
                className="flex flex-col gap-4 mt-2"
                onSubmit={handleSubmit}
              >
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium">ФИО</span>
                  <input
                    value={fio}
                    onChange={(e) => setFio(e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#62A744]"
                    type="text"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Номер телефона</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#62A744]"
                    type="tel"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Адрес</span>

                  <div className="flex items-center gap-2">
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Улица, дом, подъезд, этаж"
                      className="flex-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#62A744] min-w-0"
                      type="text"
                      required
                    />

                    <IconButton
                      onClick={() => {
                        alert("Нажата кнопка навигации");
                      }}
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
                </label>

                <div className="pt-2">
                  <GreenButton type="submit">Отправить заявку</GreenButton>
                </div>
              </form>
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
