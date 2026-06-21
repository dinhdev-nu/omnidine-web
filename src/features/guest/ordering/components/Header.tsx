import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { resolveUserAvatar } from "@/lib/avatar"
import { logout as logoutApi } from "@/services/auth"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"
import { HeaderClock } from "./HeaderClock"
import { HeaderDismissLayer } from "./HeaderDismissLayer"
import { NotificationsMenu, UserProfileMenu } from "./HeaderMenus"
import {
  OperationalStatusButton,
  RestaurantBrandButton,
} from "./HeaderBrandStatus"
import { DEFAULT_RESTAURANT_LOGO, EMPTY_NOTIFICATIONS } from "./header.utils"
import type { HeaderProps } from "./header.types"

const Header = ({
  isOperational = true,
  notifications = EMPTY_NOTIFICATIONS,
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
    brokenUserAvatar === userAvatar
      ? "/assets/home/avatar-placeholder-1.png"
      : userAvatar

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

  return (
    <header className="fixed top-0 right-0 left-0 z-[1100] h-16 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between px-2 sm:px-4 lg:px-8 xl:px-16">
        <RestaurantBrandButton
          displayStoreName={displayStoreName}
          restaurantLogo={restaurantLogo}
          originalRestaurantLogo={originalRestaurantLogo}
          onNavigate={() => navigate(restaurantDetailPath)}
          onRestaurantLogoError={setBrokenRestaurantLogo}
        />

        {/* Right Section - Status, Notifications, User */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          <HeaderClock />
          <OperationalStatusButton isOperational={isOperational} />

          <NotificationsMenu
            notifications={notifications}
            showNotifications={showNotifications}
            onToggle={() => setShowNotifications((isShown) => !isShown)}
          />

          <UserProfileMenu
            isGuest={isGuest}
            userName={userName}
            userAvatar={userAvatar}
            userAvatarSrc={userAvatarSrc}
            showUserMenu={showUserMenu}
            onToggle={() => setShowUserMenu((isShown) => !isShown)}
            onNavigate={handleUserMenuNavigate}
            onLogout={handleLogout}
            onUserAvatarError={setBrokenUserAvatar}
          />
        </div>
      </div>
      <HeaderDismissLayer
        show={showUserMenu || showNotifications}
        onDismiss={() => {
          setShowUserMenu(false)
          setShowNotifications(false)
        }}
      />
    </header>
  )
}

export default Header
