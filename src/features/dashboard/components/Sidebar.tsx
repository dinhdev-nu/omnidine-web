import type { RefObject } from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import {
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  GitBranch,
  Handshake,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

import AppImage from "@/components/AppImage"
import { cn } from "@/lib/utils"

type SidebarRestaurant = {
  _id: string
  name: string
  logo_url?: string | null
}

type SectionId =
  | "overview"
  | "pipeline"
  | "deals"
  | "customers"
  | "team"
  | "forecasting"
  | "reports"
  | "settings"

interface NavItem {
  id: SectionId
  label: string
  icon: LucideIcon
}

interface SidebarProps {
  restaurant?: SidebarRestaurant | null
  activeSection: SectionId
  onSectionChange: (section: SectionId) => void
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
  mobileMenuTriggerRef: RefObject<HTMLButtonElement | null>
}

interface SidebarBrandProps {
  restaurant?: SidebarRestaurant | null
  collapsed?: boolean
  dialogTitle?: boolean
}

interface SidebarNavigationProps {
  activeSection: SectionId
  collapsed?: boolean
  onSectionChange: (section: SectionId) => void
}

const navItems: NavItem[] = [
  { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { id: "pipeline", label: "Quy trình", icon: GitBranch },
  { id: "deals", label: "Giao dịch", icon: Handshake },
  { id: "customers", label: "Khách hàng", icon: Building2 },
  { id: "team", label: "Đội ngũ", icon: Users },
  { id: "forecasting", label: "Dự báo", icon: TrendingUp },
  { id: "reports", label: "Báo cáo", icon: BarChart3 },
  { id: "settings", label: "Cài đặt", icon: Settings },
]

function SidebarBrand({
  restaurant,
  collapsed = false,
  dialogTitle = false,
}: SidebarBrandProps) {
  const restaurantName = restaurant?.name ?? "SalesOps"
  const title = (
    <span
      className={cn(
        "dashboard-sidebar-title min-w-0 truncate text-lg font-semibold text-sidebar-foreground",
        collapsed
          ? "max-w-0 -translate-x-1.5 opacity-0"
          : "max-w-[190px] translate-x-0 opacity-100"
      )}
    >
      {restaurantName}
    </span>
  )

  return (
    <div className="dashboard-sidebar-label flex min-w-0 items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-sidebar-border/60">
        {restaurant?.logo_url ? (
          <AppImage
            src={restaurant.logo_url}
            alt={restaurantName}
            width={44}
            height={44}
            className="size-full object-cover"
          />
        ) : (
          <CircleDollarSign
            className="h-5 w-5 text-accent"
            aria-hidden="true"
          />
        )}
      </div>
      {dialogTitle ? (
        <DialogPrimitive.Title asChild>{title}</DialogPrimitive.Title>
      ) : (
        title
      )}
    </div>
  )
}

function SidebarNavigation({
  activeSection,
  collapsed = false,
  onSectionChange,
}: SidebarNavigationProps) {
  return (
    <nav
      aria-label="Các mục bảng điều khiển"
      className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-4"
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeSection === item.id

        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            aria-current={isActive ? "page" : undefined}
            title={collapsed ? item.label : undefined}
            className={cn(
              "dashboard-sidebar-nav-item group relative flex min-h-11 w-full touch-manipulation items-center overflow-hidden rounded-lg text-sm font-medium",
              collapsed
                ? "justify-center px-2 py-2.5"
                : "justify-start gap-3 px-3 py-2.5",
              isActive
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accent transition-opacity duration-300 motion-reduce:transition-none",
                isActive ? "opacity-100" : "opacity-0"
              )}
            />
            <Icon
              aria-hidden="true"
              className={cn(
                "h-5 w-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
                isActive ? "text-accent" : "group-hover:scale-110"
              )}
            />
            <span
              className={cn(
                "overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-300 ease-in-out motion-reduce:transition-none",
                collapsed
                  ? "max-w-0 -translate-x-1.5 opacity-0"
                  : "max-w-[160px] translate-x-0 opacity-100"
              )}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export function Sidebar({
  restaurant,
  activeSection,
  onSectionChange,
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileOpenChange,
  mobileMenuTriggerRef,
}: SidebarProps) {
  const handleMobileSectionChange = (section: SectionId) => {
    onSectionChange(section)
    onMobileOpenChange(false)
  }

  return (
    <>
      <aside
        className={cn(
          "dashboard-sidebar-shell fixed top-0 left-0 z-40 hidden h-dvh flex-col border-r border-sidebar-border bg-sidebar pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] lg:flex",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <div className="flex min-h-16 items-center overflow-hidden border-b border-sidebar-border px-3">
          <SidebarBrand restaurant={restaurant} collapsed={collapsed} />
        </div>

        <SidebarNavigation
          activeSection={activeSection}
          collapsed={collapsed}
          onSectionChange={onSectionChange}
        />

        <div className="border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="dashboard-sidebar-collapse-button flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                <span>Thu gọn</span>
              </>
            )}
          </button>
        </div>
      </aside>

      <DialogPrimitive.Root
        open={mobileOpen}
        onOpenChange={onMobileOpenChange}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/45 duration-200 motion-reduce:transition-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden" />
          <DialogPrimitive.Content
            id="dashboard-mobile-navigation"
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              mobileMenuTriggerRef.current?.focus()
            }}
            className="fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(20rem,calc(100vw-1rem))] flex-col overflow-hidden border-r border-sidebar-border bg-sidebar pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-sidebar-foreground shadow-xl outline-none duration-200 motion-reduce:animate-none motion-reduce:transition-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left lg:hidden"
          >
            <div className="flex min-h-16 items-center border-b border-sidebar-border px-3 pr-14">
              <SidebarBrand restaurant={restaurant} dialogTitle />
            </div>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                className="absolute top-[max(0.5rem,env(safe-area-inset-top))] right-[max(0.5rem,env(safe-area-inset-right))] flex size-11 touch-manipulation items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color] duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground motion-reduce:transition-none"
                aria-label="Đóng menu bảng điều khiển"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>

            <SidebarNavigation
              activeSection={activeSection}
              onSectionChange={handleMobileSectionChange}
            />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  )
}
