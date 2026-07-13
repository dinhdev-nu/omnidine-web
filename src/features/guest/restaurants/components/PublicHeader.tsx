import { Bell, Building2, LogOut, Search, UserCircle } from "lucide-react"
import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { resolveUserAvatar } from "@/lib/avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import LocationSelector from "./LocationSelector"
import PublicHeaderSearch from "./PublicHeaderSearch"
import type { FeedLocationSelection, FeedUser } from "../types"

interface FeedHeaderProps {
  user: FeedUser | null
  onLocationChange?: (location: FeedLocationSelection) => void
  onLogout: () => Promise<void> | void
}

function getDisplayName(user: FeedUser | null): string {
  return user?.full_name ?? user?.user_name ?? "User"
}

function getAvatarUrl(user: FeedUser | null): string {
  return resolveUserAvatar(user)
}

function getInitials(user: FeedUser | null): string {
  const displayName = getDisplayName(user).trim()
  if (!displayName) return "U"

  return displayName
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
}

export default function FeedHeader({
  user,
  onLocationChange,
  onLogout,
}: FeedHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const mobileSearchButtonRef = useRef<HTMLButtonElement | null>(null)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
      <div className="mx-auto max-w-7xl pr-[calc(0.75rem+env(safe-area-inset-right))] pl-[calc(0.75rem+env(safe-area-inset-left))] sm:pr-[calc(1.5rem+env(safe-area-inset-right))] sm:pl-[calc(1.5rem+env(safe-area-inset-left))] lg:pr-[calc(2rem+env(safe-area-inset-right))] lg:pl-[calc(2rem+env(safe-area-inset-left))]">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            to="/"
            aria-label="Về trang chủ OmniDine"
            className="flex min-h-11 shrink-0 touch-manipulation items-center rounded-lg focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <img
              src="/assets/home/brand-logo.png"
              alt="OmniDine"
              width="686"
              height="134"
              className="h-5 w-auto object-contain sm:h-6"
            />
          </Link>

          <PublicHeaderSearch
            isOpen={isSearchOpen}
            onOpenChange={setIsSearchOpen}
            returnFocusRef={mobileSearchButtonRef}
          />

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              ref={mobileSearchButtonRef}
              type="button"
              aria-label="Tìm kiếm"
              aria-controls="mobile-public-search"
              aria-expanded={isSearchOpen}
              onClick={() => setIsSearchOpen((previous) => !previous)}
              className="flex size-11 touch-manipulation items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none lg:hidden"
            >
              <Search aria-hidden="true" className="size-5" />
            </button>

            <LocationSelector onLocationChange={onLocationChange} />

            <button
              type="button"
              aria-label="Thông báo chưa khả dụng"
              title="Thông báo chưa khả dụng"
              disabled
              className="relative flex size-11 touch-manipulation items-center justify-center rounded-full text-muted-foreground opacity-50 disabled:cursor-not-allowed"
            >
              <Bell aria-hidden="true" className="size-5" />
            </button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={`Mở menu tài khoản của ${getDisplayName(user)}`}
                    className="flex size-11 touch-manipulation items-center justify-center gap-2 rounded-full p-1 transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none md:w-auto md:max-w-44 md:justify-start md:px-2"
                  >
                    <Avatar>
                      <AvatarImage
                        src={getAvatarUrl(user)}
                        alt={getDisplayName(user)}
                      />
                      <AvatarFallback>{getInitials(user)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-28 min-w-0 truncate text-sm font-medium text-foreground md:block">
                      {getDisplayName(user)}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 overflow-hidden rounded-2xl border border-border bg-popover p-0 shadow-lg"
                >
                  <div className="border-b border-border p-4">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {getDisplayName(user)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email ?? "No email"}
                    </p>
                  </div>

                  <DropdownMenuGroup className="py-2">
                    <DropdownMenuLabel className="px-4 pt-0 pb-1 text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                      Tài khoản
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-foreground"
                      >
                        <UserCircle aria-hidden="true" />
                        <span>Hồ sơ</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/restaurants"
                        className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-foreground"
                      >
                        <Building2 aria-hidden="true" />
                        <span>Nhà hàng</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="mx-0 my-1 bg-border" />

                    <DropdownMenuItem
                      className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-red-600 focus:bg-red-50 focus:text-red-600"
                      onSelect={() => {
                        void onLogout()
                      }}
                    >
                      <LogOut aria-hidden="true" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
