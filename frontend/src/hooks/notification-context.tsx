"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axi from "@/utils/api";
import { API_URL } from "@/index";

interface NotificationManagerType {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  status: number;
}

interface NotificationManagerContextType {
  notifications: NotificationManagerType[];
  addNotification: (notification: NotificationManagerType) => void;
  removeNotification: (id: number) => void;
  getNotifications: () => NotificationManagerType[];
}

const NotificationManagerContext =
  createContext<NotificationManagerContextType>(
    {} as NotificationManagerContextType
  );

export const NotificationManagerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationManagerType[]>([]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error("Error parsing saved notifications:", error);
        localStorage.removeItem("notifications");
      }
    }
  }, []);


  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    } else {
      localStorage.removeItem("notifications");
    }
  }, [notifications]);

  const addNotification = (notification: NotificationManagerType) => {
    try {
      const newNotification = {
        ...notification,
        id: Date.now(), 
      };
      setNotifications(prev => [...prev, newNotification]);
    } catch (error) {
      console.error("Error adding notification:", error);
      // Резервное уведомление об ошибке
      setNotifications(prev => [...prev, {
        id: Date.now(),
        title: "Ошибка",
        description: "Произошла ошибка при добавлении уведомления",
        createdAt: new Date(),
        status: 500,
      }]);
    }
  };

  const getNotifications = () => {
    useEffect(() => {
      const savedNotifications = localStorage.getItem("notifications");
      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications));
        } catch (error) {
          console.error("Error parsing saved notifications:", error);
          localStorage.removeItem("notifications");
        }
      }
    }, []);


    useEffect(() => {
      if (notifications.length > 0) {
        localStorage.setItem("notifications", JSON.stringify(notifications));
      } else {
        localStorage.removeItem("notifications");
      }
    }, [notifications]);
    return notifications
    
  }

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };


  return (
    <NotificationManagerContext.Provider
      value={{ notifications, addNotification, removeNotification, getNotifications }}
    >
      {children}
    </NotificationManagerContext.Provider>
  );
};

export const useNotificationManager = () => {
  const context = useContext(NotificationManagerContext);
  if (!context) {
    throw new Error(
      "useNotificationManager must be used within a NotificationManagerProvider"
    );
  }
  return context;
};
