import { memo, useCallback, type RefObject } from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { Link, useParams } from "react-router-dom"

import Icon from "@/components/AppIcon"
import Button from "@/features/pos/ui/Button"
import { cn } from "@/lib/utils"
import { POS_BASE_PATH } from "@/routes/pos-route-config"

type UserRole = "staff" | "admin" | "owner"

interface NavItem {
  label: string
  section: string
  icon: string
  roles: UserRole[]
  description: string
}

export interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
  mobileMenuButtonRef?: RefObject<HTMLButtonElement | null>
  userRole?: UserRole
  activeSection?: string
  onSectionChange?: (section: string) => void
  className?: string
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Bán hàng",
    section: "main-pos",
    icon: "Monitor",
    roles: ["staff", "admin", "owner"],
    description: "Giao diện bán hàng chính",
  },
  {
    label: "Bàn ăn",
    section: "table",
    icon: "Table",
    roles: ["staff", "admin", "owner"],
    description: "Quản lý bàn ăn",
  },
  {
    label: "Thanh toán",
    section: "payment",
    icon: "CreditCard",
    roles: ["staff", "admin", "owner"],
    description: "Xử lý thanh toán",
  },
  {
    label: "Lịch sử",
    section: "order",
    icon: "History",
    roles: ["admin", "owner"],
    description: "Lịch sử đơn hàng",
  },
  {
    label: "Thực đơn",
    section: "menu",
    icon: "Utensils",
    roles: ["admin", "owner"],
    description: "Quản lý thực đơn",
  },
  {
    label: "Nhân viên",
    section: "staff",
    icon: "Users",
    roles: ["owner"],
    description: "Quản lý nhân viên",
  },
]

const SECTION_TO_ROUTE_SUFFIX: Record<string, string> = {
  "main-pos": "",
  table: "/tables",
  payment: "/payments",
  order: "/orders",
  menu: "/menu",
  staff: "/staff",
}

interface NavButtonProps {
  item: NavItem
  to: string
  isCollapsed: boolean
  isActive: boolean
  onAfterSelect?: () => void
}

const NavButton = memo<NavButtonProps>(
  ({ item, to, isCollapsed, isActive, onAfterSelect }) => {
    const className = cn(
      "flex min-h-11 w-full touch-manipulation items-center rounded-md transition-[color,background-color,box-shadow,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none",
      isCollapsed ? "size-11 shrink-0 justify-center p-0" : "justify-start px-4",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-foreground hover:bg-muted"
    )

    const content = (
      <>
        <Icon
          name={item.icon}
          size={20}
          aria-hidden="true"
          className={cn(
            !isCollapsed && "mr-3 shrink-0",
            isActive ? "text-primary-foreground" : "text-muted-foreground"
          )}
        />
        {!isCollapsed && (
          <span className="min-w-0 flex-1 py-2 text-left">
            <span
              className={cn(
                "block truncate text-sm font-medium",
                isActive ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {item.label}
            </span>
            <span
              className={cn(
                "block truncate text-xs",
                isActive
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              )}
            >
              {item.description}
            </span>
          </span>
        )}
      </>
    )

    return (
      <Link
        to={to}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
        title={isCollapsed ? item.label : undefined}
        onClick={onAfterSelect}
        className={className}
      >
        {content}
      </Link>
    )
  }
)

NavButton.displayName = "NavButton"

const SidebarFooter = memo(() => (
  <div className="action-cluster">
    <div className="mb-3 flex items-center gap-3">
      <span
        aria-hidden="true"
        className="status-pulse size-2 shrink-0 rounded-full bg-success"
      />
      <span className="text-sm text-muted-foreground">
        Hệ thống hoạt động
      </span>
    </div>
    <div className="text-xs text-muted-foreground">
      <p>Phiên bản: 2.1.0</p>
      <p>
        Cập nhật: <time dateTime="2025-09-02">02/09/2025</time>
      </p>
    </div>
  </div>
))

SidebarFooter.displayName = "SidebarFooter"

const Sidebar = memo<SidebarProps>(
  ({
    isCollapsed = false,
    onToggleCollapse,
    isMobileOpen = false,
    onCloseMobile,
    mobileMenuButtonRef,
    userRole = "owner",
    activeSection = "main-pos",
    className = "",
  }) => {
    const { slug = "" } = useParams<{ slug: string }>()
    const filteredItems = NAV_ITEMS.filter((item) =>
      item.roles.includes(userRole)
    )

    const handleMobileOpenChange = useCallback(
      (open: boolean) => {
        if (!open) onCloseMobile?.()
      },
      [onCloseMobile]
    )

    return (
      <>
        <aside
          aria-label="Điều hướng POS"
          className={cn(
            "hidden h-full shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-300 ease-smooth motion-reduce:transition-none lg:flex",
            isCollapsed ? "w-16" : "w-60",
            className
          )}
        >
          <div className="border-b border-border p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="w-full hover-scale"
              aria-label={
                isCollapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"
              }
              aria-expanded={!isCollapsed}
            >
              <Icon
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"}
                size={20}
                aria-hidden="true"
              />
            </Button>
          </div>

          <nav
            aria-label="Các khu vực POS"
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overscroll-contain",
              isCollapsed
                ? "flex flex-col items-center gap-2 p-2"
                : "space-y-2 p-4"
            )}
          >
            {filteredItems.map((item) => (
              <NavButton
                key={item.section}
                item={item}
                to={`${POS_BASE_PATH}/${slug}${SECTION_TO_ROUTE_SUFFIX[item.section] ?? ""}`}
                isCollapsed={isCollapsed}
                isActive={activeSection === item.section}
              />
            ))}
          </nav>

          {!isCollapsed && (
            <div className="border-t border-border p-4">
              <SidebarFooter />
            </div>
          )}
        </aside>

        <DialogPrimitive.Root
          open={isMobileOpen}
          onOpenChange={handleMobileOpenChange}
        >
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-[1200] bg-black/50 backdrop-blur-sm transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 motion-reduce:transition-none lg:hidden" />
            <DialogPrimitive.Content
              id="pos-mobile-navigation"
              aria-label="Điều hướng POS"
              onCloseAutoFocus={(event) => {
                event.preventDefault()
                mobileMenuButtonRef?.current?.focus()
              }}
              className="fixed top-0 left-[env(safe-area-inset-left)] z-[1201] flex h-dvh w-80 max-w-[calc(100vw_-_env(safe-area-inset-left)_-_env(safe-area-inset-right)_-_1rem)] flex-col border-r border-border bg-surface shadow-2xl transition-transform duration-300 ease-smooth data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 focus:outline-none motion-reduce:transition-none lg:hidden"
            >
              <DialogPrimitive.Description className="sr-only">
                Chọn khu vực cần thao tác trong hệ thống POS.
              </DialogPrimitive.Description>

              <div className="flex items-center justify-between border-b border-border p-4 pt-[calc(1rem+env(safe-area-inset-top))]">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Icon
                      name="Store"
                      size={20}
                      color="white"
                      aria-hidden="true"
                    />
                  </span>
                  <DialogPrimitive.Title className="truncate font-semibold text-foreground">
                    POS Manager
                  </DialogPrimitive.Title>
                </div>

                <DialogPrimitive.Close asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    aria-label="Đóng menu điều hướng"
                  >
                    <Icon name="X" size={20} aria-hidden="true" />
                  </Button>
                </DialogPrimitive.Close>
              </div>

              <nav
                aria-label="Các khu vực POS"
                className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-4"
              >
                {filteredItems.map((item) => (
                  <NavButton
                    key={item.section}
                    item={item}
                    to={`${POS_BASE_PATH}/${slug}${SECTION_TO_ROUTE_SUFFIX[item.section] ?? ""}`}
                    isCollapsed={false}
                    isActive={activeSection === item.section}
                    onAfterSelect={onCloseMobile}
                  />
                ))}
              </nav>

              <div className="border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <SidebarFooter />
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      </>
    )
  }
)

Sidebar.displayName = "Sidebar"

export default Sidebar
