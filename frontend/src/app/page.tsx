import Image from "next/image";
import HeroSection from "@/widgets/heroSection/page";
import InfoSection from "@/widgets/infoSection/infoSection";

export default function Home() {
  return (
    <div className=" ">
      <HeroSection />
      <InfoSection />
    </div>
  );
}
