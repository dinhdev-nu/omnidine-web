import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { OwnerRestaurantListItem } from "@/types/domain/restaurant"
import {
  Mail,
  MapPin,
  Phone,
  Settings,
  Share2,
  Store,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import type { RestaurantTier } from "../../list-restaurants.state"
import {
  formatCreatedDate,
  getHealthBarClass,
  getHealthTextClass,
  getRestaurantReadinessScore,
  getRestaurantTrend,
  tierColors,
} from "./list-restaurants.utils"

export function RestaurantCard({
  restaurant,
  index,
  onOpenPos,
  onOpenDashboard,
  onShare,
}: {
  restaurant: OwnerRestaurantListItem
  index: number
  onOpenPos: (slug: string) => void
  onOpenDashboard: (restaurant: OwnerRestaurantListItem) => void
  onShare: (restaurant: OwnerRestaurantListItem) => void
}) {
  const readinessScore = getRestaurantReadinessScore(restaurant)
  const trend = getRestaurantTrend(restaurant)
  const tier: RestaurantTier = restaurant.is_published
    ? "Công khai"
    : "Bản nháp"
  const needsVerification =
    !restaurant.is_published || !restaurant.accepts_online_orders

  return (
    <Card
      className="group h-full animate-in border-border bg-card transition-colors duration-200 fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <CardContent className="flex h-full flex-col p-5">
        <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage
                src={restaurant.logo_url ?? undefined}
                alt={restaurant.name}
              />
              <AvatarFallback className="bg-secondary text-sm font-semibold text-foreground">
                {restaurant.name
                  .split(" ")
                  .map((namePart) => namePart[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
                {restaurant.name}
              </h3>
              <p className="truncate text-sm text-muted-foreground">
                {restaurant.cuisine_type ?? "Chưa phân loại"}
              </p>
            </div>
          </div>
          <Badge className={`${tierColors[tier]} shrink-0 border`}>
            {tier === "Công khai" ? "Công khai" : "Chưa công khai"}
          </Badge>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{restaurant.city}</span>
            </div>
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">
                {restaurant.email ?? "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span className="truncate">
                {restaurant.phone ?? "Chưa cập nhật"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Slug</span>
              <span className="font-medium text-foreground tabular-nums">
                {restaurant.slug}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Đơn hàng trực tuyến</span>
              <span className="font-medium text-foreground tabular-nums">
                {restaurant.accepts_online_orders ? "Bật" : "Tắt"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Tạo lúc</span>
              <span className="font-medium text-foreground">
                {formatCreatedDate(restaurant.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Điểm sẵn sàng</span>
            {trend === "up" && (
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
            )}
            {trend === "down" && (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-700 ease-out",
                  getHealthBarClass(readinessScore)
                )}
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                getHealthTextClass(readinessScore)
              )}
            >
              {readinessScore}%
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            className="h-10 flex-1 bg-transparent"
            onClick={() => onOpenPos(restaurant.slug)}
          >
            <Store className="mr-1.5 h-3.5 w-3.5" />
            Bán hàng
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 flex-1 bg-transparent"
            onClick={() => onOpenDashboard(restaurant)}
            title={
              needsVerification
                ? "Xác nhận nhà hàng: bật đặt hàng và công khai cho khách"
                : "Mở trang quản lý"
            }
          >
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            {needsVerification ? "Quản lý xác nhận" : "Quản lý"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Chia sẻ ${restaurant.name}`}
            onClick={() => onShare(restaurant)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
