"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
// import axi from "@/utils/api";
// import { API_URL } from "@/index";

interface NotificationManagerType {
  id: number;
  title: string;
  description: string;
  createdAt: number;
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
  const timeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);

        const now = Date.now();
        parsedNotifications.forEach((notification: NotificationManagerType) => {
          const timePassed = now - notification.createdAt;
          const timeLeft = 5000 - timePassed;
          
          if (timeLeft > 0) {
            const timeoutId = setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== notification.id));
              timeoutsRef.current.delete(notification.id);
            }, timeLeft);
            
            timeoutsRef.current.set(notification.id, timeoutId);
          } else {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          }
        });
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
        createdAt: Date.now(),
      };
      
      setNotifications(prev => [...prev, newNotification]);

      const timeoutId = setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        timeoutsRef.current.delete(newNotification.id);
      }, 5000);

      timeoutsRef.current.set(newNotification.id, timeoutId);
      
    } catch (error) {
      console.error("Error adding notification:", error);
      const errorNotification = {
        id: Date.now(),
        title: "Ошибка",
        description: "Произошла ошибка при добавлении уведомления",
        createdAt: Date.now(),
        status: 500,
      };
      
      setNotifications(prev => [...prev, errorNotification]);

      const timeoutId = setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== errorNotification.id));
        timeoutsRef.current.delete(errorNotification.id);
      }, 5000);

      timeoutsRef.current.set(errorNotification.id, timeoutId);
    }
  };

  const removeNotification = (id: number) => {
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
    
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotifications = () => {
    return notifications;
  }

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      timeoutsRef.current.clear();
    };
  }, []);

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
