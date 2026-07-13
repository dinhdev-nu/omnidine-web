import { useCallback, useEffect, useMemo, useState } from "react"
import {
    ArrowLeft,
    Building2,
    Clock3,
    Globe,
    MapPin,
    Phone,
    Share2,
    Store,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import AppImage from "@/components/AppImage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { GuestRestaurantsLayout } from "@/layouts/guest/GuestRestaurantsLayout"
import { logout as logoutApi } from "@/services/auth"
import { getPublicRestaurantBySlug } from "@/services/restaurants"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"
import type { DayKey, PublicRestaurantDetail } from "@/types/domain/restaurant"

const FALLBACK_RESTAURANT_IMAGE = "/assets/home/restaurant-placeholder.png"

const DAY_LABELS: Record<DayKey, string> = {
    mon: "Thứ 2",
    tue: "Thứ 3",
    wed: "Thứ 4",
    thu: "Thứ 5",
    fri: "Thứ 6",
    sat: "Thứ 7",
    sun: "Chủ nhật",
}

function formatPriceRange(priceRange: PublicRestaurantDetail["price_range"]) {
    if (!priceRange) return "Đang cập nhật"
    return "$".repeat(priceRange)
}

function formatOperatingHour(day: PublicRestaurantDetail["operating_hours"][DayKey]) {
    if (day.closed) return "Đóng cửa"
    return `${day.open} - ${day.close}`
}

function getStatusBadgeClass(isPublished: boolean) {
    return isPublished
        ? "border-success/40 bg-success text-white hover:bg-success"
        : "border-warning/40 bg-warning text-foreground hover:bg-warning"
}

function resolveTodayKey() {
    const jsDay = new Date().getDay()

    switch (jsDay) {
        case 0:
            return "sun"
        case 1:
            return "mon"
        case 2:
            return "tue"
        case 3:
            return "wed"
        case 4:
            return "thu"
        case 5:
            return "fri"
        default:
            return "sat"
    }
}

export default function GuestRestaurantDetailsPage() {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    const clearAuth = useAuthStore((state) => state.clearAuth)
    const clearUser = useUserStore((state) => state.clear)
    const profile = useUserStore((state) => state.profile)

    const [restaurant, setRestaurant] = useState<PublicRestaurantDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLinkCopied, setIsLinkCopied] = useState(false)

    const handleLogout = useCallback(async () => {
        try {
            await logoutApi()
        } catch {
            // Local session cleanup still completes when the remote logout endpoint is unavailable.
        } finally {
            clearAuth()
            clearUser()
            navigate("/auth", { replace: true })
        }
    }, [clearAuth, clearUser, navigate])

    useEffect(() => {
        let isActive = true

        const loadRestaurant = async () => {
            try {
                setIsLoading(true)

                if (!slug) {
                    navigate("/public/restaurants", { replace: true })
                    return
                }

                const response = await getPublicRestaurantBySlug(slug)
                if (!isActive) return

                setRestaurant(response)
            } catch {
                if (!isActive) return

                toast.error("Không thể tải thông tin nhà hàng")
                navigate("/public/restaurants", { replace: true })
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        loadRestaurant()

        return () => {
            isActive = false
        }
    }, [navigate, slug])

    const detail = restaurant

    const fullAddress = useMemo(() => {
        if (!detail) return ""
        return [detail.address, detail.ward, detail.district, detail.city].filter(Boolean).join(", ")
    }, [detail])

    const galleryImages = useMemo(() => {
        if (!detail) return []
        return Array.from(
            new Set(
                [detail.cover_image_url, detail.logo_url, ...detail.gallery_urls].filter(
                    (image): image is string => Boolean(image)
                )
            )
        )
    }, [detail])

    const todayKey = resolveTodayKey()
    const todayHour = detail?.operating_hours[todayKey]

    const handleCopyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setIsLinkCopied(true)
            window.setTimeout(() => setIsLinkCopied(false), 1400)
        } catch {
            toast.error("Không thể sao chép liên kết")
        }
    }, [])

    return (
        <GuestRestaurantsLayout
            user={profile}
            onLogout={handleLogout}
            showCreateFab={false}
            onOpenAttentionModal={() => undefined}
        >
            <div className="flex flex-col gap-4 pb-24 lg:pb-6">
                <Card className="sticky top-20 z-30 border border-border bg-card/95 shadow-sm backdrop-blur-sm">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="min-h-11"
                                    asChild
                                >
                                    <Link to="/public/restaurants">
                                        <ArrowLeft data-icon="inline-start" />
                                        Danh sách
                                    </Link>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                     size="lg"
                                     onClick={handleCopyLink}
                                     className="min-h-11"
                                 >
                                     <Share2 data-icon="inline-start" />
                                    {isLinkCopied ? "Đã sao chép" : "Chia sẻ"}
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                {detail?.phone ? (
                                    <Button variant="outline" size="lg" className="min-h-11" asChild>
                                        <a href={`tel:${detail.phone.replace(/\s+/g, "")}`}>
                                            <Phone data-icon="inline-start" />
                                            Gọi đặt món
                                        </a>
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="lg" className="min-h-11" disabled>
                                        <Phone data-icon="inline-start" />
                                        Gọi đặt món
                                    </Button>
                                )}
                                {detail?.accepts_online_orders && slug ? (
                                    <Button size="lg" className="min-h-11" asChild>
                                        <Link to={`/public/restaurants/${slug}/menu`}>
                                            <Store data-icon="inline-start" />
                                            Đặt món online
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button size="lg" className="min-h-11" disabled>
                                        <Store data-icon="inline-start" />
                                        Chưa hỗ trợ online
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {isLoading ? (
                    <div
                        role="status"
                        aria-live="polite"
                        aria-label="Đang tải chi tiết nhà hàng"
                        className="flex flex-col gap-4"
                    >
                        <div className="h-56 animate-pulse rounded-3xl bg-muted/40 motion-reduce:animate-none" />
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <div className="h-40 animate-pulse rounded-2xl bg-muted/40 motion-reduce:animate-none lg:col-span-2" />
                            <div className="h-40 animate-pulse rounded-2xl bg-muted/40 motion-reduce:animate-none" />
                        </div>
                    </div>
                ) : detail ? (
                    <>
                        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                            <Card className="relative overflow-hidden rounded-3xl border border-border bg-card lg:col-span-5">
                                <AppImage
                                     src={detail.cover_image_url ?? detail.logo_url ?? FALLBACK_RESTAURANT_IMAGE}
                                     alt={detail.name}
                                     width={1200}
                                     height={800}
                                     fetchPriority="high"
                                     className="h-[240px] w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    <Badge
                                        className={`mb-2 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm backdrop-blur-sm ${getStatusBadgeClass(detail.is_published)}`}
                                    >
                                        {detail.is_published ? "Đang hoạt động" : "Tạm ẩn"}
                                    </Badge>
                                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{detail.name}</h1>
                                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                        <Badge variant="outline" className="inline-flex items-center gap-1 rounded-full border-white/35 bg-black/25 px-2.5 py-1 font-medium text-white/95 backdrop-blur-sm">
                                            {detail.cuisine_type ?? "Đa dạng món"}
                                        </Badge>
                                        <Badge variant="outline" className="inline-flex items-center gap-1 rounded-full border-white/35 bg-black/25 px-2.5 py-1 font-medium text-white/95 backdrop-blur-sm">
                                            Mức giá: {formatPriceRange(detail.price_range)}
                                        </Badge>
                                        {detail.accepts_online_orders && (
                                            <Badge className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success px-2.5 py-1 font-semibold text-white shadow-sm hover:bg-success">
                                                Online
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-2xl border border-border bg-card lg:col-span-7">
                                <CardHeader className="pb-1">
                                    <CardTitle>Thông tin nhanh</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    <p className="text-sm leading-relaxed break-words text-muted-foreground">
                                        {detail.description ?? "Nhà hàng đang hoàn thiện thông tin chi tiết."}
                                    </p>

                                    <Separator />

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div className="flex items-start gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground">
                                            <MapPin className="mt-0.5 size-4 shrink-0 text-destructive" />
                                            <span className="min-w-0 break-words">{fullAddress}</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground">
                                            <Phone className="size-4 shrink-0" />
                                            <span className="truncate">{detail.phone ?? "Đang cập nhật"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground">
                                            <Building2 className="size-4 shrink-0" />
                                            <span className="min-w-0 break-words">{detail.email ?? "Đang cập nhật"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground">
                                            <Globe className="size-4 shrink-0" />
                                            <span className="min-w-0 break-words">{detail.website ?? "Đang cập nhật"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                            <Card className="rounded-2xl border border-border bg-card lg:col-span-7">
                                <CardHeader className="pb-1">
                                    <CardTitle>Giờ mở cửa</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-3 rounded-xl border border-border bg-background px-3 py-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                                                <Clock3 className="size-4" />
                                                Hôm nay ({DAY_LABELS[todayKey]})
                                            </span>
                                            <span className="font-semibold text-foreground">
                                                {todayHour ? formatOperatingHour(todayHour) : "Đang cập nhật"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                        {(Object.keys(DAY_LABELS) as DayKey[]).map((dayKey) => (
                                            <div
                                                key={dayKey}
                                                className="flex items-center justify-between rounded-lg border border-border/60 px-2.5 py-2 text-sm text-muted-foreground"
                                            >
                                                <span>{DAY_LABELS[dayKey]}</span>
                                                <span>{formatOperatingHour(detail.operating_hours[dayKey])}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl border border-border bg-card lg:col-span-5">
                                <CardHeader className="pb-1">
                                    <CardTitle>Hình ảnh nổi bật</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {galleryImages.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">Nhà hàng chưa thêm hình ảnh.</p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            {galleryImages.slice(0, 4).map((image, index) => (
                                                <AppImage
                                                    key={`${image}-${index}`}
                                                     src={image}
                                                     alt={`${detail.name} ${index + 1}`}
                                                     width={600}
                                                     height={400}
                                                     loading="lazy"
                                                     className="h-28 w-full rounded-xl border border-border object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </section>
                    </>
                ) : null}
            </div>
        </GuestRestaurantsLayout>
    )
}
