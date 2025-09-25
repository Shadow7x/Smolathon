import React, { forwardRef } from "react";
import Image from "next/image";

const InfoSection = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      className="w-full px-[clamp(2rem,5vw,10rem)] py-8 lg:pt-[3.125rem] text-white"
    >
      {/* Большой прямоугольник с градиентом */}
      <div className="bg-[linear-gradient(103.07deg,#C3CC4C_0%,#62A744_67.79%)] rounded-[20px] p-4 sm:p-6 lg:p-[3.125rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
        {/* Блок 1 */}
        <div className="flex flex-col items-center text-center gap-2">
          <Image
            src="/icons/trafficLightIcon.svg"
            alt="Обслуживаем"
            width={110}
            height={110}
            style={{
              width: "6.875rem",
              height: "6.875rem",
              maxWidth: "4rem",
              maxHeight: "4rem",
            }}
          />
          <h3 className="font-bold text-[1.5rem] leading-[1.375rem]">
            Обслуживаем
          </h3>
          <p className="font-normal text-[1.25rem] leading-[1.375rem]">
            Светофорные объекты в Смоленске и районных центрах.
          </p>
        </div>

        {/* Блок 2 */}
        <div className="flex flex-col items-center text-center gap-2">
          <Image
            src="/icons/cameraIcon.svg"
            alt="Обеспечиваем"
            width={110}
            height={110}
            style={{
              width: "6.875rem",
              height: "6.875rem",
              maxWidth: "4rem",
              maxHeight: "4rem",
            }}
          />
          <h3 className="font-bold text-[1.5rem] leading-[1.375rem]">
            Обеспечиваем
          </h3>
          <p className="font-normal text-[1.25rem] leading-[1.375rem]">
            Работоспособность комплексов фото-видеофиксации административных
            правонарушений.
          </p>
        </div>

        {/* Блок 3 */}
        <div className="flex flex-col items-center text-center gap-2">
          <Image
            src="/icons/trafficJamIcon.svg"
            alt="Развиваем"
            width={110}
            height={110}
            style={{
              width: "6.875rem",
              height: "6.875rem",
              maxWidth: "4rem",
              maxHeight: "4rem",
            }}
          />
          <h3 className="font-bold text-[1.5rem] leading-[1.375rem]">
            Развиваем
          </h3>
          <p className="font-normal text-[1.25rem] leading-[1.375rem]">
            Автоматизированную систему управления дорожным движением в
            Смоленске.
          </p>
        </div>

        {/* Блок 4 */}
        <div className="flex flex-col items-center text-center gap-2">
          <Image
            src="/icons/brainstormSkillIcon.svg"
            alt="Внедряем"
            width={110}
            height={110}
            style={{
              width: "6.875rem",
              height: "6.875rem",
              maxWidth: "4rem",
              maxHeight: "4rem",
            }}
          />
          <h3 className="font-bold text-[1.5rem] leading-[1.375rem]">
            Внедряем
          </h3>
          <p className="font-normal text-[1.25rem] leading-[1.375rem]">
            Интеллектуальную транспортную систему.
          </p>
        </div>
      </div>

      {/* Нижние 4 прямоугольника */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-8">
        {/* Прямоугольник 1 */}
        <div className="bg-[linear-gradient(103.07deg,#C3CC4C_0%,#62A744_67.79%)] rounded-[1.25rem] flex flex-col items-center justify-center p-4 sm:p-6 lg:px-[3.125rem] lg:py-[5.75rem] text-center gap-6">
          <h3 className="font-bold text-[4rem] lg:leading-[1.375rem] text-center">
            в 10 раз
          </h3>
          <p className="font-normal text-[1.25rem] leading-[1.375rem] mt-2">
            больше автомобилей, чем в 2015г.
          </p>
        </div>

        {/* Прямоугольник 2 */}
        <div className="bg-[linear-gradient(103.07deg,#C3CC4C_0%,#62A744_67.79%)] rounded-[1.25rem] flex flex-col items-center justify-center p-4 sm:p-6 lg:px-[3.125rem] lg:py-[5.75rem] text-center gap-6">
          <h3 className="font-bold text-[4rem] lg:leading-[1.375rem] text-center">
            на 15%
          </h3>
          <p className="font-normal text-[1.25rem] leading-[1.375rem] mt-2">
            меньше штрафов по сравнению с прошлым годом
          </p>
        </div>

        {/* Прямоугольник 3 */}
        <div className="bg-[linear-gradient(103.07deg,#C3CC4C_0%,#62A744_67.79%)] rounded-[1.25rem] flex flex-col items-center justify-center p-4 sm:p-6 lg:px-[3.125rem] lg:py-[5.75rem] text-center gap-6">
          <h3 className="font-bold text-[4rem] lg:leading-[1.375rem] text-center">
            250+
          </h3>
          <p className="font-normal text-[1.25rem] leading-[1.375rem] mt-2">
            светофоров было установлено в 2024 году
          </p>
        </div>

        {/* Прямоугольник 4 */}
        <div className="bg-[linear-gradient(103.07deg,#C3CC4C_0%,#62A744_67.79%)] rounded-[1.25rem] flex flex-col items-center justify-center p-4 sm:p-6 lg:px-[3.125rem] lg:py-[5.75rem] text-center gap-6">
          <h3 className="font-bold text-[4rem] lg:leading-[1.375rem] text-center">
            20 000 км
          </h3>
          <p className="font-normal text-[1.25rem] leading-[1.375rem] mt-2">
            дорог было отремонтировано за последние 5 лет
          </p>
        </div>
      </div>
    </div>
  );
});

InfoSection.displayName = "InfoSection";

export default InfoSection;
