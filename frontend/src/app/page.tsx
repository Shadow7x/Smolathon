import Image from "next/image";
import HeroSection from "@/widgets/heroSection/page";
import InfoSection from "@/widgets/infoSection/infoSection";
import AnaliticsSection from "@/widgets/analyticsSection/analyticsSection";
export default function Home() {
  return (
    <div className=" ">
      <HeroSection />
      <AnaliticsSection/>
      {/* <InfoSection /> */}

    </div>
  );
}
