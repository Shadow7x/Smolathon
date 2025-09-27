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
    <div className="pt-[6rem] sm:pt-[8rem] lg:pt-[10rem] flex flex-col items-center">
      {/* 📱 Мобильная версия */}
      <div className="block lg:hidden w-full px-4">
        <h1 className="text-2xl font-bold text-center mb-4">Наши Заслуги</h1>
        <p className="text-base text-center mb-6">
          Благодаря профессионализму нашей команды, результаты нашей работы видны не только на бумаге, но и в статистике!
        </p>

        {isCreating ? <MeritCreate /> : merit && <InitMerit merits={merit} />}

         <div className="w-full grid grid-cols-2 gap-2 py-4">
            {merits?.map((merit, index) => (
            <button
                key={index}
                onClick={() => handleClick(merit.title)}
                className="px-2 py-1 text-xs border rounded-md bg-white text-black hover:bg-gray-100"
            >
                {merit.title}
            </button>
            ))}
        </div>

        {user && (
            <button
            onClick={() => setIsCreating(!isCreating)}
            className="mb-6 w-8 h-8 flex items-center justify-center rounded-md bg-green-600 text-white text-lg hover:bg-green-700"
            >
            +
            </button>
        )}
        </div>

      {/* 💻 Десктопная версия */}
      <div className="hidden lg:block w-full px-8">
        <div className="flex flex-row items-center gap-8 justify-center mb-6">
          <svg className="w-16 h-16" viewBox="0 0 68 68" fill="none">
            <path
              d="M60.3503 52.9833L51.8503 44.4833L55.8169 40.5167L64.3169 49.0167L60.3503 52.9833ZM50.1503 18.9833L46.1836 15.0167L54.6836 6.51667L58.6503 10.4833L50.1503 18.9833ZM17.8503 18.9833L9.35026 10.4833L13.3169 6.51667L21.8169 15.0167L17.8503 18.9833ZM7.65026 52.9833L3.68359 49.0167L12.1836 40.5167L16.1503 44.4833L7.65026 52.9833ZM25.0753 47.6708L34.0003 42.2875L42.9253 47.7417L40.5878 37.5417L48.4503 30.7417L38.1086 29.8208L34.0003 20.1875L29.8919 29.75L19.5503 30.6708L27.4128 37.5417L25.0753 47.6708ZM16.5044 59.5L21.1086 39.5958L5.66693 26.2083L26.0669 24.4375L34.0003 5.66667L41.9336 24.4375L62.3336 26.2083L46.8919 39.5958L51.4961 59.5L34.0003 48.9458L16.5044 59.5Z"
              fill="#62A744"
            />
          </svg>
          <h1 className="text-5xl font-bold">Наши Заслуги</h1>
          <svg className="w-16 h-16" viewBox="0 0 68 68" fill="none">
            <path
              d="M60.3503 52.9833L51.8503 44.4833L55.8169 40.5167L64.3169 49.0167L60.3503 52.9833ZM50.1503 18.9833L46.1836 15.0167L54.6836 6.51667L58.6503 10.4833L50.1503 18.9833ZM17.8503 18.9833L9.35026 10.4833L13.3169 6.51667L21.8169 15.0167L17.8503 18.9833ZM7.65026 52.9833L3.68359 49.0167L12.1836 40.5167L16.1503 44.4833L7.65026 52.9833ZM25.0753 47.6708L34.0003 42.2875L42.9253 47.7417L40.5878 37.5417L48.4503 30.7417L38.1086 29.8208L34.0003 20.1875L29.8919 29.75L19.5503 30.6708L27.4128 37.5417L25.0753 47.6708ZM16.5044 59.5L21.1086 39.5958L5.66693 26.2083L26.0669 24.4375L34.0003 5.66667L41.9336 24.4375L62.3336 26.2083L46.8919 39.5958L51.4961 59.5L34.0003 48.9458L16.5044 59.5Z"
              fill="#62A744"
            />
          </svg>
        </div>

        <div className="w-[60%] mx-auto mb-8">
          <p className="text-2xl text-center">
            Благодаря профессионализму нашей команды, результаты нашей работы видны не только на бумаге, но и в статистике!
          </p>
        </div>

        {isCreating ? <MeritCreate /> : merit && <InitMerit merits={merit} />}

        <div className="w-full flex flex-col items-center gap-4 py-6">
          <div className="w-full flex flex-wrap justify-center gap-3">
            {merits?.map((merit, index) => (
              <button
                key={index}
                onClick={() => handleClick(merit.title)}
                className="px-6 py-3 border rounded-md bg-white text-black text-lg font-medium hover:bg-gray-100"
              >
                {merit.title}
              </button>
            ))}
          </div>
        </div>

        {user && (
            <button
            onClick={() => setIsCreating(!isCreating)}
            className="mb-10 w-12 h-12 flex items-center justify-center rounded-md bg-green-600 text-white text-2xl hover:bg-green-700"
            >
            +
            </button>
        )}
        </div>
    </div>
  );
};

export default MeritsPage;
