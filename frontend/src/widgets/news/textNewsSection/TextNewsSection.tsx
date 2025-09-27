"use client";

import NewCard from "@/components/newCard/newCard";
import { useRef, useState, useEffect } from "react";

interface News {
  id: string;
  title: string;
  text: string;
  date: string;
  image?: string;
}

interface TextNewsSectionProps {
  news: News;
  nextNews?: News[]; // массив следующих 2 новостей
  user?: any;
}

const TextNewsSection = ({
  news,
  nextNews = [],
  user,
}: TextNewsSectionProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(news.text || "");

  useEffect(() => {
    if (textRef.current) {
      textRef.current.textContent = news.text;
    }
  }, [news.text]);

  return (
    <section className="w-full flex flex-col md:flex-row justify-between bg-white text-black px-[clamp(2rem,5vw,10rem)] pb-[7rem] md:pb-[14rem] gap-8">
      <div className="flex-1 max-w-[69rem] flex flex-col gap-6 mt-[2rem] sm:mt-[3rem] md:mt-[5rem] lg:mt-[5rem] text-left relative">
        {user ? (
          <>
            <div
              ref={textRef}
              contentEditable
              suppressContentEditableWarning
              className="font-sans text-[clamp(1rem,2vw,1.5rem)] leading-[1.5] whitespace-pre-wrap break-words min-h-[3rem]"
              onInput={(e) => setText(e.currentTarget.textContent || "")}
            />
            {!text && (
              <span
                className="absolute top-0 left-0 pointer-events-none text-black/50"
                style={{ fontSize: "clamp(1rem,2vw,1.5rem)" }}
              >
                Введите текст новости
              </span>
            )}
          </>
        ) : (
          <div className="font-sans text-[clamp(1rem,2vw,1.5rem)] leading-[1.5] whitespace-pre-wrap break-words">
            {text}
          </div>
        )}
      </div>

      {/* Правая колонка с маленькими карточками */}
      {nextNews.length > 0 && (
        <div className="flex flex-col gap-4 mt-[4rem] sm:mt-[6rem] md:mt-0 w-full md:w-auto">
          {nextNews.map((item) => (
            <NewCard key={item.id} news={item} size="small" />
          ))}
        </div>
      )}
    </section>
  );
};

export default TextNewsSection;
