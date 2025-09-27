import Link from "next/link";
import Image from "next/image";
import { MEDIA_URL } from "@/index";
import { formatDateV2 } from "@/utils/formatDateV2";
import { useUser } from "@/hooks/user-context";

const NewCard = ({ news, size = "small" }) => {
  const imageNews = news?.image ? MEDIA_URL + news.image : null;
  const { user } = useUser();

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(`${action} clicked for news id: ${news.id}`);
  };

  // размеры через clamp для адаптива
  const cardHeight =
    size === "large"
      ? "clamp(20rem, 50vw, 38.5rem)"
      : "clamp(12rem, 40vw, 18.75rem)";

  const cardWidth =
    size === "large"
      ? "clamp(18rem, 60vw, 46.5rem)"
      : size === "medium"
      ? "clamp(20rem, 35vw, 28.75rem)"
      : "clamp(12rem, 30vw, 25rem)";

  const dateFontSize =
    size === "large" ? "clamp(16px,2vw,24px)" : "clamp(12px,1.5vw,16px)";

  const titleFontSize =
    size === "large" ? "clamp(20px,2.5vw,32px)" : "clamp(14px,2vw,20px)";

  const iconSize = size === "large" ? 3 : 2;
  const paddingX = size === "large" ? "2rem" : "1rem";
  const paddingY = size === "large" ? "3rem" : "1.5rem";
  const buttonTop = size === "large" ? "2.25rem" : "1.5rem";
  const buttonRight = size === "large" ? "2.25rem" : "1.5rem";

  return (
    <div
      className="relative bg-gray-300 bg-cover bg-center rounded-2xl shadow-md flex flex-col justify-end gap-2 w-full"
      style={{
        width: cardWidth,
        height: cardHeight,
        padding: `${paddingY} ${paddingX}`,
        backgroundImage: imageNews
          ? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('${imageNews}')`
          : undefined,
      }}
    >
      {user && (
        <div
          className="flex flex-row gap-2 absolute z-10"
          style={{ top: buttonTop, right: buttonRight }}
        >
          <div
            className="relative cursor-pointer group"
            style={{ width: `${iconSize}rem`, height: `${iconSize}rem` }}
            onClick={(e) => handleButtonClick(e, "trash")}
          >
            <Image
              src="/icons/greyTrashIcon.svg"
              fill
              className="object-contain opacity-100 group-hover:opacity-0 transition duration-300"
              alt="Удалить"
            />
            <Image
              src="/icons/greenTrashIcon.svg"
              fill
              className="object-contain opacity-0 group-hover:opacity-100 transition duration-300"
              alt="Удалить"
            />
          </div>
          <div
            className="relative cursor-pointer group"
            style={{ width: `${iconSize}rem`, height: `${iconSize}rem` }}
            onClick={(e) => handleButtonClick(e, "edit")}
          >
            <Image
              src="/icons/greyPencilIcon.svg"
              fill
              className="object-contain opacity-100 group-hover:opacity-0 transition duration-300"
              alt="Редактировать"
            />
            <Image
              src="/icons/greenPencilIcon.svg"
              fill
              className="object-contain opacity-0 group-hover:opacity-100 transition duration-300"
              alt="Редактировать"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 z-0">
        <p
          className="font-nunito font-normal text-white"
          style={{
            fontSize: dateFontSize,
            lineHeight: "120%",
          }}
        >
          {formatDateV2(news.date)}
        </p>
        <Link href={`/news/${news.id}`}>
          <h2
            className="font-nunito font-bold text-white hover:underline cursor-pointer"
            style={{
              fontSize: titleFontSize,
              lineHeight: "120%",
            }}
          >
            {news.title}
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default NewCard;
