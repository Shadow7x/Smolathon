"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/user-context";
import axi from "@/utils/api";
import TitleNewsSection from "@/widgets/news/titleNewSection/TitleNewSection";
import TextNewsSection from "@/widgets/news/textNewsSection/TextNewsSection";
import { useNotificationManager } from "@/hooks/notification-context";

interface News {
  id: string;
  title: string;
  text: string;
  date: string;
  image?: string;
}

export default function NewsDetail() {
  const { user } = useUser();
  const { id } = useParams();
  const { addNotification } = useNotificationManager();

  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | string | null>(null);

  const router = useRouter();
  const [nextNews, setNextNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNextNews = async () => {
      try {
        if (!id) return;

        // id из useParams() обычно строка → переведём в число
        const currentId = Number(id);
        if (isNaN(currentId)) return;

        // Делаем два параллельных запроса
        const [res1, res2] = await Promise.all([
          axi.get("content/news/get", { params: { id: currentId + 1 } }),
          axi.get("content/news/get", { params: { id: currentId + 2 } }),
        ]);

        // Склеиваем, фильтруем пустые
        const nextTwo: News[] = [
          ...(res1.data?.length ? [res1.data[0]] : []),
          ...(res2.data?.length ? [res2.data[0]] : []),
        ];

        setNextNews(nextTwo);
      } catch (err) {
        console.error("Ошибка при загрузке nextNews", err);
      }
    };

    fetchNextNews();
  }, [id]);

  // Загружаем новость
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axi.get("content/news/get", { params: { id } });
        if (response.data.length > 0) {
          const n = response.data[0];
          setNews(n);
          setTitle(n.title);
          setText(n.text);
          setImage(n.image || null);
        } else {
          setError("Новость не найдена");
        }
      } catch (err: any) {
        console.error(err);
        setError("Ошибка при загрузке новости");
        addNotification({
          id: Date.now(),
          title: "Ошибка",
          description: "Ошибка при загрузке новости",
          createdAt: new Date(),
          status: 500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, addNotification]);

  // Обновление новости
  const handleUpdate = async () => {
    if (!news) return;

    const formData = new FormData();
    formData.append("id", news.id);
    formData.append("title", title);
    formData.append("text", text);
    if (image instanceof File) formData.append("image", image);

    try {
      const response = await axi.post("content/news/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addNotification({
        id: Date.now(),
        title: "Успешно",
        description: "Новость обновлена",
        createdAt: new Date(),
        status: 200,
      });
    } catch (err: any) {
      console.error(err);
      addNotification({
        id: Date.now(),
        title: "Ошибка",
        description: "Ошибка при обновлении новости",
        createdAt: new Date(),
        status: 500,
      });
    }
  };

  // Удаление новости
  const handleDelete = async () => {
    if (!news) return;

    try {
      const response = await axi.post("content/news/delete", { id: news.id });

      addNotification({
        id: Date.now(),
        title: "Успешно",
        description: "Новость удалена",
        createdAt: new Date(),
        status: 200,
      });

      setNews(null);

      router.push("/news");
    } catch (err: any) {
      console.error(err);
      addNotification({
        id: Date.now(),
        title: "Ошибка",
        description: "Ошибка при удалении новости",
        createdAt: new Date(),
        status: 500,
      });
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!news) return <p>Новость не найдена</p>;

  return (
    <div>
      <TitleNewsSection
        news={{ ...news, title, image: typeof image === "string" ? image : "" }}
        user={user}
        mode="update"
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        setTitle={setTitle}
        setImage={setImage}
      />
      <TextNewsSection
        news={{ ...news, text }}
        user={user}
        setText={setText}
        nextNews={nextNews}
      />
    </div>
  );
}
