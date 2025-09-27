// NewsPage.jsx
"use client";
import { useEffect, useState } from "react";
import MainNewSection from "@/widgets/mainNewSection/mainNewSection";
import axi from "@/utils/api";
import { useUser } from "@/hooks/user-context";
import WeekNewsSection from "@/widgets/weekNewsSection/weekNewsSection";
import ArchiveNewsSection from "@/widgets/archiveNewsSection/ArchiveNewsSection";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axi.get("content/news/get");
        setNews(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке новостей:", error);
      }
    };

    fetchNews();
  }, []);

  const firstNews = news[0];
  const weekNews = news.slice(0, 6);

  return (
    <div>
      <MainNewSection news={firstNews} user={user} />
      <WeekNewsSection news={weekNews} />
      <ArchiveNewsSection news={news} />
    </div>
  );
};

export default NewsPage;
