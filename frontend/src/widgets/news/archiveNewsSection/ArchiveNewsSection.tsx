import { useState } from "react";
import Pagination from "@/components/common/Pagination";
import NewCard from "@/components/newCard/newCard";

const ArchiveNewsSection = ({ news }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(news.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleNews = news.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="flex flex-col justify-between pb-8 md:pb-[6rem] pt-3 md:pt-[4rem] bg-[#F3F3F3] text-black px-[clamp(1rem,5vw,10rem)]">
      <div className="w-full flex flex-col gap-[2rem] md:gap-[4rem]">
        <h2 className="font-bold text-[clamp(24px,5vw,40px)] leading-tight">
          Архив новостей
        </h2>

        <div className="flex flex-col gap-16 items-center">
          <div className="flex flex-wrap justify-center gap-6">
            {visibleNews.map((item, index) => (
              <NewCard
                key={index}
                news={{ ...item, id: startIndex + index + 1 }}
                size="medium"
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </section>
  );
};

export default ArchiveNewsSection;
