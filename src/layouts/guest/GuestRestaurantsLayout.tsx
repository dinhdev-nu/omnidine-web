import type { PropsWithChildren } from "react"
import { CircleUserRound, Heart, Home, Plus, Search, Store } from "lucide-react"
import { Link } from "react-router-dom"

import type {
  FeedLocationSelection,
  FeedUser,
} from "@/features/guest/restaurants"
import { FeedHeader } from "@/features/guest/restaurants"
import { cn } from "@/lib/utils"

interface GuestRestaurantsLayoutProps extends PropsWithChildren {
  user: FeedUser | null
  onLocationChange?: (location: FeedLocationSelection) => void
  onLogout: () => Promise<void> | void
  showCreateFab: boolean
  onOpenAttentionModal: () => void
}

export function GuestRestaurantsLayout({
  user,
  onLocationChange,
  onLogout,
  showCreateFab,
  onOpenAttentionModal,
  children,
}: GuestRestaurantsLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#guest-restaurants-content"
        className="sr-only fixed top-4 left-4 z-[60] min-h-11 rounded-lg bg-background px-4 py-2 text-foreground shadow-lg focus:not-sr-only focus:inline-flex focus:items-center"
      >
        Chuyển đến nội dung chính
      </a>

      <FeedHeader
        user={user}
        onLocationChange={onLocationChange}
        onLogout={onLogout}
      />

      <main
        id="guest-restaurants-content"
        tabIndex={-1}
        className="mx-auto max-w-7xl pt-4 pr-[calc(0.75rem+env(safe-area-inset-right))] pb-[calc(7rem+env(safe-area-inset-bottom))] pl-[calc(0.75rem+env(safe-area-inset-left))] sm:pt-6 sm:pr-[calc(1.5rem+env(safe-area-inset-right))] sm:pl-[calc(1.5rem+env(safe-area-inset-left))] lg:pr-[calc(2rem+env(safe-area-inset-right))] lg:pb-8 lg:pl-[calc(2rem+env(safe-area-inset-left))]"
      >
        {children}
      </main>

      <nav
        aria-label="Điều hướng chính"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-[env(safe-area-inset-left)] pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
      >
        <div className="grid grid-cols-4 px-2 py-2">
          <Link
            to="/public/restaurants"
            aria-current="page"
            className="flex min-h-14 min-w-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-xl px-1 transition-colors hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-10">
              <Home aria-hidden="true" className="size-5" />
            </div>
            <span className="max-w-full truncate text-[11px] font-medium text-foreground sm:text-xs">
              Trang chủ
            </span>
          </Link>
          <button
            type="button"
            disabled
            title="Tìm kiếm nhanh chưa khả dụng"
            className="flex min-h-14 min-w-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-xl px-1 opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-secondary sm:size-10">
              <Search
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </div>
            <span className="max-w-full truncate text-[11px] text-muted-foreground sm:text-xs">
              Tìm kiếm
            </span>
          </button>
          <button
            type="button"
            disabled
            title="Danh sách yêu thích chưa khả dụng"
            className="flex min-h-14 min-w-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-xl px-1 opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-secondary sm:size-10">
              <Heart
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </div>
            <span className="max-w-full truncate text-[11px] text-muted-foreground sm:text-xs">
              Yêu thích
            </span>
          </button>
          <Link
            to="/profile"
            className="flex min-h-14 min-w-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-xl px-1 transition-colors hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-secondary sm:size-10">
              <CircleUserRound
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </div>
            <span className="max-w-full truncate text-[11px] text-muted-foreground sm:text-xs">
              Cá nhân
            </span>
          </Link>
        </div>
      </nav>

      <button
        type="button"
        onClick={onOpenAttentionModal}
        aria-label="Tạo nhà hàng"
        aria-hidden={!showCreateFab}
        tabIndex={showCreateFab ? 0 : -1}
        className={cn(
          "group fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-40 touch-manipulation rounded-full transition-[transform,opacity] duration-300 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none lg:hidden",
          showCreateFab
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-20 opacity-0"
        )}
      >
        <div className="relative">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none">
            <Store aria-hidden="true" className="size-6" />
          </div>

          <div className="absolute -top-1 -right-1 flex size-5 animate-pulse items-center justify-center rounded-full bg-primary text-primary-foreground motion-reduce:animate-none">
            <Plus aria-hidden="true" className="size-3" />
          </div>

          <div className="pointer-events-none absolute top-1/2 right-full mr-3 hidden -translate-y-1/2 whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none sm:block">
            <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs font-medium text-popover-foreground shadow-lg">
              Tạo nhà hàng
              <div className="absolute top-1/2 right-0 h-2 w-2 translate-x-1/2 -translate-y-1/2 rotate-45 border-t border-r border-border bg-popover" />
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}
