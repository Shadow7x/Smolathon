"use client";
import Link from "next/link";

const GreenButton = ({
  children,
  href,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: string }) => {
  return (
    <button
      {...props}
      className={`
        relative
        self-start
        inline-flex
        items-center
        justify-center
        text-center
        bg-[#62A744]
        text-white
        font-bold
        text-[16px]
        leading-[100%]
        rounded-[8px]
        px-[1.875rem]
        py-[0.875rem]
        min-h-[44px]
        whitespace-normal
        break-words
        ${className}
      `}
    >
      {href ? <Link href={href}>{children}</Link> : children}
    </button>
  );
};

export default GreenButton;
