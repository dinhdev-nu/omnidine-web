import Icon from "@/components/AppIcon"
import Button from "@/features/pos/ui/Button"
import { AUTH_ROUTE_PATHS } from "@/features/auth/constants"
import { ACCOUNT_SECTION_PATHS } from "@/features/settings/account"
import { GUEST_RESTAURANTS_ROUTE_PATH } from "@/routes/guest-restaurants-routes"
import {
  formatNotificationTime,
  getNotificationColor,
  getNotificationIcon,
} from "./header.utils"
import type { OrderingNotification } from "../types"

export interface NotificationsMenuProps {
  notifications: OrderingNotification[]
  showNotifications: boolean
  onToggle: () => void
}

export function NotificationsMenu({
  notifications,
  showNotifications,
  onToggle,
}: NotificationsMenuProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label={showNotifications ? "Đóng thông báo" : "Mở thông báo"}
        aria-expanded={showNotifications}
        className="relative flex size-11 touch-manipulation items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <Icon aria-hidden="true" name="Bell" size={20} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-white">
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="shadow-modal fixed top-[calc(5rem+env(safe-area-inset-top))] right-[calc(0.5rem+env(safe-area-inset-right))] left-[calc(0.5rem+env(safe-area-inset-left))] z-[1150] w-auto rounded-lg border border-border bg-popover sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2 sm:w-80">
          <div className="border-b border-border p-4">
            <h3 className="font-medium text-popover-foreground">Thông báo</h3>
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
              <Button variant="ghost" size="sm" fullWidth disabled title="Đánh dấu hàng loạt chưa khả dụng">
                Đánh dấu tất cả đã đọc
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export interface UserProfileMenuProps {
  isGuest: boolean
  userName: string
  userAvatar: string | null
  userAvatarSrc: string | null
  showUserMenu: boolean
  onToggle: () => void
  onNavigate: (path: string) => void
  onLogout: () => void
  onUserAvatarError: (avatar: string | null) => void
}

export function UserProfileMenu({
  isGuest,
  userName,
  userAvatar,
  userAvatarSrc,
  showUserMenu,
  onToggle,
  onNavigate,
  onLogout,
  onUserAvatarError,
}: UserProfileMenuProps) {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={onToggle}
        aria-label={showUserMenu ? "Đóng menu tài khoản" : "Mở menu tài khoản"}
        aria-expanded={showUserMenu}
        className="hover-scale flex min-h-11 items-center gap-2"
      >
        {userAvatarSrc ? (
          <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-border/50">
            <img
              src={userAvatarSrc}
              alt={userName}
              width={32}
              height={32}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null
                onUserAvatarError(userAvatar)
              }}
            />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Icon name="User" size={16} color="white" />
          </div>
        )}
        <div className="hidden text-left md:block">
          <p className="text-sm font-medium text-foreground">{userName}</p>
          <p className="text-xs text-muted-foreground">
            {isGuest ? "Chưa đăng nhập" : "Người dùng"}
          </p>
        </div>
      </Button>

      {showUserMenu && (
        <div className="shadow-modal fixed top-[calc(5rem+env(safe-area-inset-top))] right-[calc(0.5rem+env(safe-area-inset-right))] left-[calc(0.5rem+env(safe-area-inset-left))] z-[1150] w-auto rounded-lg border border-border bg-popover sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2 sm:w-48">
          <div className="p-2">
            {isGuest ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  iconName="Search"
                  iconPosition="left"
                  className="justify-start"
                  onClick={() => onNavigate(GUEST_RESTAURANTS_ROUTE_PATH)}
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
                  onClick={() => onNavigate(AUTH_ROUTE_PATHS.login)}
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
                  onClick={() => onNavigate(AUTH_ROUTE_PATHS.register)}
                >
                  Đăng ký
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  iconName="User"
                  iconPosition="left"
                  className="justify-start"
                  onClick={() => onNavigate(ACCOUNT_SECTION_PATHS.profile)}
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
                  onClick={() => onNavigate(ACCOUNT_SECTION_PATHS.security)}
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
                  onClick={() => onNavigate(GUEST_RESTAURANTS_ROUTE_PATH)}
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
                  onClick={() => onNavigate("/#support")}
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
                  onClick={onLogout}
                >
                  Đăng xuất
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
