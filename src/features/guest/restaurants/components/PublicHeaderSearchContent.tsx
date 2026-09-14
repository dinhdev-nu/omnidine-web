import { ChevronRight, Clock3, Search, Store } from "lucide-react"
import { Link } from "react-router-dom"

import AppImage from "@/components/AppImage"
import { cn } from "@/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PublicRestaurantSearchItem } from "@/types/domain/restaurant"
import {
  MOCK_PROVINCES,
  PRICE_RANGES,
  cuisineTypes,
  type SelectOption,
} from "@/features/restaurant-onboarding/constants"
import type { SearchFilters } from "./public-header-search-types"

const FALLBACK_RESTAURANT_IMAGE = "/assets/home/restaurant-placeholder.png"

type PublicHeaderSearchContentProps = {
  layout?: "dropdown" | "fullscreen"
  searchQuery: string
  searchFilters: SearchFilters
  isSearchLoading: boolean
  searchError: string | null
  searchResults: PublicRestaurantSearchItem[]
  isLocating: boolean
  onSelectRestaurant: (restaurant: PublicRestaurantSearchItem) => void
  onUseCurrentLocation: () => void
  onClearLocation: () => void
  onFilterChange: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => void
  onSelectOpenChange: (open: boolean) => void
}

export default function PublicHeaderSearchContent({
  layout = "dropdown",
  searchQuery,
  searchFilters,
  isSearchLoading,
  searchError,
  searchResults,
  isLocating,
  onSelectRestaurant,
  onUseCurrentLocation,
  onClearLocation,
  onFilterChange,
  onSelectOpenChange,
}: PublicHeaderSearchContentProps) {
  const searchFiltersPanel = (
    <div className="flex flex-col gap-3 border-b border-border/70 p-3">
      <div className="flex flex-wrap gap-2">
        {searchFilters.lat !== null && searchFilters.lng !== null ? (
          <span className="inline-flex min-h-8 items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Đang dùng vị trí hiện tại
          </span>
        ) : (
          <span className="inline-flex min-h-8 items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Chưa dùng vị trí hiện tại
          </span>
        )}

        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          className="min-h-11 touch-manipulation rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50"
        >
          {isLocating ? "Đang lấy vị trí…" : "Dùng vị trí hiện tại"}
        </button>

        {(searchFilters.lat !== null || searchFilters.lng !== null) && (
          <button
            type="button"
            onClick={onClearLocation}
            className="min-h-11 touch-manipulation rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Xóa vị trí
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-1 text-xs">
          <span
            id="public-search-city-label"
            className="font-medium text-muted-foreground"
          >
            City
          </span>
          <Select
            value={searchFilters.city}
            onValueChange={(value) => onFilterChange("city", value)}
            onOpenChange={onSelectOpenChange}
          >
            <SelectTrigger
              aria-labelledby="public-search-city-label"
              size="sm"
              className="h-11 w-full rounded-xl border-border bg-background px-3 text-sm text-foreground data-[size=sm]:h-11"
            >
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={6}
              className="min-w-[12rem]"
            >
              <SelectGroup>
                {MOCK_PROVINCES.map((province: SelectOption) => (
                  <SelectItem key={province.code} value={province.name}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-0 flex-col gap-1 text-xs">
          <span
            id="public-search-cuisine-label"
            className="font-medium text-muted-foreground"
          >
            Cuisine
          </span>
          <Select
            value={searchFilters.cuisine_type}
            onValueChange={(value) => onFilterChange("cuisine_type", value)}
            onOpenChange={onSelectOpenChange}
          >
            <SelectTrigger
              aria-labelledby="public-search-cuisine-label"
              size="sm"
              className="h-11 w-full rounded-xl border-border bg-background px-3 text-sm text-foreground data-[size=sm]:h-11"
            >
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={6}
              className="min-w-[12rem]"
            >
              <SelectGroup>
                {cuisineTypes.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-0 flex-col gap-1 text-xs">
          <span
            id="public-search-price-label"
            className="font-medium text-muted-foreground"
          >
            Price
          </span>
          <ToggleGroup
            aria-labelledby="public-search-price-label"
            type="multiple"
            value={searchFilters.price_range}
            onValueChange={(value) => onFilterChange("price_range", value)}
            variant="outline"
            size="sm"
            spacing={0}
            className="grid w-full grid-cols-4 overflow-hidden rounded-xl border border-border bg-background"
          >
            {PRICE_RANGES.map((priceRange) => (
              <ToggleGroupItem
                key={priceRange}
                value={String(priceRange)}
                className="h-11 flex-1 rounded-none border-0 text-xs font-semibold text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {"$".repeat(priceRange)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex min-w-0 flex-col gap-1 text-xs">
          <span
            id="public-search-online-label"
            className="font-medium text-muted-foreground"
          >
            Online
          </span>
          <Select
            value={
              searchFilters.accepts_online === null
                ? "__all__"
                : searchFilters.accepts_online
                  ? "true"
                  : "false"
            }
            onValueChange={(value) =>
              onFilterChange(
                "accepts_online",
                value === "__all__" ? null : value === "true"
              )
            }
            onOpenChange={onSelectOpenChange}
          >
            <SelectTrigger
              aria-labelledby="public-search-online-label"
              size="sm"
              className="h-11 w-full rounded-xl border-border bg-background px-3 text-sm text-foreground data-[size=sm]:h-11"
            >
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={6}
              className="min-w-[12rem]"
            >
              <SelectGroup>
                <SelectItem value="__all__">Tất cả</SelectItem>
                <SelectItem value="true">Có</SelectItem>
                <SelectItem value="false">Không</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-0 flex-col gap-1 text-xs">
          <span
            id="public-search-radius-label"
            className="font-medium text-muted-foreground"
          >
            Radius
          </span>
          <Select
            value={searchFilters.radius_km}
            onValueChange={(value) => onFilterChange("radius_km", value)}
            onOpenChange={onSelectOpenChange}
          >
            <SelectTrigger
              aria-labelledby="public-search-radius-label"
              size="sm"
              className="h-11 w-full rounded-xl border-border bg-background px-3 text-sm text-foreground data-[size=sm]:h-11"
            >
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={6}
              className="min-w-[12rem]"
            >
              <SelectGroup>
                <SelectItem value="1">1 km</SelectItem>
                <SelectItem value="3">3 km</SelectItem>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-0 flex-col gap-1 text-xs">
          <span
            id="public-search-sort-label"
            className="font-medium text-muted-foreground"
          >
            Sort
          </span>
          <Select
            value={searchFilters.sort}
            onValueChange={(value) =>
              onFilterChange("sort", value === "distance" ? "distance" : "name")
            }
            onOpenChange={onSelectOpenChange}
          >
            <SelectTrigger
              aria-labelledby="public-search-sort-label"
              size="sm"
              className="h-11 w-full rounded-xl border-border bg-background px-3 text-sm text-foreground data-[size=sm]:h-11"
            >
              <SelectValue placeholder="Name" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={6}
              className="min-w-[12rem]"
            >
              <SelectGroup>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const hasQuery = searchQuery.trim().length > 0

  return (
    <>
      {searchFiltersPanel}

      <div
        aria-live="polite"
        aria-busy={isSearchLoading}
        className={cn(
          "p-2",
          layout === "fullscreen"
            ? "overflow-visible"
            : "max-h-[24rem] overflow-auto overscroll-contain"
        )}
      >
        {isSearchLoading && (
          <div className="flex flex-col gap-2 p-2" role="status">
            <span className="sr-only">Đang tải kết quả…</span>
            <div className="h-16 animate-pulse rounded-xl bg-muted/50 motion-reduce:animate-none" />
            <div className="h-16 animate-pulse rounded-xl bg-muted/50 motion-reduce:animate-none" />
            <div className="h-16 animate-pulse rounded-xl bg-muted/50 motion-reduce:animate-none" />
          </div>
        )}

        {!isSearchLoading && searchError && (
          <div className="rounded-xl bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {searchError}
          </div>
        )}

        {!isSearchLoading &&
          !searchError &&
          searchResults.length > 0 &&
          searchResults.map((restaurant) => {
            const image =
              restaurant.cover_image_url ??
              restaurant.logo_url ??
              FALLBACK_RESTAURANT_IMAGE
            const location =
              [restaurant.district, restaurant.city]
                .filter(Boolean)
                .join(", ") || restaurant.city

            return (
              <Link
                key={restaurant._id}
                to={`/public/restaurants/${restaurant.slug}`}
                onClick={() => onSelectRestaurant(restaurant)}
                className="flex min-h-16 w-full touch-manipulation items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none"
              >
                <AppImage
                  src={image}
                  alt={restaurant.name}
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {restaurant.name}
                    </p>
                    {restaurant.accepts_online_orders && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                        Online
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {location}
                  </p>
                  <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex min-w-0 items-center gap-1">
                      <Store aria-hidden="true" className="size-3.5 shrink-0" />
                      <span className="truncate">
                        {restaurant.cuisine_type ?? "Nhà hàng"}
                      </span>
                    </span>
                    <span aria-hidden="true">•</span>
                    <span className="hidden shrink-0 items-center gap-1 min-[360px]:inline-flex">
                      <Clock3 aria-hidden="true" className="size-3.5" />
                      Xem chi tiết
                    </span>
                  </div>
                </div>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </Link>
            )
          })}

        {!isSearchLoading && !searchError && searchResults.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
            <Search
              aria-hidden="true"
              className="size-10 text-muted-foreground/70"
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                {hasQuery
                  ? "Không tìm thấy nhà hàng"
                  : "Nhập từ khóa để tìm kiếm"}
              </p>
              <p className="text-xs text-muted-foreground">
                {hasQuery
                  ? "Thử đổi từ khóa khác"
                  : "Gõ tên nhà hàng, món ăn hoặc khu vực"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
