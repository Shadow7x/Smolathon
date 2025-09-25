import Image from "next/image";

interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center gap-2">
    <Image
      src={icon}
      alt={title}
      width={110}
      height={110}
      style={{
        width: "6.875rem",
        height: "6.875rem",
        maxWidth: "4rem",
        maxHeight: "4rem",
      }}
    />
    <h3 className="font-bold text-[1.5rem] leading-[1.375rem]">{title}</h3>
    <p className="font-normal text-[1.25rem] leading-[1.375rem]">
      {description}
    </p>
  </div>
);

export default InfoCard;
