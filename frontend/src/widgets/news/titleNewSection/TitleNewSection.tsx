"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import WhiteButton from "@/components/common/whiteButton";
import { formatDateV1 } from "@/utils/formatDateV1";
import { MEDIA_URL } from "@/index";

interface News {
  id: string;
  title: string;
  text: string;
  date: string;
  image?: string;
}

interface TitleNewsSectionProps {
  news: News;
  user?: any;
  mode?: "create" | "update";
  onUpdate?: () => void;
  onDelete?: () => void;
  setTitle?: (title: string) => void;
  setImage?: (img: File | string) => void;
}

export default function TitleNewsSection({
  news,
  user,
  mode = "update",
  onDelete,
  onUpdate,
  setImage,
  setTitle,
}: TitleNewsSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [bgImage, setBgImage] = useState(
    news.image ? MEDIA_URL + news.image : ""
  );

  // useEffect аналогичный TextNewsSection: обновляем текст только если он отличается
  useEffect(() => {
    if (titleRef.current && titleRef.current.textContent !== news.title) {
      titleRef.current.textContent = news.title;
    }
  }, [news.title]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage?.(file); // обновляем родительский стейт
      const reader = new FileReader();
      reader.onload = () => setBgImage(reader.result as string); // локальный превью
      reader.readAsDataURL(file);
    }
  };

  return (
    <section
      className="w-full flex flex-col md:flex-row justify-between pb-8 md:pb-16 bg-cover bg-center text-white px-[clamp(2rem,5vw,10rem)] h-1/2"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${
          bgImage || "/images/newsBackground.webp"
        }')`,
      }}
    >
      {/* Левая колонка */}
      <div className="flex-1 flex flex-col gap-8 md:gap-12 mt-[7rem] sm:mt-[10rem] md:mt-[14rem] lg:mt-[20rem]">
        <div className="flex flex-col gap-6 sm:gap-8">
          <p className="font-sans font-normal text-[clamp(1rem,2vw,1.5rem)] leading-[1.2] tracking-[0]">
            {mode === "create" ? "" : formatDateV1(news.date)}
          </p>

          <div className="relative">
            <h2
              contentEditable
              suppressContentEditableWarning
              dir="ltr"
              className="font-sans font-bold text-left text-[clamp(1.5rem,4vw,3rem)] leading-[1.1] break-words"
              style={{
                minHeight: "3rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              ref={titleRef}
              onInput={(e) => setTitle?.(e.currentTarget.textContent || "")}
            />
            {user && !titleRef.current?.textContent && (
              <span
                className="absolute top-0 left-0 pointer-events-none text-white/50 font-bold"
                style={{ fontSize: "clamp(1.5rem,4vw,3rem)" }}
              >
                Введите заголовок
              </span>
            )}
          </div>

          {user && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-4 text-grey-700"
            />
          )}
        </div>
      </div>

      {/* Правая колонка */}
      <div className="flex flex-col justify-end items-start md:items-end mt-[4rem] sm:mt-[6rem] md:mt-0 opacity-90 w-fit max-w-full md:max-w-[50%] gap-4">
        {user && (
          <div className="flex flex-row gap-4 mt-[10rem] mb-auto">
            {/* Показываем trash только если mode !== create */}
            {mode !== "create" && (
              <div className="flex flex-row gap-2">
                <WhiteButton
                  onClick={onDelete}
                  icon={
                    <div className="relative w-6 h-6">
                      <Image
                        src="/icons/greenTrashIcon.svg"
                        fill
                        className="object-contain opacity-100 group-hover:opacity-0 transition duration-300"
                        alt="Удалить"
                      />
                      <Image
                        src="/icons/greyTrashIcon.svg"
                        fill
                        className="object-contain opacity-0 group-hover:opacity-100 transition duration-300"
                        alt="Удалить"
                      />
                    </div>
                  }
                  className="hover:bg-[#82CF61] hover:text-white group"
                />
              </div>
            )}

            <WhiteButton
              onClick={onUpdate}
              className="hover:bg-[#82CF61] hover:text-white group"
              icon={
                <div className="relative w-6 h-6">
                  <Image
                    src="/icons/greenPlusIcon.svg"
                    fill
                    className="object-contain opacity-100 group-hover:opacity-0 transition duration-300"
                    alt="Добавить новость"
                  />
                  <Image
                    src="/icons/whitePlusIcon.svg"
                    fill
                    className="object-contain opacity-0 group-hover:opacity-100 transition duration-300"
                    alt="Добавить новость"
                  />
                </div>
              }
            >
              {mode === "update" ? "Обновить новость" : "Создать новость"}
            </WhiteButton>
          </div>
        )}
      </div>
    </section>
  );
}
