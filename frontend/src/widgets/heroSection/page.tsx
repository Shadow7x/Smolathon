const HeroSection = () => {
  return (
    <section
      className="w-full h-screen bg-cover bg-center flex text-white px-[2rem] md:px-[7.5rem]"
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
          text-[2.25rem] leading-[2rem]   /* уменьшено на 1rem */
          sm:text-[4rem] sm:leading-[4.5rem]  /* уменьшено на 1rem */
          md:text-[5rem] md:leading-[4.5rem]  /* уменьшено на 1rem */
          lg:text-[7rem] lg:leading-[5.6875rem] /* уменьшено на 1rem */
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
