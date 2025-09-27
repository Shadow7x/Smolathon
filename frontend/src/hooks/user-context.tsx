"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import axi from "@/utils/api";
import { API_URL } from "@/index";

interface UserType {
  email: string;
  id: number;
  is_active: boolean;
  name: string;
  avatar?: string;
}

interface UserContextType {
  user: UserType | null;
  fetchUser: () => Promise<UserType | null>;
  updateUser: (newData: Partial<UserType>) => void;
  cleanupUser: () => void;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  const fetchUser = useCallback(async (): Promise<UserType | null> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await axi.get(API_URL + "account/info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        localStorage.removeItem("token");
        setUser(null);
        return null;
      }

      setUser(response.data);
      return response.data; // ✅ теперь возвращаем юзера
    } catch (error) {
      console.error("Authorization error:", error);
      localStorage.removeItem("token");
      setUser(null);
      return null;
    }
  }, []);

  const updateUser = (newData: Partial<UserType>) => {
    if (user) {
      const updated = { ...user, ...newData };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated)); // ✅ сохраняем обновлённого юзера
    }
  };

  const cleanupUser = () => {
    setUser(null);
    localStorage.removeItem("user"); // ✅ чистим localStorage
    localStorage.removeItem("token");
  };

  // Автовызов при монтировании
  useEffect(() => {
    fetchUser().then((u) => {
      if (u) {
        localStorage.setItem("user", JSON.stringify(u)); // ✅ сразу сохраняем в LS
      }
    });
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, fetchUser, updateUser, cleanupUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
