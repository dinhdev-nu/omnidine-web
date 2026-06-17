import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "@/components/AppIcon"
import Button from "@/features/pos/components/Button"
import { AUTH_ROUTE_PATHS } from "@/features/auth/constants"
import { ACCOUNT_SECTION_PATHS } from "@/features/settings/account"
import { PUBLIC_RESTAURANTS_ROUTE_PATH } from "@/routes/public-restaurants-route"
import { logout as logoutApi } from "@/services/auths"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"

import type { OrderingNotification, OrderingUser } from "../types"

const DEFAULT_RESTAURANT_LOGO = "/assets/images/restaurant_logo.png"
import { resolveUserAvatar } from "@/lib/avatar"

const HeaderClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    const dayName = days[date.getDay()]
    return `${dayName}, ${date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })}`
  }

  return (
    <div className="hidden items-center space-x-2 md:flex">
      <Icon name="Clock" size={16} className="text-primary" />
      <div className="flex flex-col">
        <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
          {formatTime(currentTime)}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDate(currentTime)}
        </span>
      </div>
    </div>
  )
}

interface HeaderProps {
  isOperational?: boolean
  notifications?: OrderingNotification[]
  user?: OrderingUser | null
  restaurantName?: string | null
  restaurantLogo?: string | null
  restaurantSlug?: string | null
}

