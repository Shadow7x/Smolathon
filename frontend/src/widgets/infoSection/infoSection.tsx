import React, { forwardRef } from "react";

const InfoSection = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="w-full text-white">
      <div className="flex flex-col justify-center text-center gap-8 sm:gap-12 lg:gap-16 py-8 sm:py-12 lg:py-[300px] px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[400px]">
        <div className="text-black font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[64px]">
          Кто <span className="text-[#62A744]">мы</span>?
        </div>
        <div className="gap-10 sm:gap-8 lg:gap-12 flex flex-col">
          {/* Первый блок */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-10">
            <div className="order-2 lg:order-1 h-fit w-full lg:w-fit py-4 lg:py-5 px-6 lg:px-10 border-1 border-[#e9e9e9] rounded-2xl text-base sm:text-lg lg:text-xl xl:text-2xl text-black text-start">
              <span className="font-bold">
                СОГБУ <span className="text-[#62A744]">«ЦОДД»</span>
              </span>{" "}
              - это <span className="font-bold">ключевая</span> организация в
              Смоленской
              <br className="hidden sm:block" />
              области, отвечающая за создание{" "}
              <span className="font-bold">современной</span>,{" "}
              <span className="font-bold">безопасной</span> и
              <br className="hidden sm:block" />
              <span className="font-bold">эффективной</span> транспортной
              системы.
            </div>
            <svg
              className="order-1 lg:order-2 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 xl:w-[134px] xl:h-[134px] flex-shrink-0"
              viewBox="0 0 150 134"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25 117.333V125.667C25 128.028 24.2014 130.007 22.6042 131.604C21.0069 133.201 19.0278 134 16.6667 134H8.33333C5.97222 134 3.99306 133.201 2.39583 131.604C0.798611 130.007 0 128.028 0 125.667V59L17.5 8.99996C18.3333 6.49996 19.8264 4.48607 21.9792 2.95829C24.1319 1.43051 26.5278 0.666626 29.1667 0.666626H120.833C123.472 0.666626 125.868 1.43051 128.021 2.95829C130.174 4.48607 131.667 6.49996 132.5 8.99996L150 59V125.667C150 128.028 149.201 130.007 147.604 131.604C146.007 133.201 144.028 134 141.667 134H133.333C130.972 134 128.993 133.201 127.396 131.604C125.799 130.007 125 128.028 125 125.667V117.333H25ZM23.3333 42.3333H126.667L117.917 17.3333H32.0833L23.3333 42.3333ZM37.5 92.3333C40.9722 92.3333 43.9236 91.118 46.3542 88.6875C48.7847 86.2569 50 83.3055 50 79.8333C50 76.3611 48.7847 73.4097 46.3542 70.9791C43.9236 68.5486 40.9722 67.3333 37.5 67.3333C34.0278 67.3333 31.0764 68.5486 28.6458 70.9791C26.2153 73.4097 25 76.3611 25 79.8333C25 83.3055 26.2153 86.2569 28.6458 88.6875C31.0764 91.118 34.0278 92.3333 37.5 92.3333ZM112.5 92.3333C115.972 92.3333 118.924 91.118 121.354 88.6875C123.785 86.2569 125 83.3055 125 79.8333C125 76.3611 123.785 73.4097 121.354 70.9791C118.924 68.5486 115.972 67.3333 112.5 67.3333C109.028 67.3333 106.076 68.5486 103.646 70.9791C101.215 73.4097 100 76.3611 100 79.8333C100 83.3055 101.215 86.2569 103.646 88.6875C106.076 91.118 109.028 92.3333 112.5 92.3333ZM16.6667 100.667H133.333V59H16.6667V100.667Z"
                fill="#62A744"
              />
            </svg>
          </div>

          {/* Второй блок */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-10">
            <svg
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 xl:w-[134px] xl:h-[134px] flex-shrink-0"
              viewBox="0 0 134 168"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M58.25 134L105.333 86.9166L93.25 74.8333L58.0416 110.042L40.5416 92.5416L28.6666 104.417L58.25 134ZM17 167.333C12.4166 167.333 8.49304 165.701 5.22915 162.437C1.96526 159.174 0.333313 155.25 0.333313 150.667V17.3333C0.333313 12.75 1.96526 8.82635 5.22915 5.56246C8.49304 2.29857 12.4166 0.666626 17 0.666626H83.6666L133.667 50.6666V150.667C133.667 155.25 132.035 159.174 128.771 162.437C125.507 165.701 121.583 167.333 117 167.333H17ZM75.3333 59V17.3333H17V150.667H117V59H75.3333Z"
                fill="#62A744"
              />
            </svg>
            <div className="h-fit w-full lg:w-fit py-4 lg:py-5 px-6 lg:px-10 border-1 border-[#e9e9e9] rounded-2xl text-base sm:text-lg lg:text-xl xl:text-2xl text-black text-start">
              Наш Центр был создан как{" "}
              <span className="font-bold">самостоятельное</span> учреждение для
              <br className="hidden sm:block" />
              комплексного решения задач в сфере дорожного движения.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

InfoSection.displayName = "InfoSection";

export default InfoSection;
