"use client";
import { useRef } from "react";
import HeroSection from "@/widgets/heroSection/heroSection";
import InfoSection from "@/widgets/infoSection/infoSection";

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
    </div>
  );
}
