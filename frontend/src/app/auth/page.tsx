"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/user-context";
import Logout from "@/components/logout/logout";
import { useNotificationManager } from "@/hooks/notification-context";
import axi from "@/utils/api";

export default function AuthenticationPage() {
  const { user, fetchUser } = useUser();
  const { addNotification } = useNotificationManager();
  const [loading, setLoading] = useState(false);

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
        // Успешная авторизация
        localStorage.setItem("token", res.data.token);
        await fetchUser?.();

        addNotification({
          id: Date.now().toString(),
          title: "Успешная авторизация",
          description: "Добро пожаловать!",
          status: 200,
          createdAt: new Date().toISOString(),
        });

        e.currentTarget.reset();
      } else {
        addNotification({
          id: Date.now().toString(),
          title: "Ошибка авторизации",
          description: res.data?.message || "Неверный логин или пароль",
          status: res.status,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error("Network error:", err);
      addNotification({
        id: Date.now().toString(),
        title: "Ошибка авторизации",
        description: err.message || "Произошла ошибка сети",
        status: 500,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Logout />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
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
            autoComplete="new-password"
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
