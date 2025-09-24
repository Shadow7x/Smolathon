import React, { forwardRef } from "react";
import Image from "next/image";

const InfoSection = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      className="w-full px-[2rem] md:px-[4rem] lg:px-[7.5rem] py-10 lg:py-20"
    >
      <div className="flex flex-col lg:flex-row items-center justify-around gap-7 lg:gap-12">
        {/* Блок 1 */}
        <div className="flex flex-col items-center text-center gap-2 lg:w-1/4">
          <Image
            src="/images/infoSection/infoSection1.svg"
            alt="Иконка 1"
            width={110}
            height={110}
            style={{ width: "6.875rem", height: "6.875rem" }}
          />
          <h3 className="font-kadwa font-bold text-[24px] leading-[22px]">
            Обслуживаем
          </h3>
          <p className="font-kadwa font-normal text-[20px] leading-[22px] text-center text-gray-700">
            Светофорные объекты в Смоленске и районных центрах.
          </p>
        </div>

        {/* Блок 2 */}
        <div className="flex flex-col items-center text-center gap-2 lg:w-1/4">
          <Image
            src="/images/infoSection/infoSection2.svg"
            alt="Иконка 2"
            width={110}
            height={110}
            style={{ width: "6.875rem", height: "6.875rem" }}
          />
          <h3 className="font-kadwa font-bold text-[24px] leading-[22px]">
            Обеспечиваем
          </h3>
          <p className="font-kadwa font-normal text-[20px] leading-[22px] text-center text-gray-700">
            Работоспособность комплексов фото-видеофиксации административных
            правонарушений.
          </p>
        </div>

        {/* Блок 3 */}
        <div className="flex flex-col items-center text-center gap-2 lg:w-1/4">
          <Image
            src="/images/infoSection/infoSection3.svg"
            alt="Иконка 3"
            width={110}
            height={110}
            style={{ width: "6.875rem", height: "6.875rem" }}
          />
          <h3 className="font-kadwa font-bold text-[24px] leading-[22px]">
            Развиваем
          </h3>
          <p className="font-kadwa font-normal text-[20px] leading-[22px] text-center text-gray-700">
            Автоматизированную систему управления дорожным движением в
            Смоленске.
          </p>
        </div>

        {/* Блок 4 */}
        <div className="flex flex-col items-center text-center gap-2 lg:w-1/4">
          <Image
            src="/images/infoSection/infoSection4.svg"
            alt="Иконка 4"
            width={110}
            height={110}
            style={{ width: "6.875rem", height: "6.875rem" }}
          />
          <h3 className="font-kadwa font-bold text-[24px] leading-[22px]">
            Внедряем
          </h3>
          <p className="font-kadwa font-normal text-[20px] leading-[22px] text-center text-gray-700">
            Интеллектуальную транспортную систему.
          </p>
        </div>
      </div>
    </div>
  );
});

InfoSection.displayName = "InfoSection";

export default InfoSection;
