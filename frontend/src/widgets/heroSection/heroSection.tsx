import * as React from "react";
import Image from "next/image";

interface HeroSectionProps {
  scrollToInfo: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToInfo }) => {
  return (
    <section
      className="
      w-full
    flex flex-col justify-center
    pb-8 md:pb-16
    bg-cover bg-center text-white
    min-h-screen 
    "
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0) 80%), url('/images/mainBackground.webp')`,
      }}
    >
      <div
        className="
        pl-[1rem] 
        sm:pl-[2rem]
        md:pl-[4rem]
        lg:pl-[6rem]
        xl:pl-[3rem] /* 170px */
        mx-auto
        w-full
        max-w-screen-2xl
      "
      >
        <h1 className="text-[4rem] leading-[3.5rem] sm:text-[5rem] sm:leading-[4.5rem] md:text-[6rem] md:leading-[5.5rem] lg:text-[6rem] lg:leading-[5.5rem] xl:text-[6rem] xl:leading-[5.5rem] font-bold tracking-[0%] align-middle">
          <span className="text-[#82CF61]">Безопасные</span> дороги - <br />
          наша забота
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
