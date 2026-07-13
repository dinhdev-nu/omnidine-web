import { memo, useEffect, useRef, useState, type Ref } from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import Icon from "@/components/AppIcon"
import Button from "@/features/pos/ui/Button"
import QrDialog from "@/features/pos/ui/QrDialog"
import type { PosRestaurant } from "@/types/domain/pos-init"

type NotificationType = "info" | "warning" | "success" | "error"

export interface Notification {
  id: string
  type: NotificationType
  message: string
  createdAt: Date | string
}

export interface HeaderProps {
  storeName?: string
  restaurant?: PosRestaurant
  notifications?: Notification[]
  isOperational?: boolean
  onToggleOperational?: () => void
  onToggleSidebar?: () => void
  menuButtonRef?: Ref<HTMLButtonElement>
  getRelativeTime?: (date: Date | string) => string
}

const NOTIFICATION_ICON: Record<NotificationType, string> = {
  warning: "AlertTriangle",
  success: "CheckCircle",
  error: "XCircle",
  info: "Info",
}

const NOTIFICATION_COLOR: Record<NotificationType, string> = {
  warning: "text-warning",
  success: "text-success",
  error: "text-error",
  info: "text-primary",
}

const TIME_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})

const DATE_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const Clock = memo(() => {
  const [currentTime, setCurrentTime] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="hidden items-center gap-2 px-3 py-2 2xl:flex">
      <Icon
        name="Clock"
        size={16}
        className="text-primary"
        aria-hidden="true"
      />
      <div className="flex flex-col">
        <time
          dateTime={currentTime.toISOString()}
          className="font-mono text-sm font-semibold tracking-wider text-foreground tabular-nums"
        >
          {TIME_FORMATTER.format(currentTime)}
        </time>
        <span className="text-xs text-muted-foreground">
          {DATE_FORMATTER.format(currentTime)}
        </span>
      </div>
    </div>
  )
})

Clock.displayName = "Clock"

