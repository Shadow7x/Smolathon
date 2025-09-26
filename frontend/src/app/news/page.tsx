// NewsPage.jsx
"use client";
import { useEffect, useState } from "react";
import MainNewSection from "@/widgets/mainNewSection/mainNewSection";
import axi from "@/utils/api";
import { useUser } from "@/hooks/user-context";

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
  return (
    <div>
      <MainNewSection news={firstNews} user={user} />
    </div>
  );
};

export default NewsPage;
