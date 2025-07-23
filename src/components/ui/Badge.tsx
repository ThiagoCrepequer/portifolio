import { clsx } from "clsx"
import type { HTMLAttributes, ReactNode } from "react"

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: "default" | "secondary" | "outline"
}

const Badge = ({ children, variant = "default", className, ...props }: BadgeProps) => {
  const variants = {
    default: "bg-gray-900 text-white",
    secondary: "bg-gray-100 text-gray-900",
    outline: "border border-gray-300 bg-transparent",
  }

  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge
