"use client";
import MainNewSection from "@/widgets/mainNewSection/mainNewSection";
import { useEffect } from "react";

const NewsPage = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      alert("Вы авторизованы");
    }
  }, []);

  return (
    <div>
      <MainNewSection />
    </div>
  );
};

export default NewsPage;
