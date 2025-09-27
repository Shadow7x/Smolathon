import NewCard from "@/components/newCard/newCard";

const WeekNewsSection = ({ news }) => {
  const firstTwo = news.slice(0, 2);
  const largeOne = news[2];
  const lastTwo = news.slice(3, 5);

  return (
    <section className="flex flex-col justify-between items-center pb-8 md:pb-[11rem] pt-3 md:pt-[4rem] bg-white text-black px-[clamp(1rem,5vw,10rem)]">
      <div className="w-full flex flex-col gap-[2rem] md:gap-[4rem]">
        <h2 className="font-bold text-[clamp(24px,5vw,40px)] leading-tight">
          Новости этой недели
        </h2>

        {/* Сетка новостей */}
        <div
          className="
    grid
    grid-cols-1
    sm:grid-cols-1
    lg:grid-cols-[1fr_minmax(18rem,2fr)_1fr]
    gap-4
  "
        >
          {/* Первые 2 маленькие */}
          <div className="flex flex-row lg:flex-col gap-4 justify-center">
            {firstTwo.map((item, index) => (
              <NewCard key={index} news={item} size="small" />
            ))}
          </div>

          {/* Большая карточка */}
          {largeOne && (
            <div className="sm:col-span-2 lg:col-span-1 flex justify-center">
              <NewCard news={largeOne} size="large" />
            </div>
          )}

          {/* Последние 2 маленькие */}
          <div className="flex flex-row lg:flex-col gap-4 justify-center">
            {lastTwo.map((item, index) => (
              <NewCard key={index} news={item} size="small" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeekNewsSection;
