const HeroSection = () => {
  return (
    <section
      className="w-full h-screen bg-cover bg-center flex text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0) 80%), url('/images/mainBackground.webp')`,
      }}
    >
      <h1 className="mt-[1.875rem] font-[700] text-[8rem] leading-[6.6875rem] tracking-[0%] align-middle font-bold">
        Забота о вашей <br />
        безопасности <br />
        на дорогах
      </h1>
    </section>
  );
};

export default HeroSection;
