import { useState } from "react"
import { Bell, Calendar, Moon, Search, Sun } from "lucide-react"

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
}

export function Header({
  activeSection,
  theme = "light",
  onThemeToggle,
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold text-foreground">
          {sectionTitles[activeSection]}
        </h1>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
          <Calendar className="h-4 w-4" />
          <span>30 ngày qua</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div
          className={cn(
            "relative hidden items-center transition-all duration-300 sm:flex",
            searchFocused ? "w-64" : "w-48"
          )}
        >
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            aria-label="TÃ¬m kiáº¿m"
            name="search"
            type="text"
            placeholder="Tìm kiếm…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="h-9 w-full rounded-lg bg-secondary pr-4 pl-9 text-sm text-foreground ring-1 ring-border transition-all duration-200 placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={onThemeToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          aria-label={
            theme === "dark"
              ? "Chuyển sang chế độ sáng"
              : "Chuyển sang chế độ tối"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          aria-label="Mở thông báo"
        >
          <Bell className="h-5 w-5" />
        </button>

        <AccountMenu />
      </div>
    </header>
  )
}