const Header = memo<HeaderProps>(
  ({
    storeName = "POS Manager",
    restaurant,
    notifications = [],
    isOperational = true,
    onToggleOperational,
    onToggleSidebar,
    menuButtonRef,
    getRelativeTime,
  }) => {
    const [showNotifications, setShowNotifications] = useState(false)
    const [showQrDialog, setShowQrDialog] = useState(false)
    const qrTriggerRef = useRef<HTMLButtonElement>(null)

    const displayName = restaurant?.name ?? storeName
    const logoSrc = restaurant?.logo_url ?? "/assets/images/restaurant_logo.png"
    const orderUrl = restaurant
      ? `${window.location.origin}/public/restaurants/${restaurant.slug}`
      : ""
    const unreadCount = notifications.length
    const notificationLabel = unreadCount
      ? `Thông báo, ${unreadCount} thông báo mới`
      : "Thông báo, không có thông báo mới"

    return (
      <header className="relative z-[1100] shrink-0 border-b border-border bg-surface pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 min-w-0 items-center justify-between gap-2 px-2 sm:h-16 sm:px-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="shrink-0 lg:hidden"
              aria-label="Mở menu điều hướng"
              aria-controls="pos-mobile-navigation"
            >
              <Icon name="Menu" size={20} aria-hidden="true" />
            </Button>

            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              {restaurant ? (
                <img
                  src={logoSrc}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="size-8 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Icon
                    name="Store"
                    size={20}
                    color="white"
                    aria-hidden="true"
                  />
                </span>
              )}
              <p className="hidden max-w-48 truncate text-base font-semibold text-foreground sm:block lg:max-w-52 lg:text-lg xl:max-w-64">
                {displayName}
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <Button
              variant="outline"
              size="sm"
              iconName="Search"
              iconPosition="left"
              className="hover-scale"
              disabled
              title="Tìm kiếm toàn cục chưa khả dụng"
            >
              Tìm kiếm
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="QrCode"
              iconPosition="left"
              className="hover-scale"
              onClick={(event) => {
                qrTriggerRef.current = event.currentTarget
                setShowQrDialog(true)
              }}
            >
              QR nhà hàng
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Receipt"
              iconPosition="left"
              className="hover-scale"
              disabled
              title="Tạo hóa đơn nhanh chưa khả dụng; hãy tạo đơn trong màn hình bán hàng"
            >
              Tạo hóa đơn
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Clock />

            <div className="hidden items-center gap-2 lg:flex">
              <span className="hidden text-sm text-muted-foreground 2xl:inline">
                Trạng thái:
              </span>
              <Button
                variant={isOperational ? "success" : "secondary"}
                size="sm"
                onClick={onToggleOperational}
                iconName={isOperational ? "Play" : "Pause"}
                iconPosition="left"
                className="hover-scale"
                aria-label={
                  isOperational ? "Chuyển sang đóng cửa" : "Chuyển sang mở cửa"
                }
                aria-pressed={isOperational}
              >
                <span className="hidden 2xl:inline">
                  {isOperational ? "Đang mở cửa" : "Đang đóng cửa"}
                </span>
                <span className="2xl:hidden">
                  {isOperational ? "Mở" : "Đóng"}
                </span>
              </Button>
            </div>

            <PopoverPrimitive.Root
              open={showNotifications}
              onOpenChange={setShowNotifications}
            >
              <PopoverPrimitive.Trigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative shrink-0 hover-scale"
                  aria-label={notificationLabel}
                >
                  <Icon name="Bell" size={20} aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-error text-xs text-error-foreground tabular-nums"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverPrimitive.Trigger>

              <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                  align="end"
                  sideOffset={8}
                  collisionPadding={8}
                  aria-labelledby="pos-notifications-title"
                  className="z-[1250] max-h-[min(24rem,calc(100dvh-1rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))] w-[min(20rem,calc(100vw-1rem-env(safe-area-inset-left)-env(safe-area-inset-right)))] overflow-y-auto overscroll-contain rounded-lg border border-border bg-popover text-popover-foreground shadow-modal duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none"
                >
                  <div className="flex min-h-11 items-center justify-between border-b border-border py-1 pr-1 pl-3">
                    <h2
                      id="pos-notifications-title"
                      className="text-sm font-semibold text-foreground"
                    >
                      Thông báo
                    </h2>
                    <PopoverPrimitive.Close asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Đóng thông báo"
                      >
                        <Icon name="X" size={18} aria-hidden="true" />
                      </Button>
                    </PopoverPrimitive.Close>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-sm text-muted-foreground">
                      Không có thông báo mới
                    </p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {notifications.map((notification) => (
                        <li
                          key={notification.id}
                          className="flex items-start gap-3 p-3 transition-colors hover:bg-muted/50 motion-reduce:transition-none"
                        >
                          <Icon
                            name={NOTIFICATION_ICON[notification.type]}
                            size={16}
                            aria-hidden="true"
                            className={`mt-0.5 shrink-0 ${NOTIFICATION_COLOR[notification.type]}`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="break-words text-sm text-foreground">
                              {notification.message}
                            </p>
                            {getRelativeTime && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {getRelativeTime(notification.createdAt)}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>

            {restaurant ? (
              <div className="flex min-w-0 items-center gap-2">
                <img
                  src={logoSrc}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0 rounded-full border border-border/30 object-cover"
                />
                <div className="hidden min-w-0 text-left xl:block">
                  <p className="max-w-36 truncate text-sm font-semibold text-foreground 2xl:max-w-48">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">POS</p>
                </div>
              </div>
            ) : (
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Icon
                    name="Store"
                    size={16}
                    color="white"
                    aria-hidden="true"
                  />
                </span>
                <div className="hidden min-w-0 text-left xl:block">
                  <p className="max-w-36 truncate text-sm font-semibold text-foreground 2xl:max-w-48">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">POS</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border bg-muted/30 px-2 py-2 sm:px-4 lg:hidden">
          <div className="flex min-w-0 items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Search"
              className="min-w-0 flex-1 px-2 text-xs sm:text-sm"
              aria-label="Tìm kiếm"
              disabled
              title="Tìm kiếm toàn cục chưa khả dụng"
            >
              <span className="hidden min-[360px]:inline">Tìm</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="QrCode"
              className="min-w-0 flex-1 px-2 text-xs sm:text-sm"
              onClick={(event) => {
                qrTriggerRef.current = event.currentTarget
                setShowQrDialog(true)
              }}
              aria-label="Mở mã QR nhà hàng"
            >
              <span className="hidden min-[360px]:inline">QR</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Receipt"
              className="min-w-0 flex-1 px-2 text-xs sm:text-sm"
              aria-label="Tạo hóa đơn"
              disabled
              title="Tạo hóa đơn nhanh chưa khả dụng; hãy tạo đơn trong màn hình bán hàng"
            >
              <span className="hidden min-[360px]:inline">Hóa đơn</span>
            </Button>
            <Button
              variant={isOperational ? "success" : "secondary"}
              size="sm"
              iconName={isOperational ? "Play" : "Pause"}
              onClick={onToggleOperational}
              className="min-w-11 shrink-0 px-2"
              aria-label={
                isOperational ? "Chuyển sang đóng cửa" : "Chuyển sang mở cửa"
              }
              aria-pressed={isOperational}
            >
              <span className="hidden sm:inline">
                {isOperational ? "Mở" : "Đóng"}
              </span>
            </Button>
          </div>
        </div>

        <QrDialog
          open={showQrDialog && Boolean(restaurant)}
          onClose={() => setShowQrDialog(false)}
          title="QR Code Đặt Món"
          subtitle={displayName}
          qrUrl={orderUrl}
          returnFocusRef={qrTriggerRef}
        />
      </header>
    )
  }
)

Header.displayName = "Header"

export default Header
