"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/user-context";
import { useNotificationManager } from "@/hooks/notification-context";
import axi from "@/utils/api";

export default function Logout() {
  const { clearUser } = useUser();
  const { addNotification } = useNotificationManager();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        addNotification({
          id: Date.now().toString(),
          title: "Ошибка",
          description: "Токен не найден",
          status: 401,
          createdAt: new Date().toISOString(),
        });
        window.location.href = "/"; // ✅ Переход + обновление
        return;
      }

      const res = await axi.get("/account/logout", {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });

      // ✅ Очищаем всё независимо от результата
      localStorage.removeItem("token");
      clearUser?.();

      addNotification({
        id: Date.now().toString(),
        title: "Выход выполнен",
        description:
          res.status === 200
            ? "Вы успешно вышли из аккаунта"
            : "Сессия завершена локально",
        status: 200,
        createdAt: new Date().toISOString(),
      });

      window.location.href = "/"; // ✅ Мгновенный редирект с reload
    } catch (err) {
      localStorage.removeItem("token");
      clearUser?.();

      addNotification({
        id: Date.now().toString(),
        title: "Выход выполнен",
        description: "Сессия завершена локально",
        status: 200,
        createdAt: new Date().toISOString(),
      });

      window.location.href = "/"; // ✅ fallback переход
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="text-black hover:bg-red-50 hover:text-red-600 cursor-pointer"
    >
      Выйти
    </Button>
  );
}
