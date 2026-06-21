import { toast } from "sonner"
import type { OwnerRestaurantListItem } from "@/types/domain/restaurant"
import type { RestaurantTier } from "../../list-restaurants.state"

export const tierColors: Record<RestaurantTier, string> = {
  "Công khai": "bg-primary/10 text-primary border-primary/25",
  "Bản nháp": "bg-muted text-muted-foreground border-border",
}

const createdDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

export function getRestaurantReadinessScore(
  restaurant: OwnerRestaurantListItem
) {
  let score = 45

  if (restaurant.is_published) score += 25
  if (restaurant.accepts_online_orders) score += 20
  if (restaurant.email || restaurant.phone) score += 5
  if (restaurant.website) score += 5

  return Math.min(score, 100)
}

export function getRestaurantTrend(
  restaurant: OwnerRestaurantListItem
): "up" | "down" | "stable" {
  if (restaurant.is_published && restaurant.accepts_online_orders) return "up"
  if (!restaurant.is_published && !restaurant.accepts_online_orders)
    return "down"
  return "stable"
}

export function formatCreatedDate(value: string) {
  return createdDateFormatter.format(new Date(value))
}

export function getHealthBarClass(score: number) {
  if (score >= 80) return "bg-primary"
  if (score >= 60) return "bg-amber-500"
  return "bg-destructive"
}

export function getHealthTextClass(score: number) {
  if (score >= 80) return "text-primary"
  if (score >= 60) return "text-amber-600 dark:text-amber-400"
  return "text-destructive"
}

export async function copyShareLink(url: string, label: string) {
  if (!url) return

  try {
    await navigator.clipboard.writeText(url)
    toast.success(`Đã sao chép liên kết ${label}`)
  } catch {
    toast.error("Không thể sao chép liên kết. Vui lòng thử lại.")
  }
}
