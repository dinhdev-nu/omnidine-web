import {
  Bell,
  CirclePlus,
  Compass,
  LogOut,
  Shield,
  Store,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import { type ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"

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
import { AUTH_ROUTE_PATHS } from "@/features/auth/constants"
import { ACCOUNT_SECTION_PATHS } from "@/features/settings/account"
import { RESTAURANT_ONBOARDING_ROUTE_PATH } from "@/routes/restaurant-onboarding-route-config"
import { GUEST_RESTAURANTS_ROUTE_PATH } from "@/routes/guest-restaurants-routes"
import { logout } from "@/services/auth"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"

const OWNER_RESTAURANTS_PATH = "/settings/manage/restaurants"
const MENU_ITEM_CLASS = "min-h-11 cursor-pointer gap-2 rounded-md px-2 py-2 font-medium"
const MENU_LABEL_CLASS = "px-2 py-1 text-xs font-medium text-muted-foreground"

function getInitials(fullName: string | undefined | null): string {
  if (!fullName?.trim()) return "?"

  const parts = fullName.trim().split(/\s+/)

  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
}

interface AccountMenuLinkProps {
  children: ReactNode
  icon: LucideIcon
  to: string
}

function AccountMenuLink({ children, icon: Icon, to }: AccountMenuLinkProps) {
  return (
    <DropdownMenuItem asChild className={MENU_ITEM_CLASS}>
      <Link to={to}>
        <Icon />
        <span>{children}</span>
      </Link>
    </DropdownMenuItem>
  )
}

export function AccountMenu() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const clearUser = useUserStore((state) => state.clear)
  const profile = useUserStore((state) => state.profile)
  const initials = getInitials(profile?.full_name)

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Continue local logout even when API call fails.
    }

    clearAuth()
    clearUser()
    navigate(AUTH_ROUTE_PATHS.login, { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-11 touch-manipulation items-center justify-center rounded-full bg-secondary text-foreground ring-1 ring-border/60 transition-[background-color,box-shadow,color] duration-200 motion-reduce:transition-none hover:bg-secondary/80 hover:ring-border focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none data-[state=open]:bg-secondary data-[state=open]:ring-border"
          aria-label="Mở menu tài khoản"
        >
          <Avatar className="size-8">
            <AvatarImage
              src={profile?.avatar_url ?? undefined}
              alt={profile?.full_name ?? "Người dùng"}
            />
            <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-lg border-border bg-popover p-1.5 shadow-md"
      >
        <DropdownMenuLabel className="flex items-center gap-3 rounded-md px-2 py-2 text-foreground">
          <Avatar className="size-9">
            <AvatarImage
              src={profile?.avatar_url ?? undefined}
              alt={profile?.full_name ?? "Người dùng"}
            />
            <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm font-semibold text-foreground">
              {profile?.full_name ?? "Tài khoản"}
            </span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {profile?.email ?? "Chưa có email"}
            </span>
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className={MENU_LABEL_CLASS}>
            Nhà hàng
          </DropdownMenuLabel>
          <AccountMenuLink icon={Compass} to={GUEST_RESTAURANTS_ROUTE_PATH}>
            Khám phá nhà hàng
          </AccountMenuLink>
          <AccountMenuLink icon={Store} to={OWNER_RESTAURANTS_PATH}>
            Nhà hàng của bạn
          </AccountMenuLink>
          <AccountMenuLink icon={CirclePlus} to={RESTAURANT_ONBOARDING_ROUTE_PATH}>
            Đăng ký đối tác
          </AccountMenuLink>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className={MENU_LABEL_CLASS}>
            Tài khoản
          </DropdownMenuLabel>
          <AccountMenuLink icon={UserRound} to={ACCOUNT_SECTION_PATHS.profile}>
            Hồ sơ
          </AccountMenuLink>
          <AccountMenuLink icon={Bell} to={ACCOUNT_SECTION_PATHS.notifications}>
            Thông báo
          </AccountMenuLink>
          <AccountMenuLink icon={Shield} to={ACCOUNT_SECTION_PATHS.security}>
            Bảo mật
          </AccountMenuLink>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className={MENU_ITEM_CLASS}
            variant="destructive"
            onSelect={() => void handleLogout()}
          >
            <LogOut />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
