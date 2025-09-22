const HeroSection = () => {
  return (
    <section
      className="w-full h-screen bg-cover bg-center flex text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0) 80%), url('/images/mainBackground.webp')`,
      }}
    >
      <h1
        className="
    mt-[8rem]       /* мобайл */
    sm:mt-[8rem]    /* ≥640px */
    md:mt-[12rem]   /* ≥768px */
    lg:mt-[17.5rem] /* ≥1024px */
    text-[2.5rem] leading-[3rem] 
    sm:text-[5rem] sm:leading-[5.5rem] 
    md:text-[6rem] md:leading-[5.5rem] 
    lg:text-[8rem] lg:leading-[6.6875rem] 
    font-[700] tracking-[0%] align-middle font-bold
  "
      >
        Забота о вашей <br />
        безопасности <br />
        на дорогах
      </h1>
    </section>
  );
};

export default HeroSection;
