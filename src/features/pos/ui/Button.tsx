import React from "react"
import { cn } from "@/lib/utils"
import Icon from "@/components/AppIcon"

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant =
  | "default"
  | "outline"
  | "ghost"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "link"
type ButtonSize = "xs" | "sm" | "default" | "lg" | "icon"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>
  variant?: ButtonVariant
  size?: ButtonSize
  iconName?: string
  iconPosition?: "left" | "right"
  fullWidth?: boolean
  children?: React.ReactNode
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
  outline:
    "border border-border bg-background hover:bg-muted hover:text-foreground",
  ghost: "hover:bg-muted hover:text-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  success:
    "bg-success text-white hover:bg-success/90 focus-visible:ring-success",
  warning:
    "bg-warning text-foreground hover:bg-warning/90 focus-visible:ring-warning",
  error:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
  link: "text-primary underline-offset-4 hover:underline",
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-11 px-2 text-xs rounded-md",
  sm: "h-11 px-3 text-sm rounded-md",
  default: "h-11 px-4 text-sm rounded-lg",
  lg: "h-11 px-6 text-base rounded-lg",
  icon: "size-11 p-0 rounded-lg",
}

const iconSizes: Record<ButtonSize, number> = {
  xs: 14,
  sm: 16,
  default: 18,
  lg: 20,
  icon: 18,
}

// ─── Component ────────────────────────────────────────────────────────────────

const Button = ({
  variant = "default",
  size = "default",
  iconName,
  iconPosition = "left",
  fullWidth = false,
  className,
  disabled,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) => {
  const hasIcon = !!iconName
  const isIconOnly = hasIcon && !children

  const iconSize = iconSizes[size]

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        // Base styles
        "inline-flex shrink-0 touch-manipulation items-center justify-center font-medium",
        "transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out motion-reduce:transition-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "select-none",
        // Variant
        variantStyles[variant],
        // Size
        isIconOnly ? sizeStyles.icon : sizeStyles[size],
        // Full width
        fullWidth && "w-full",
        // Custom className
        className
      )}
      {...props}
    >
      {hasIcon && iconPosition === "left" && (
        <Icon
          name={iconName}
          size={iconSize}
          className={children ? "mr-2" : ""}
        />
      )}
      {children}
      {hasIcon && iconPosition === "right" && (
        <Icon
          name={iconName}
          size={iconSize}
          className={children ? "ml-2" : ""}
        />
      )}
    </button>
  )
}

export default Button
