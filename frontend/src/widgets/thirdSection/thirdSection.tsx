import React, { forwardRef } from "react";

interface ActivityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  width: "60%" | "50%" | "40%";
}

const ActivityCard = ({
  title,
  description,
  icon,
  width,
}: ActivityCardProps) => {
  const widthClass = {
    "60%": "lg:w-[60%]",
    "50%": "lg:w-[50%]", 
    "40%": "lg:w-[40%]"
  }[width];

  return (
    <div
      className={`text-black flex flex-col justify-between px-4 sm:px-5 py-6 sm:py-8 lg:py-10 border-1 border-[#e9e9e9] rounded-2xl w-full ${widthClass} min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] h-auto lg:h-[400px] transition-all duration-300 hover:shadow-lg`}
    >
      <span className="text-start font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[48px] leading-tight">
        {title}
      </span>
      <div className="w-full text-[#636363] flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 lg:gap-6 xl:gap-16 mt-4 lg:mt-6">
        <span className="text-base sm:text-lg md:text-xl lg:text-[20px] xl:text-[24px] leading-tight flex-1">
          {description}
        </span>
        <div className="p-2 sm:p-3 lg:p-4 flex-shrink-0 self-end lg:self-auto mt-auto lg:mt-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-[120px] xl:h-[120px] transition-transform duration-300 hover:scale-105">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityRow = ({ cards }: { cards: ActivityCardProps[] }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full">
      {cards.map((card, index) => (
        <ActivityCard
          key={index}
          title={card.title}
          description={card.description}
          icon={card.icon}
          width={card.width}
        />
      ))}
    </div>
  );
};

const ThirdSection = forwardRef<HTMLDivElement>((props, ref) => {
  const securityIcon = (
    <svg viewBox="0 0 120 150" fill="none">
      <path
        d="M60 150C42.625 145.625 28.2812 135.656 16.9688 120.094C5.65625 104.531 0 87.25 0 68.25V22.5L60 0L120 22.5V68.25C120 87.25 114.344 104.531 103.031 120.094C91.7188 135.656 77.375 145.625 60 150ZM60 134.25C73 130.125 83.75 121.875 92.25 109.5C100.75 97.125 105 83.375 105 68.25V32.8125L60 15.9375L15 32.8125V68.25C15 83.375 19.25 97.125 27.75 109.5C36.25 121.875 47 130.125 60 134.25Z"
        fill="#62A744"
      />
    </svg>
  );

  const infrastructureIcon = (
    <svg viewBox="0 0 120 136" fill="none">
      <path
        d="M60 113C63.25 113 65.9375 111.938 68.0625 109.812C70.1875 107.688 71.25 105 71.25 101.75C71.25 98.5 70.1875 95.8125 68.0625 93.6875C65.9375 91.5625 63.25 90.5 60 90.5C56.75 90.5 54.0625 91.5625 51.9375 93.6875C49.8125 95.8125 48.75 98.5 48.75 101.75C48.75 105 49.8125 107.688 51.9375 109.812C54.0625 111.938 56.75 113 60 113ZM60 79.25C63.25 79.25 65.9375 78.1875 68.0625 76.0625C70.1875 73.9375 71.25 71.25 71.25 68C71.25 64.75 70.1875 62.0625 68.0625 59.9375C65.9375 57.8125 63.25 56.75 60 56.75C56.75 56.75 54.0625 57.8125 51.9375 59.9375C49.8125 62.0625 48.75 64.75 48.75 68C48.75 71.25 49.8125 73.9375 51.9375 76.0625C54.0625 78.1875 56.75 79.25 60 79.25ZM60 45.5C63.25 45.5 65.9375 44.4375 68.0625 42.3125C70.1875 40.1875 71.25 37.5 71.25 34.25C71.25 31 70.1875 28.3125 68.0625 26.1875C65.9375 24.0625 63.25 23 60 23C56.75 23 54.0625 24.0625 51.9375 26.1875C49.8125 28.3125 48.75 31 48.75 34.25C48.75 37.5 49.8125 40.1875 51.9375 42.3125C54.0625 44.4375 56.75 45.5 60 45.5ZM22.5 90.5V81.875C16.125 80.125 10.7812 76.625 6.46875 71.375C2.15625 66.125 0 60 0 53H22.5V44.375C16.125 42.625 10.7812 39.125 6.46875 33.875C2.15625 28.625 0 22.5 0 15.5H22.5C22.5 11.375 23.9688 7.84375 26.9062 4.90625C29.8438 1.96875 33.375 0.5 37.5 0.5H82.5C86.625 0.5 90.1562 1.96875 93.0938 4.90625C96.0312 7.84375 97.5 11.375 97.5 15.5H120C120 22.5 117.844 28.625 113.531 33.875C109.219 39.125 103.875 42.625 97.5 44.375V53H120C120 60 117.844 66.125 113.531 71.375C109.219 76.625 103.875 80.125 97.5 81.875V90.5H120C120 97.5 117.844 103.625 113.531 108.875C109.219 114.125 103.875 117.625 97.5 119.375V120.5C97.5 124.625 96.0312 128.156 93.0938 131.094C90.1562 134.031 86.625 135.5 82.5 135.5H37.5C33.375 135.5 29.8438 134.031 26.9062 131.094C23.9688 128.156 22.5 124.625 22.5 120.5V119.375C16.125 117.625 10.7812 114.125 6.46875 108.875C2.15625 103.625 0 97.5 0 90.5H22.5ZM37.5 120.5H82.5V15.5H37.5V120.5Z"
        fill="#62A744"
      />
    </svg>
  );

  const intelectualIcon = (
    <svg viewBox="0 0 134 120" fill="none">
      <path
        d="M37.5625 120C36.1875 120 34.9062 119.656 33.7188 118.969C32.5312 118.281 31.625 117.312 31 116.062L16.375 90H27.25L34.75 105H52V97.5H39.25L31.75 82.5H12.25L1.5625 63.75C1.3125 63.125 1.09375 62.5 0.90625 61.875C0.71875 61.25 0.625 60.625 0.625 60C0.625 59.5 0.9375 58.25 1.5625 56.25L12.25 37.5H31.75L39.25 22.5H52V15H34.75L27.25 30H16.375L31 3.9375C31.625 2.6875 32.5312 1.71875 33.7188 1.03125C34.9062 0.34375 36.1875 0 37.5625 0H55.75C57.875 0 59.6562 0.71875 61.0938 2.15625C62.5312 3.59375 63.25 5.375 63.25 7.5V37.5H52L44.5 45H63.25V67.5H46.75L39.25 52.5H22L14.5 60H34.75L42.25 75H63.25V112.5C63.25 114.625 62.5312 116.406 61.0938 117.844C59.6562 119.281 57.875 120 55.75 120H37.5625ZM78.25 120C76.125 120 74.3438 119.281 72.9062 117.844C71.4688 116.406 70.75 114.625 70.75 112.5V75H91.75L99.25 60H119.5L112 52.5H94.75L87.25 67.5H70.75V45H89.5L82 37.5H70.75V7.5C70.75 5.375 71.4688 3.59375 72.9062 2.15625C74.3438 0.71875 76.125 0 78.25 0H96.4375C97.8125 0 99.0938 0.34375 100.281 1.03125C101.469 1.71875 102.375 2.6875 103 3.9375L117.625 30H106.75L99.25 15H82V22.5H94.75L102.25 37.5H121.75L132.438 56.25C132.688 56.875 132.906 57.5 133.094 58.125C133.281 58.75 133.375 59.375 133.375 60C133.375 60.5 133.062 61.75 132.438 63.75L121.75 82.5H102.25L94.75 97.5H82V105H99.25L106.75 90H117.625L103 116.062C102.375 117.312 101.469 118.281 100.281 118.969C99.0938 119.656 97.8125 120 96.4375 120H78.25Z"
        fill="#62A744"
      />
    </svg>
  );

  const optimizationIcon = (
    <svg viewBox="0 0 120 150" fill="none">
      <path
        d="M49.125 121.5L87.9375 75H57.9375L63.375 32.4375L28.6875 82.5H54.75L49.125 121.5ZM30 150L37.5 97.5H0L67.5 0H82.5L75 60H120L45 150H30Z"
        fill="#62A744"
      />
    </svg>
  );

  const activityRows: ActivityCardProps[][] = [
    [
      {
        title: "Безопасность дорожного движения",
        description: "Внедрение и обслуживание комплексов автоматической фотовидеофиксации нарушений ПДД",
        icon: securityIcon,
        width: "60%",
      },
      {
        title: "Инфраструктура",
        description: "Установка и содержание дорожных знаков, нанесение разметки, строительство и модернизация светофорных объектов",
        icon: infrastructureIcon,
        width: "40%",
      },
    ],
    [
      {
        title: "Интеллектуальные транспортные системы",
        description: "Развитие автоматизированных систем управления дорожным движением для адаптивного управления светофорами",
        icon: intelectualIcon,
        width: "50%",
      },
      {
        title: "Оптимизация движения",
        description: "Проектирование схем организации движения, мониторинг трафика и моделирование для повышения пропускной способности дорог",
        icon: optimizationIcon,
        width: "50%",
      },
    ],
  ];

  return (
    <div ref={ref} className="w-full">
      <div className="flex flex-col justify-center items-center gap-6 sm:gap-8 lg:gap-16 py-6 sm:py-8 lg:py-[100px] px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[200px] rounded-t-[1rem] sm:rounded-t-[2rem] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] sm:shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <div className="text-[#62A744] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[64px] text-center">
          Чем <span className="text-black">мы занимаемся?</span>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          {activityRows.map((row, index) => (
            <ActivityRow key={index} cards={row} />
          ))}
        </div>
      </div>
    </div>
  );
});

ThirdSection.displayName = "ThirdSection";

export default ThirdSection;