import React, { forwardRef } from "react";
import InfoCard from "@/components/infoSection/InfoCard";
import StatCard from "@/components/infoSection/statCard";

const InfoSection = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      className="w-full px-[clamp(2rem,5vw,10rem)] py-8 lg:pt-[3.125rem] text-white"
    >
      <div className="bg-[linear-gradient(103.07deg,#C3CC4C_0%,#62A744_67.79%)] rounded-[20px] p-4 sm:p-6 lg:p-[3.125rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
        <InfoCard
          icon="/icons/trafficLightIcon.svg"
          title="Обслуживаем"
          description="Светофорные объекты в Смоленске и районных центрах."
        />
        <InfoCard
          icon="/icons/cameraIcon.svg"
          title="Обеспечиваем"
          description="Работоспособность комплексов фото-видеофиксации административных правонарушений."
        />
        <InfoCard
          icon="/icons/trafficJamIcon.svg"
          title="Развиваем"
          description="Автоматизированную систему управления дорожным движением в Смоленске."
        />
        <InfoCard
          icon="/icons/brainstormSkillIcon.svg"
          title="Внедряем"
          description="Интеллектуальную транспортную систему."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-8">
        <StatCard
          value="в 10 раз"
          description="больше автомобилей, чем в 2015г."
        />
        <StatCard
          value="на 15%"
          description="меньше штрафов по сравнению с прошлым годом"
        />
        <StatCard
          value="250+"
          description="светофоров было установлено в 2024 году"
        />
        <StatCard
          value="20 000 км"
          description="дорог было отремонтировано за последние 5 лет"
        />
      </div>
    </div>
  );
});

InfoSection.displayName = "InfoSection";

export default InfoSection;
