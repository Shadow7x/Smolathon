import IconButton from "@/components/common/IconButton";
import Image from "next/image";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "dots");
      } else if (currentPage >= totalPages - 2) {
        pages.push("dots", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== "dots") onPageChange(page);
  };

  const pages = getPages();

  return (
    <div className="flex flex-row gap-2.5 items-center flex-wrap">
      {currentPage > 1 && (
        <IconButton
          size={58}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex-shrink-0 group bg-white shadow-md hover:bg-black transition duration-300 sm:w-12 sm:h-12"
        >
          <div className="relative w-[2.5rem] h-[2.5rem] rotate-180 sm:w-10 sm:h-10">
            <Image
              src="/icons/blackLeftArrowIcon.svg"
              alt="Prev"
              fill
              className="object-contain opacity-100 group-hover:opacity-0 transition duration-300"
            />
            <Image
              src="/icons/whiteLeftArrowIcon.svg"
              alt="Prev"
              fill
              className="object-contain opacity-0 group-hover:opacity-100 transition duration-300"
            />
          </div>
        </IconButton>
      )}

      {pages.map((page, idx) => (
        <IconButton
          key={idx}
          size={58}
          disabled={page === "dots"}
          onClick={() => handlePageClick(page)}
          className={`flex-shrink-0 group shadow-md transition duration-300 ${
            page === "dots"
              ? "bg-white text-gray-400 cursor-default"
              : currentPage === page
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-black hover:text-white"
          } sm:w-10 sm:h-10`}
        >
          <p className="font-bold text-[24px] leading-[100%] align-middle tracking-normal sm:text-[18px]">
            {page === "dots" ? "..." : page}
          </p>
        </IconButton>
      ))}

      {currentPage < totalPages && (
        <IconButton
          size={58}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex-shrink-0 group bg-white shadow-md hover:bg-black transition duration-300 sm:w-12 sm:h-12"
        >
          <div className="relative w-[2.5rem] h-[2.5rem] sm:w-10 sm:h-10">
            <Image
              src="/icons/blackLeftArrowIcon.svg"
              alt="Next"
              fill
              className="object-contain opacity-100 group-hover:opacity-0 transition duration-300"
            />
            <Image
              src="/icons/whiteLeftArrowIcon.svg"
              alt="Next"
              fill
              className="object-contain opacity-0 group-hover:opacity-100 transition duration-300"
            />
          </div>
        </IconButton>
      )}
    </div>
  );
};

export default Pagination;
