"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/user-context";
import Logout from "@/components/logout/logout";
import { useNotificationManager } from "@/hooks/notification-context";
import axi from "@/utils/api";

export default function AuthenticationPage() {
  const { user, isLoading, fetchUser } = useUser(); // ✅ добавляем isLoading
  const { addNotification } = useNotificationManager();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formData = new FormData();
    formData.append("login", data.get("login") as string);
    formData.append("password", data.get("password") as string);

    try {
      setLoading(true);
      const res = await axi.post("/account/login", formData, {
        validateStatus: () => true,
      });

      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);

        let userData = res.data.user;

        if (!userData && fetchUser) {
          try {
            userData = await fetchUser();
          } catch (err) {
            console.warn("Ошибка при fetchUser:", err);
          }
        }

        if (!userData) {
          const cached = localStorage.getItem("user");
          if (cached) userData = JSON.parse(cached);
        }

        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
        }

        addNotification({
          id: Date.now().toString(),
          title: "Успешная авторизация",
          description: "Добро пожаловать!",
          status: 200,
          createdAt: new Date().toISOString(),
        });

        formRef.current?.reset();

        // 🚀 Переход с перезагрузкой
        if (userData?.username === "admin" || userData?.is_superuser) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        addNotification({
          id: Date.now().toString(),
          title: "Ошибка авторизации",
          description: res.data?.message || "Неверный логин или пароль",
          status: res.status,
          createdAt: new Date().toISOString(),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 🕓 Пока идёт загрузка пользователя — показываем спиннер
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // ✅ Если пользователь уже авторизован — показываем Logout
  if (user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Logout />
      </div>
    );
  }

  // 🧾 Если пользователь не авторизован — форма логина
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Авторизация</h2>

        <div className="mb-4">
          <Label htmlFor="login">Username</Label>
          <Input
            name="login"
            type="text"
            placeholder="Введите имя пользователя"
            className="mt-1"
            autoComplete="off"
            required
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            type="password"
            placeholder="Введите пароль"
            className="mt-1"
            autoComplete="off"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </Button>
      </form>
    </div>
  );
}
