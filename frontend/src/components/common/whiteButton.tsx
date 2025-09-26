import React, { ReactNode } from "react";

interface WhiteButtonProps {
  className: string;
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
}

const WhiteButton: React.FC<WhiteButtonProps> = ({
  className,
  children,
  icon,
  onClick,
}) => {
  const hasText = Boolean(children);

  return (
    <button
      onClick={onClick}
      className={`${className} flex items-center gap-3 
                 bg-white 
                 text-[#82CF61] 
                 text-[1rem]
                 rounded-[8px] 
                 transition 
                 duration-300
                 ${icon && !hasText ? "p-2" : "py-2 px-4"}`}
    >
      {icon && <div className="flex-shrink-0">{icon}</div>}
      {hasText && <span>{children}</span>}
    </button>
  );
};

export default WhiteButton;
