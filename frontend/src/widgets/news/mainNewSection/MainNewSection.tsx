"use client";

import IconButton from "@/components/common/IconButton";
import TransparentButton from "@/components/common/TransparentButton";
import Image from "next/image";
import { formatDateV1 } from "@/utils/formatDateV1";
import { MEDIA_URL } from "@/index";
import WhiteButton from "@/components/common/whiteButton";
import { useRouter } from "next/navigation";
import axi from "@/utils/api";
import { useNotificationManager } from "@/hooks/notification-context";

const MainNewSection = ({ news, user }) => {
  const router = useRouter();
  const { addNotification } = useNotificationManager();

  if (!news) return null;

  const firstLine = news.text.split("\n")[0];
  const preview =
    firstLine.length > 25 ? firstLine.slice(0, 25) + "..." : firstLine;

  const imageNews = MEDIA_URL + news.image;

  const handleDelete = async () => {
    try {
      await axi.post("content/news/delete", { id: news.id });

      addNotification({
        id: Date.now(),
        title: "Успешно",
        description: `Новость "${news.title}" удалена`,
        createdAt: new Date(),
        status: 201,
      });

      router.push("/news");
    } catch (err: any) {
      console.error(err);

      addNotification({
        id: Date.now(),
        title: "Ошибка",
        description: "Не удалось удалить новость",
        createdAt: new Date(),
        status: err.response?.status || 500,
      });
    }
  };

  const handleEdit = () => {
    router.push(`/news/${news.id}`);
  };

  return (
    <section
      className="w-full flex flex-col md:flex-row justify-between pb-8 md:pb-16 bg-cover bg-center text-white px-[clamp(2rem,5vw,10rem)] lg:h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${
          imageNews ? imageNews : "/images/newsBackground.webp"
        }')`,
      }}
    >
      <div className="flex-1 flex flex-col gap-8 md:gap-12 mt-[7rem] sm:mt-[10rem] md:mt-[14rem] lg:mt-[20rem]">
        <div className="flex flex-col gap-6 sm:gap-8">
          <p className="font-sans font-normal text-[clamp(1rem,2vw,1.5rem)] leading-[1.2]">
            {formatDateV1(news.date)}
          </p>
          <h2 className="font-sans font-bold text-[clamp(1.5rem,4vw,3rem)] leading-[1.1]">
            {news.title}
          </h2>
          <TransparentButton onClick={() => router.push(`/news/${news.id}`)}>
            Подробнее
          </TransparentButton>
        </div>
      </div>

      <div className="flex flex-col justify-end items-start md:items-end mt-[4rem] sm:mt-[6rem] md:mt-0 opacity-90 w-fit max-w-full md:max-w-[50%] sm:whitespace-nowrap md:whitespace-normal gap-4">
        {user && (
          <div className="flex flex-row gap-4 mt-[10rem] mb-auto">
            <div className="flex flex-row gap-2">
              {/* Удалить */}
              <WhiteButton
                onClick={handleDelete}
                icon={
                  <div className="relative w-6 h-6">
                    <Image
                      src="/icons/greenTrashIcon.svg"
                      fill
                      className="object-contain"
                      alt="Удалить"
                    />
                  </div>
                }
                className="hover:bg-[#82CF61] hover:text-white group"
              />

              {/* Редактировать */}
              <WhiteButton
                onClick={handleEdit}
                icon={
                  <div className="relative w-6 h-6">
                    <Image
                      src="/icons/greenPencilIcon.svg"
                      fill
                      className="object-contain"
                      alt="Редактировать"
                    />
                  </div>
                }
                className="hover:bg-[#82CF61] hover:text-white group"
              />
            </div>

            {/* Добавить */}
            <WhiteButton
              className="hover:bg-[#82CF61] hover:text-white group"
              onClick={() => router.push("/news/create-new")}
              icon={
                <div className="relative w-6 h-6">
                  <Image
                    src="/icons/greenPlusIcon.svg"
                    fill
                    className="object-contain"
                    alt="Добавить новость"
                  />
                </div>
              }
            >
              Добавить новость
            </WhiteButton>
          </div>
        )}

        <h2 className="font-sans font-bold text-[clamp(1.5rem,4vw,3rem)] leading-[1.1]">
          {preview}
        </h2>

        <IconButton
          size={60}
          className="flex-shrink-0 group bg-[#62A744] hover:bg-white transition duration-300"
          onClick={() => router.push(`/news/${news.id}`)}
        >
          <div className="relative w-[3.25rem] h-[3.25rem]">
            <Image
              src="/icons/whiteLeftArrowIcon.svg"
              alt="Arrow"
              fill
              priority
              className="object-contain"
            />
          </div>
        </IconButton>
      </div>
    </section>
  );
};

export default MainNewSection;
