import React from "react"
import { HelpCircle, type LucideProps } from "lucide-react"
import { getAppIcon } from "@/components/app-icon-registry"

export interface AppIconProps extends Omit<LucideProps, "ref"> {
  name: string
  size?: number
  color?: string
  className?: string
}

const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 24,
  color,
  className = "",
  ...props
}) => {
  const IconComponent = getAppIcon(name) ?? HelpCircle

  return React.createElement(IconComponent, {
    size,
    color,
    className,
    ...props,
  })
}

export default AppIcon
