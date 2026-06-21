import type { OrderingNotification } from "../types"

export const DEFAULT_RESTAURANT_LOGO = "/assets/images/restaurant_logo.png"

export const EMPTY_NOTIFICATIONS: OrderingNotification[] = []

export const formatClockTime = (date: Date) => {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export const formatClockDate = (date: Date) => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
  const dayName = days[date.getDay()]
  return `${dayName}, ${date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}`
}

export const getNotificationIcon = (type: OrderingNotification["type"]) => {
  switch (type) {
    case "warning":
      return "AlertTriangle"
    case "success":
      return "CheckCircle"
    case "error":
      return "XCircle"
    default:
      return "Info"
  }
}

export const getNotificationColor = (type: OrderingNotification["type"]) => {
  switch (type) {
    case "warning":
      return "text-warning"
    case "success":
      return "text-success"
    case "error":
      return "text-error"
    default:
      return "text-primary"
  }
}

export const formatNotificationTime = (isoString: string) => {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "Vừa xong"
  if (diffMins < 60) return `${diffMins} phút trước`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} ngày trước`
}
