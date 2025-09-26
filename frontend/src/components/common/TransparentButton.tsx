import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";

const TransparentButton = ({
  children,
  className = "",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => {
  return (
    <button
      {...props}
      className={`
        relative
        self-start
        inline-flex
        rounded-[8px]
        border-[3px]
        border-[#62A744]
        text-[#82CF61]
        bg-transparent
        transition-colors
        duration-300
        hover:text-white
        hover:border-white
        px-[1.875rem]
        py-[0.875rem]
        whitespace-normal
        break-words
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default TransparentButton;
