"use client";
import axi from "@/utils/api";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/user-context";
import InitMerit from "@/widgets/mainSection/merits/InitMirits";
import MeritCreate from "@/widgets/mainSection/merits/MeritCreate";
import { useRouter } from "next/navigation";

interface Merit {
  id: number;
  images_first_block: { id: number; image: string }[];
  images_second_block: { id: number; image: string }[];
  logo_first_block: string;
  logo_second_block: string;
  title: string;
  decode: string;
  purposes: string;
  parents_name: string;
  parents_phone: string;
  parents_email: string;
  address: string;
}

const MeritsPage = () => {
  const [merits, setMerits] = useState<Merit[]>([]);
  const { user } = useUser();
  const [merit, setMerit] = useState<Merit | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axi.get("/content/merits/get").then((response) => {
      setMerits(response.data);
      const url = new URL(window.location.href);
      const currentName = url.searchParams.get("name");
      if (currentName === null) {
        setMerit(response.data[0]);
      } else {
        const s =
          response.data.find((merit) => merit.title === currentName) || null;
        setMerit(s);
      }
    });
  }, []);

  const handleClick = (title: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("name", title);
    router.push(`?${params.toString()}`);
    setMerit(merits.find((merit) => merit.title === title) || null);
  };

  return (
    <div className="pt-[6rem] sm:pt-[8rem] lg:pt-[10rem] flex flex-col items-center px-4 sm:px-6 lg:px-8">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-6 text-center">
        <svg className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16" viewBox="0 0 68 68" fill="none">
          <path
            d="M60.3503 52.9833L51.8503 44.4833L55.8169 40.5167L64.3169 49.0167L60.3503 52.9833ZM50.1503 18.9833L46.1836 15.0167L54.6836 6.51667L58.6503 10.4833L50.1503 18.9833ZM17.8503 18.9833L9.35026 10.4833L13.3169 6.51667L21.8169 15.0167L17.8503 18.9833ZM7.65026 52.9833L3.68359 49.0167L12.1836 40.5167L16.1503 44.4833L7.65026 52.9833ZM25.0753 47.6708L34.0003 42.2875L42.9253 47.7417L40.5878 37.5417L48.4503 30.7417L38.1086 29.8208L34.0003 20.1875L29.8919 29.75L19.5503 30.6708L27.4128 37.5417L25.0753 47.6708ZM16.5044 59.5L21.1086 39.5958L5.66693 26.2083L26.0669 24.4375L34.0003 5.66667L41.9336 24.4375L62.3336 26.2083L46.8919 39.5958L51.4961 59.5L34.0003 48.9458L16.5044 59.5Z"
            fill="#62A744"
          />
        </svg>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Наши Заслуги</h1>

        <svg className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16" viewBox="0 0 68 68" fill="none">
          <path
            d="M60.3503 52.9833L51.8503 44.4833L55.8169 40.5167L64.3169 49.0167L60.3503 52.9833ZM50.1503 18.9833L46.1836 15.0167L54.6836 6.51667L58.6503 10.4833L50.1503 18.9833ZM17.8503 18.9833L9.35026 10.4833L13.3169 6.51667L21.8169 15.0167L17.8503 18.9833ZM7.65026 52.9833L3.68359 49.0167L12.1836 40.5167L16.1503 44.4833L7.65026 52.9833ZM25.0753 47.6708L34.0003 42.2875L42.9253 47.7417L40.5878 37.5417L48.4503 30.7417L38.1086 29.8208L34.0003 20.1875L29.8919 29.75L19.5503 30.6708L27.4128 37.5417L25.0753 47.6708ZM16.5044 59.5L21.1086 39.5958L5.66693 26.2083L26.0669 24.4375L34.0003 5.66667L41.9336 24.4375L62.3336 26.2083L46.8919 39.5958L51.4961 59.5L34.0003 48.9458L16.5044 59.5Z"
            fill="#62A744"
          />
        </svg>
      </div>

      {/* Описание */}
      <div className="max-w-3xl mx-auto mb-6 sm:mb-10">
        <p className="text-base sm:text-lg lg:text-2xl text-center text-gray-800">
          Благодаря профессионализму нашей команды, результаты нашей работы видны не только на бумаге, но и в статистике!
        </p>
      </div>

      {/* Основной контент */}
      {isCreating ? <MeritCreate /> : merit && <InitMerit merits={merit} />}

      {/* Кнопки выбора заслуг */}
      <div className="w-full flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 py-4 sm:py-6">
        {merits?.map((merit, index) => (
          <button
            key={index}
            onClick={() => handleClick(merit.title)}
            className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border rounded-md bg-white text-black text-sm sm:text-base lg:text-lg font-medium hover:bg-gray-100 transition"
          >
            {merit.title}
          </button>
        ))}
      </div>

      {/* Кнопка создания */}
      {user && (
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="mb-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-md bg-green-600 text-white text-xl sm:text-2xl hover:bg-green-700"
        >
          +
        </button>
      )}
    </div>
  );
};

export default MeritsPage;
