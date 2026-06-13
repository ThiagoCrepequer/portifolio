import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "secondary" | "outline";
}

export const Badge = ({ children, variant = "default", className, ...props }: BadgeProps) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-border bg-transparent text-foreground hover:border-midground",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
