import * as React from "react";
import Image from "next/image";
import { GreenButton } from "@/components/common/GreenButton";

interface HeroSectionProps {
  scrollToInfo: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToInfo }) => {
  return (
    <section
      className="
      w-full
      flex flex-col justify-between
      pb-[2rem] md:pb-[4rem]
      bg-cover bg-center text-white px-[2rem] md:px-[4rem] lg:px-[7.5rem]
      lg:h-screen  
    "
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0) 80%), url('/images/mainBackground.webp')`,
      }}
    >
      <div
        className="
        mt-[8rem]       
        sm:mt-[15rem]    
        md:mt-[17rem]   
        lg:mt-[17.5rem] 
        flex flex-col gap-8 md:gap-12
      "
      >
        <h1 className="text-[2.5rem] leading-[3rem] sm:text-[5rem] sm:leading-[5.5rem] md:text-[6rem] md:leading-[5.5rem] lg:text-[6rem] lg:leading-[5.5rem] xl:text-[8rem] xl:leading-[6.6875rem] font-[700] tracking-[0%] align-middle font-bold">
          Забота о вашей <br />
          безопасности <br />
          на дорогах
        </h1>
        <div className="flex flex-col md:flex-row gap-3.5">
          <GreenButton href="/statistics">Узнать о проектах</GreenButton>
          <GreenButton href="/projects" className="whitespace-normal">
            Статистика по происшествиям на дороге
          </GreenButton>
        </div>
      </div>

      <div
        className="hidden md:flex flex-row items-center justify-center text-center gap-3 md:gap-5 mt-10 mb-2 group cursor-pointer"
        onClick={scrollToInfo}
      >
        <Image
          src="/icons/touchIcon.svg"
          alt="Узнать больше"
          width={60}
          height={60}
          className="group-hover:filter group-hover:brightness-0 group-hover:invert-[39%_65%_27%] transition-all duration-300"
        />
        <span className="font-[400] text-[36px] leading-[47px] tracking-[0%] text-center group-hover:text-[#62a744] transition-colors duration-300">
          Узнать больше
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
