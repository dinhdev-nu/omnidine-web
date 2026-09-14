import { useState, type RefObject } from "react"
import { Bell, Calendar, Menu, Moon, Search, Sun } from "lucide-react"
import { toast } from "sonner"

import { AccountMenu } from "@/components/navigation/AccountMenu"
import { cn } from "@/lib/utils"

const sectionTitles: Record<string, string> = {
  overview: "Tổng quan",
  pipeline: "Quy trình bán hàng",
  deals: "Giao dịch",
  customers: "Khách hàng",
  team: "Hiệu suất đội ngũ",
  forecasting: "Dự báo",
  reports: "Báo cáo",
  settings: "Cài đặt",
}

interface HeaderProps {
  activeSection: string
  theme?: "light" | "dark"
  onThemeToggle?: () => void
  mobileMenuOpen: boolean
  onMobileMenuOpen: () => void
  mobileMenuTriggerRef: RefObject<HTMLButtonElement | null>
}

export function Header({
  activeSection,
  theme = "light",
  onThemeToggle,
  mobileMenuOpen,
  onMobileMenuOpen,
  mobileMenuTriggerRef,
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-2 border-b border-border bg-background/80 px-4 py-2 [padding-top:max(0.5rem,env(safe-area-inset-top))] [padding-right:max(1rem,env(safe-area-inset-right))] [padding-left:max(1rem,env(safe-area-inset-left))] backdrop-blur-sm sm:flex-nowrap sm:px-6 sm:[padding-right:max(1.5rem,env(safe-area-inset-right))] sm:[padding-left:max(1.5rem,env(safe-area-inset-left))]">
      <div className="flex min-w-0 w-full flex-1 items-center gap-2 sm:w-auto sm:gap-4 lg:gap-6">
        <button
          ref={mobileMenuTriggerRef}
          type="button"
          onClick={onMobileMenuOpen}
          className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color] duration-200 hover:bg-secondary hover:text-foreground motion-reduce:transition-none lg:hidden"
          aria-label="Mở menu bảng điều khiển"
          aria-haspopup="dialog"
          aria-expanded={mobileMenuOpen}
          aria-controls="dashboard-mobile-navigation"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <h1
          aria-live="polite"
          className="min-w-0 break-words text-lg font-semibold leading-tight text-foreground sm:text-xl"
        >
          {sectionTitles[activeSection]}
        </h1>

        <div className="hidden shrink-0 items-center gap-2 text-sm text-muted-foreground xl:flex">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <span>30 ngày qua</span>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-end gap-1 sm:w-auto sm:gap-2 xl:gap-4">
        <div
          className={cn(
            "relative hidden items-center transition-[width] duration-300 motion-reduce:transition-none xl:flex",
            searchFocused ? "w-64" : "w-48"
          )}
        >
          <Search
            className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            aria-label="Tìm kiếm"
            name="search"
            type="search"
            autoComplete="off"
            placeholder="Tìm kiếm…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="h-11 w-full rounded-lg bg-secondary pr-4 pl-9 text-sm text-foreground ring-1 ring-border transition-[box-shadow] duration-200 placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 focus:outline-none motion-reduce:transition-none"
          />
        </div>

        <button
          type="button"
          onClick={onThemeToggle}
          className="flex size-11 touch-manipulation items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color] duration-200 hover:bg-secondary hover:text-foreground motion-reduce:transition-none"
          aria-label={
            theme === "dark"
              ? "Chuyển sang chế độ sáng"
              : "Chuyển sang chế độ tối"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={() => toast.info("Bạn không có thông báo mới")}
          className="relative flex size-11 touch-manipulation items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color] duration-200 hover:bg-secondary hover:text-foreground motion-reduce:transition-none"
          aria-label="Mở thông báo"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>

        <AccountMenu />
      </div>
    </header>
  )
}
