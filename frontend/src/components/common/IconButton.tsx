"use client";
import React, { ReactNode } from "react";

interface IconButtonProps {
  bgColor?: string;
  size?: number;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  bgColor = "#62A744",
  size = 60,
  children,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-[0.5rem] ${className}`}
      style={{ backgroundColor: bgColor, width: size, height: size }}
    >
      {children}
    </button>
  );
};

export default IconButton;
