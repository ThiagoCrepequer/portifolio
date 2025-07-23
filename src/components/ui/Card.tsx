import { clsx } from "clsx"
import type { HTMLAttributes, ReactNode } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Card = ({ children, className, ...props }: CardProps) => (
  <div className={clsx("rounded-lg border border-gray-200 bg-white shadow-sm", className)} {...props}>
    {children}
  </div>
)

export const CardHeader = ({ children, className, ...props }: CardProps) => (
  <div className={clsx("flex flex-col space-y-1.5 p-6", className)} {...props}>
    {children}
  </div>
)

export const CardTitle = ({ children, className, ...props }: CardProps) => (
  <h3 className={clsx("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
    {children}
  </h3>
)

export const CardDescription = ({ children, className, ...props }: CardProps) => (
  <p className={clsx("text-sm text-gray-600", className)} {...props}>
    {children}
  </p>
)

export const CardContent = ({ children, className, ...props }: CardProps) => (
  <div className={clsx("p-6 pt-0", className)} {...props}>
    {children}
  </div>
)