const Header = ({
  isOperational = true,
  notifications = [],
  user = null,
  restaurantName: restaurantNameProp = null,
  restaurantLogo: restaurantLogoProp = null,
  restaurantSlug = null,
}: HeaderProps) => {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const clearUser = useUserStore((state) => state.clear)

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const displayStoreName = restaurantNameProp || "Nhà hàng"
  const restaurantDetailPath = restaurantSlug
    ? `/public/restaurants/${restaurantSlug}`
    : "/public/restaurants"
  const [brokenRestaurantLogo, setBrokenRestaurantLogo] = useState<
    string | null
  >(null)
  const [brokenUserAvatar, setBrokenUserAvatar] = useState<string | null>(null)

  // User info with fallback - Map API data correctly
  const {
    isGuest,
    avatar: userAvatar,
    name: userName,
  } = useMemo(
    () => ({
      isGuest: !user,
      avatar: resolveUserAvatar(user),
      name: user?.full_name || user?.user_name || "Khách lạ",
    }),
    [user]
  )

  const originalRestaurantLogo = restaurantLogoProp || DEFAULT_RESTAURANT_LOGO
  const restaurantLogo =
    brokenRestaurantLogo === originalRestaurantLogo
      ? DEFAULT_RESTAURANT_LOGO
      : originalRestaurantLogo
  const userAvatarSrc =
    brokenUserAvatar === userAvatar ? "/assets/home/iVBORw0KGg.png" : userAvatar

  const formatNotificationTime = (isoString: string) => {
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

  const handleLogout = async () => {
    setShowUserMenu(false)

    try {
      // Call API logout
      await logoutApi()

      // Clear all localStorage and Zustand store
      clearAuth()
      clearUser()

      // Navigate to auth page
      navigate("/auth")
    } catch {
      // Even if API fails, still logout locally
      clearAuth()
      clearUser()
      navigate("/auth")
    }
  }

  const handleUserMenuNavigate = (path: string) => {
    setShowUserMenu(false)
    navigate(path)
  }

  const getNotificationIcon = (type: OrderingNotification["type"]) => {
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

  const getNotificationColor = (type: OrderingNotification["type"]) => {
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

  return (
    <header className="fixed top-0 right-0 left-0 z-[1100] h-16 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between px-2 sm:px-4 lg:px-8 xl:px-16">
        {/* Left Section - Logo and Store Name */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Logo and Store Name */}
          <button
            type="button"
            onClick={() => navigate(restaurantDetailPath)}
            className="flex cursor-pointer items-center space-x-2 sm:space-x-3"
            aria-label={`Mở trang chi tiết ${displayStoreName}`}
          >
            <img
              src={restaurantLogo}
              alt={displayStoreName}
              className="h-8 w-8 flex-shrink-0 rounded-lg border border-border/30 object-cover sm:h-10 sm:w-10"
              onError={(event) => {
                event.currentTarget.onerror = null
                setBrokenRestaurantLogo(originalRestaurantLogo)
              }}
            />

            <div>
              <h1 className="max-w-[100px] truncate text-sm font-semibold text-foreground sm:max-w-[200px] sm:text-base lg:max-w-none lg:text-lg">
                {displayStoreName}
              </h1>
            </div>
          </button>
        </div>

        {/* Right Section - Status, Notifications, User */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {/* Center Section - Real-time Clock */}
          <HeaderClock />

          {/* Operational Status Toggle */}
          <div className="flex items-center space-x-2">
            <span className="hidden text-sm text-muted-foreground xl:inline">
              Trạng thái:
            </span>
            <Button
              variant={isOperational ? "success" : "secondary"}
              size="sm"
              iconName={isOperational ? "Play" : "Pause"}
              iconPosition="left"
              className="hover-scale"
              disabled
            >
              <span className="hidden sm:inline">
                {isOperational ? "Mở cửa" : "Đóng cửa"}
              </span>
              <span className="sm:hidden">{isOperational ? "Mở" : "Đóng"}</span>
            </Button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
            >
              <Icon name="Bell" size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-white">
                  {notifications.length > 99 ? "99+" : notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="shadow-modal fixed top-20 right-2 left-2 z-1150 w-auto rounded-lg border border-border bg-popover sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2 sm:w-80">
                <div className="border-b border-border p-4">
                  <h3 className="font-medium text-popover-foreground">
                    Thông báo
                  </h3>
                  {notifications.length > 0 && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {notifications.length} thông báo mới
                    </p>
                  )}
                </div>
                <div className="max-h-[60vh] overflow-y-auto sm:max-h-64">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Icon
                        name="Bell"
                        size={32}
                        className="mx-auto mb-2 text-muted-foreground"
                      />
                      <p className="text-sm text-muted-foreground">
                        Không có thông báo mới
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification?.id}
                        className="transition-smooth border-b border-border p-4 last:border-b-0 hover:bg-muted/50"
                      >
                        <div className="flex items-start space-x-3">
                          <Icon
                            name={getNotificationIcon(notification?.type)}
                            size={16}
                            className={getNotificationColor(notification?.type)}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-popover-foreground">
                              {notification?.message}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatNotificationTime(notification?.time)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications?.length > 0 && (
                  <div className="border-t border-border p-3">
                    <Button variant="ghost" size="sm" fullWidth>
                      Đánh dấu tất cả đã đọc
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="hover-scale flex items-center space-x-2"
            >
              {userAvatarSrc ? (
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-border/50">
                  <img
                    src={userAvatarSrc}
                    alt={userName}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      setBrokenUserAvatar(userAvatar)
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <Icon name="User" size={16} color="white" />
                </div>
              )}
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-foreground">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isGuest ? "Chưa đăng nhập" : "Người dùng"}
                </p>
              </div>
            </Button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="shadow-modal fixed top-20 right-2 left-2 z-1150 w-auto rounded-lg border border-border bg-popover sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2 sm:w-48">
                <div className="p-2">
                  {isGuest ? (
                    // Guest Menu
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        iconName="Search"
                        iconPosition="left"
                        className="justify-start"
                        onClick={() =>
                          handleUserMenuNavigate(PUBLIC_RESTAURANTS_ROUTE_PATH)
                        }
                      >
                        Tìm nhà hàng
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        iconName="LogIn"
                        iconPosition="left"
                        className="justify-start"
                        onClick={() =>
                          handleUserMenuNavigate(AUTH_ROUTE_PATHS.login)
                        }
                      >
                        Đăng nhập
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        iconName="UserPlus"
                        iconPosition="left"
                        className="justify-start"
                        onClick={() =>
                          handleUserMenuNavigate(AUTH_ROUTE_PATHS.register)
                        }
                      >
                        Đăng ký
                      </Button>
                    </>
                  ) : (
                    // Authenticated User Menu
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        iconName="User"
                        iconPosition="left"
                        className="justify-start"
                        onClick={() =>
                          handleUserMenuNavigate(ACCOUNT_SECTION_PATHS.profile)
                        }
                      >
                        Hồ sơ cá nhân
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        iconName="Settings"
                        iconPosition="left"
                        className="justify-start"
                        onClick={() =>
                          handleUserMenuNavigate(ACCOUNT_SECTION_PATHS.security)
                        }
                      >
                        Cài đặt
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        iconName="Search"
                        iconPosition="left"
                        className="justify-start"
                        onClick={() =>
                          handleUserMenuNavigate(PUBLIC_RESTAURANTS_ROUTE_PATH)
                        }
                      >
                        Tìm nhà hàng
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        iconName="HelpCircle"
                        iconPosition="left"
                        className="justify-start"
                        onClick={() => handleUserMenuNavigate("/#support")}
                      >
                        Trợ giúp
                      </Button>
                      <div className="my-1 border-t border-border"></div>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        iconName="LogOut"
                        iconPosition="left"
                        className="text-error hover:text-error justify-start"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Click outside handlers */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-1000"
          onClick={() => {
            setShowUserMenu(false)
            setShowNotifications(false)
          }}
        />
      )}
    </header>
  )
}

export default Header
