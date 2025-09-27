"use client";

import { useState } from "react";
import { useUser } from "@/hooks/user-context";
import axi from "@/utils/api";
import TextNewsSection from "@/widgets/news/textNewsSection/TextNewsSection";
import { useRouter } from "next/navigation";
import TitleNewsSection from "@/widgets/news/titleNewSection/TitleNewSection";
import { useNotificationManager } from "@/hooks/notification-context";

export default function CreateNews() {
  const { user } = useUser();
  const router = useRouter();
  const { addNotification } = useNotificationManager();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | string | null>(null);
  const [loading, setLoading] = useState(false);

  // Создание новости
  const handleCreate = async () => {
    if (!title || !text) {
      addNotification({
        id: Date.now(),
        title: "Ошибка",
        description: "Заголовок и текст обязательны",
        createdAt: new Date(),
        status: 400,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    if (image instanceof File) formData.append("image", image);

    try {
      setLoading(true);
      const response = await axi.post("content/news/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addNotification({
        id: Date.now(),
        title: "Успешно",
        description: "Новость успешно создана",
        createdAt: new Date(),
        status: 200,
      });

      // Перенаправление на список новостей
      router.push("/news");
    } catch (err: any) {
      console.error(err);
      addNotification({
        id: Date.now(),
        title: "Ошибка",
        description: "Произошла ошибка при создании новости",
        createdAt: new Date(),
        status: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Создание новости...</p>}

      <TitleNewsSection
        news={{ id: "", title, image: typeof image === "string" ? image : "" }}
        user={user}
        mode="create"
        onUpdate={handleCreate}
        setTitle={setTitle}
        setImage={setImage}
      />
      <TextNewsSection news={{ id: "", text }} user={user} setText={setText} />
    </div>
  );
}
