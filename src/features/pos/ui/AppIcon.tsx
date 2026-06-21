import { createElement } from "react"
import type { LucideProps } from "lucide-react"
import { getAppIcon } from "@/components/app-icon-registry"

interface IconProps extends Omit<LucideProps, "ref"> {
  name: string
  size?: number
  color?: string
  className?: string
}

function Icon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
  ...props
}: IconProps) {
  const IconComponent = getAppIcon(name)
  const FallbackIcon = getAppIcon("HelpCircle")

  if (!IconComponent) {
    return FallbackIcon
      ? createElement(FallbackIcon, {
          size,
          color: "gray",
          strokeWidth,
          className,
          ...props,
        })
      : null
  }

  return createElement(IconComponent, {
    size,
    color,
    strokeWidth,
    className,
    ...props,
  })
}

export default Icon
