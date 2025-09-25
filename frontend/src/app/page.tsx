"use client";
import { useRef } from "react";
import HeroSection from "@/widgets/heroSection/heroSection";
import InfoSection from "@/widgets/infoSection/infoSection";
import YandexMap from "@/components/map/YandexMap";

export default function Home() {
  const infoSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <HeroSection
        scrollToInfo={() =>
          infoSectionRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <InfoSection ref={infoSectionRef} />
      {/* <YandexMap
        apiKey="5547c71f-7034-4404-9cfc-e1a2d8198ea9"
        address="Смоленск, Большая Советская, Ленина"
      /> */}
    </div>
  );
}
