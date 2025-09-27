"use client";

import NewCard from "@/components/newCard/newCard";
import { useRef, useEffect } from "react";

interface News {
  id: string;
  title: string;
  text: string;
  date: string;
  image?: string;
}

interface TextNewsSectionProps {
  news: News;
  nextNews?: News[];
  user?: any;
  setText: (text: string) => void;
}

const TextNewsSection = ({
  news,
  nextNews = [],
  user,
  setText,
}: TextNewsSectionProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current && textRef.current.textContent !== news.text) {
      textRef.current.textContent = news.text;
    }
  }, [news.text]);

  return (
    <section className="w-full flex flex-col lg:flex-row justify-between bg-white text-black px-[clamp(2rem,5vw,10rem)] pb-[7rem] md:pb-[14rem] gap-8">
      {/* Текстовая часть */}
      <div className="flex-1 min-w-0 mt-8 md:mt-12">
        {user ? (
          <div
            ref={textRef}
            contentEditable
            suppressContentEditableWarning
            className="font-sans text-[clamp(1rem,2vw,1.5rem)] leading-[1.5] whitespace-pre-wrap break-words border border-gray-400 w-full"
            onInput={(e) => setText(e.currentTarget.textContent || "")}
          />
        ) : (
          <div className="font-sans text-[clamp(1rem,2vw,1.5rem)] leading-[1.5] whitespace-pre-wrap break-words border border-gray-400 w-full">
            {news.text}
          </div>
        )}
      </div>

      {/* Блок с карточками */}
      {nextNews.length > 0 && (
        <div className="flex flex-wrap lg:flex-col gap-4 w-full lg:w-[25rem] mt-8 md:mt-12 flex-shrink-0">
          {nextNews.map((item) => (
            <NewCard key={item.id} news={item} size="small" />
          ))}
        </div>
      )}
    </section>
  );
};

export default TextNewsSection;
