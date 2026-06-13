import { ReactNode } from "react";

interface GridCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const GridCard = ({ children, className = "", hover = true }: GridCardProps) => {
  return (
    <div
      className={`border border-border p-6 md:p-8 ${
        hover ? "hover:border-midground hover:bg-[rgba(255,172,2,0.04)]" : ""
      } transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};
