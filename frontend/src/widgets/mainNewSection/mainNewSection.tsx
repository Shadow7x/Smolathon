"use client";

import TransparentButton from "@/components/common/TransparentButton";
import Image from "next/image";

const MainNewSection = () => {
  return (
    <section
      className="w-full flex flex-col md:flex-row justify-between pb-8 md:pb-16 bg-cover bg-center text-white px-[clamp(2rem,5vw,10rem)] lg:h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('/images/newsBackground.webp')`,
      }}
    >
      {/* Левый блок */}
      <div className="flex-1 flex flex-col gap-8 md:gap-12 mt-[6rem] sm:mt-[10rem] md:mt-[14rem] lg:mt-[20rem]">
        <div className="flex flex-col gap-6 sm:gap-8">
          <p className="font-sans font-normal text-[clamp(1rem,2vw,1.5rem)] leading-[1.2] tracking-[0]">
            Сентябрь 29 - 2025
          </p>
          <h2 className="font-sans font-bold text-[clamp(1.5rem,4vw,3rem)] leading-[1.1] tracking-[0]">
            Новая дорога будет достроена к концу этого года
          </h2>
          <TransparentButton onClick={() => alert("Нажата!")}>
            Подробнее
          </TransparentButton>
        </div>
      </div>

      {/* Правый блок */}
      <div className="flex flex-col justify-end items-start md:items-end mt-[4rem] sm:mt-[6rem] md:mt-0 opacity-90 w-fit max-w-full md:max-w-[50%] sm:whitespace-nowrap md:whitespace-normal gap-4">
        <h2 className="font-sans font-bold text-[clamp(1.5rem,4vw,3rem)] leading-[1.1] tracking-[0]">
          Власти выделили для этого...
        </h2>

        <button className="bg-[#62A744] w-[3.75rem] h-[3.75rem] rounded-[0.5rem] flex items-center justify-center">
          <Image
            src="/icons/leftArrowIcon.svg"
            alt="Arrow"
            width={52}
            height={52}
            priority
          />
        </button>
      </div>
    </section>
  );
};

export default MainNewSection;
