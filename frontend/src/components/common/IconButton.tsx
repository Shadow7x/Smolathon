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
  size = 60,
  children,
  onClick,
  className = "",
}) => {
  const remSize = `${size / 16}rem`;

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-[0.5rem] ${className}`}
      style={{ width: remSize, height: remSize }}
      aria-label="icon-button"
      type="button"
    >
      {children}
    </button>
  );
};

export default IconButton;
