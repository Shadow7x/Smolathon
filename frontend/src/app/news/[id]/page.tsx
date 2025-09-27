"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/user-context";
import axi from "@/utils/api"; // твой настроенный axios
import TitleNewsSection from "@/widgets/news/titleNewSection/TitleNewSection";
import TextNewsSection from "@/widgets/news/textNewsSection/TextNewsSection";

interface News {
  id: string;
  title: string;
  text: string;
  date: string;
  image?: string;
}

export default function NewsDetail() {
  const { user } = useUser();
  const params = useParams();
  const { id } = params;

  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axi.get("content/news/get", { params: { id } });
        if (response.data.length > 0) {
          setNews(response.data[0]); // первый элемент, т.к. фильтр по id
        } else {
          setError("Новость не найдена");
        }
      } catch (err: any) {
        console.error("Ошибка при загрузке новости:", err);
        setError("Ошибка при загрузке новости");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!news) return <p>Новость не найдена</p>;

  return (
    <div>
      <TitleNewsSection news={news} user={user} />
      <TextNewsSection news={news} user={user} />
    </div>
  );
}
