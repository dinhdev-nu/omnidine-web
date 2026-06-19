import { useEffect, useReducer } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { getOwnerRestaurants } from "@/services/restaurants"
import type { OwnerRestaurantListItem } from "@/types/domain/restaurant"
import { useNavigate } from "react-router-dom"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import {
  MapPin,
  Mail,
  Phone,
  Store,
  Settings,
  Share2,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

type RestaurantTier = "Công khai" | "Bản nháp"

type RestaurantListState = {
  restaurants: OwnerRestaurantListItem[]
  isLoading: boolean
  error: string | null
  shareTarget: OwnerRestaurantListItem | null
  shareMode: "public" | "pos"
}

type RestaurantListAction =
  | { type: "loadStarted" }
  | { type: "loadSucceeded"; restaurants: OwnerRestaurantListItem[] }
  | { type: "loadFailed"; message: string }
  | { type: "openShare"; restaurant: OwnerRestaurantListItem }
  | { type: "closeShare" }
  | { type: "setShareMode"; mode: "public" | "pos" }

const tierColors: Record<RestaurantTier, string> = {
  "Công khai": "bg-primary/10 text-primary border-primary/25",
  "Bản nháp": "bg-muted text-muted-foreground border-border",
}

const initialRestaurantListState: RestaurantListState = {
  restaurants: [],
  isLoading: true,
  error: null,
  shareTarget: null,
  shareMode: "public",
}

const createdDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

function restaurantListReducer(
  state: RestaurantListState,
  action: RestaurantListAction
): RestaurantListState {
  switch (action.type) {
    case "loadStarted":
      return { ...state, isLoading: true, error: null }
    case "loadSucceeded":
      return { ...state, restaurants: action.restaurants, isLoading: false }
    case "loadFailed":
      return {
        ...state,
        restaurants: [],
        error: action.message,
        isLoading: false,
      }
    case "openShare":
      return {
        ...state,
        shareTarget: action.restaurant,
        shareMode: "public",
      }
    case "closeShare":
      return { ...state, shareTarget: null }
    case "setShareMode":
      return { ...state, shareMode: action.mode }
    default:
      return state
  }
}

function getRestaurantReadinessScore(restaurant: OwnerRestaurantListItem) {
  let score = 45

  if (restaurant.is_published) score += 25
  if (restaurant.accepts_online_orders) score += 20
  if (restaurant.email || restaurant.phone) score += 5
  if (restaurant.website) score += 5

  return Math.min(score, 100)
}

function getRestaurantTrend(
  restaurant: OwnerRestaurantListItem
): "up" | "down" | "stable" {
  if (restaurant.is_published && restaurant.accepts_online_orders) return "up"
  if (!restaurant.is_published && !restaurant.accepts_online_orders)
    return "down"
  return "stable"
}

function formatCreatedDate(value: string) {
  return createdDateFormatter.format(new Date(value))
}

function getHealthBarClass(score: number) {
  if (score >= 80) return "bg-primary"
  if (score >= 60) return "bg-amber-500"
  return "bg-destructive"
}

function getHealthTextClass(score: number) {
  if (score >= 80) return "text-primary"
  if (score >= 60) return "text-amber-600 dark:text-amber-400"
  return "text-destructive"
}

async function copyShareLink(url: string, label: string) {
  if (!url) return

  try {
    await navigator.clipboard.writeText(url)
    toast.success(`Đã sao chép liên kết ${label}`)
  } catch {
    toast.error("Không thể sao chép liên kết. Vui lòng thử lại.")
  }
}

function RestaurantSkeletonGrid() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={`restaurant-skeleton-${index}`}
          className="h-full animate-pulse border-border bg-card"
        >
          <CardContent className="flex h-full flex-col p-5">
            <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="min-w-0 space-y-2">
                  <div className="h-4 w-28 rounded bg-muted" />
                  <div className="h-3 w-20 rounded bg-muted" />
                </div>
              </div>
              <div className="h-6 w-20 rounded-full bg-muted" />
            </div>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-3 w-32 rounded bg-muted" />
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
              </div>
            </div>
            <div className="mt-auto space-y-4 border-t border-border pt-4">
              <div className="flex items-center justify-between gap-3">
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 flex-1 rounded border border-border bg-muted/40" />
                <div className="h-10 flex-1 rounded border border-border bg-muted/40" />
                <div className="h-10 w-10 rounded bg-muted/40" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

function RestaurantCard({
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

function ShareRestaurantDialog({
  shareTarget,
  shareMode,
  sharePublicUrl,
  sharePosUrl,
  onShareModeChange,
  onClose,
}: {
  shareTarget: OwnerRestaurantListItem | null
  shareMode: "public" | "pos"
  sharePublicUrl: string
  sharePosUrl: string
  onShareModeChange: (mode: "public" | "pos") => void
  onClose: () => void
}) {
  return (
    <Dialog
      open={Boolean(shareTarget)}
      onOpenChange={(isOpen) => !isOpen && onClose()}
    >
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Chia sẻ nhà hàng
          </DialogTitle>
          <DialogDescription>
            Có 2 liên kết chia sẻ: trang công khai và trang POS.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <Tabs
            value={shareMode}
            onValueChange={(value) =>
              onShareModeChange(value === "pos" ? "pos" : "public")
            }
          >
            <TabsList className="h-11 w-full gap-1 border border-border bg-secondary p-1">
              <TabsTrigger
                value="public"
                className="flex-1 data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                Công khai
              </TabsTrigger>
              <TabsTrigger
                value="pos"
                className="flex-1 data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                POS
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div
              className="flex w-[200%] transition-transform duration-300 ease-out"
              style={{
                transform:
                  shareMode === "public"
                    ? "translateX(0%)"
                    : "translateX(-50%)",
              }}
            >
              <div className="w-1/2 p-3">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Liên kết công khai
                </p>
                <div className="mb-3 flex justify-center rounded-lg border border-border bg-background p-3">
                  <QRCodeSVG value={sharePublicUrl} size={140} includeMargin />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={sharePublicUrl}
                    readOnly
                    aria-label="Liên kết công khai của nhà hàng"
                  />
                  <Button
                    variant="default"
                    onClick={() => copyShareLink(sharePublicUrl, "Công khai")}
                  >
                    Sao chép
                  </Button>
                </div>
              </div>

              <div className="w-1/2 border-l border-border p-3">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Liên kết POS
                </p>
                <div className="mb-3 flex justify-center rounded-lg border border-border bg-background p-3">
                  <QRCodeSVG value={sharePosUrl} size={140} includeMargin />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={sharePosUrl}
                    readOnly
                    aria-label="Liên kết POS của nhà hàng"
                  />
                  <Button
                    variant="default"
                    onClick={() => copyShareLink(sharePosUrl, "POS")}
                  >
                    Sao chép
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="default" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ListRestaurantsSection() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(
    restaurantListReducer,
    initialRestaurantListState
  )
  const { restaurants, isLoading, error, shareTarget, shareMode } = state

  const sharePublicUrl = shareTarget
    ? `${window.location.origin}/public/restaurants/${shareTarget.slug}/menu`
    : ""

  const sharePosUrl = shareTarget
    ? `${window.location.origin}/pos/${shareTarget.slug}`
    : ""

  useEffect(() => {
    let isActive = true

    async function loadRestaurants() {
      try {
        dispatch({ type: "loadStarted" })

        const response = await getOwnerRestaurants({ page: 1, limit: 10 })
        console.log("Đã tải danh sách nhà hàng:", response)
        if (!isActive) return

        dispatch({ type: "loadSucceeded", restaurants: response.data })
      } catch {
        if (!isActive) return

        dispatch({
          type: "loadFailed",
          message: "Không thể tải danh sách nhà hàng.",
        })
      }
    }

    loadRestaurants()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4 xl:gap-5">
        {isLoading && <RestaurantSkeletonGrid />}

        {!isLoading &&
          restaurants.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
              index={index}
              onOpenPos={(slug) => navigate(`/pos/${slug}`)}
              onOpenDashboard={(targetRestaurant) =>
                navigate(`/dashboard/${targetRestaurant._id}`, {
                  state: {
                    restaurant: {
                      _id: targetRestaurant._id,
                      name: targetRestaurant.name,
                      logo_url: targetRestaurant.logo_url,
                    },
                  },
                })
              }
              onShare={(targetRestaurant) =>
                dispatch({ type: "openShare", restaurant: targetRestaurant })
              }
            />
          ))}

        {!isLoading && restaurants.length === 0 && !error && (
          <div className="col-span-full rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            Chưa có nhà hàng nào.
          </div>
        )}
      </div>

      <ShareRestaurantDialog
        shareTarget={shareTarget}
        shareMode={shareMode}
        sharePublicUrl={sharePublicUrl}
        sharePosUrl={sharePosUrl}
        onShareModeChange={(mode) => dispatch({ type: "setShareMode", mode })}
        onClose={() => dispatch({ type: "closeShare" })}
      />
    </div>
  )
}
