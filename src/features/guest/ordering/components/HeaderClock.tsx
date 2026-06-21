import { useEffect, useState } from "react"
import Icon from "@/components/AppIcon"
import { formatClockDate, formatClockTime } from "./header.utils"

export const HeaderClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hidden items-center space-x-2 md:flex">
      <Icon name="Clock" size={16} className="text-primary" />
      <div className="flex flex-col">
        <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
          {formatClockTime(currentTime)}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatClockDate(currentTime)}
        </span>
      </div>
    </div>
  )
}
