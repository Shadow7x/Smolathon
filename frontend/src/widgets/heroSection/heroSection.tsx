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
      <h1
        className="
          text-6xl leading-snug       /* базовый (мобильный) */
          sm:text-4xl sm:leading-snug /* >640px */
          md:text-5xl md:leading-snug /* >768px */
          lg:text-7xl lg:leading-[5.5rem] /* >1024px */
          xl:text-8xl xl:leading-[6rem]   /* >1280px */
          font-bold tracking-tight
        "
      >
        <span className="text-[#82CF61]">Безопасные</span> дороги - <br />
        наша забота
      </h1>
      </div>
    </section>
  );
};

export default HeroSection;
