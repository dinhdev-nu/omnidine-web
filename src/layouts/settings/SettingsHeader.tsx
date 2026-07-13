import { useState } from "react"
import { Bell, Moon, Search, Sun } from "lucide-react"
import { toast } from "sonner"

import { AccountMenu } from "@/components/navigation/AccountMenu"
import { cn } from "@/lib/utils"

interface SettingsHeaderProps {
  isDark: boolean
  onToggle: () => void
}

export function SettingsHeader({ isDark, onToggle }: SettingsHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-border bg-background/80 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3 sm:gap-6">
        <a
          href="/"
          className="flex min-h-11 touch-manipulation items-center rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="OmniDine - Trang chủ"
        >
          <img
            src="/assets/home/brand-logo.png"
            alt="OmniDine"
            className="h-6 w-auto object-contain"
          />
        </a>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div
          className={cn(
            "relative hidden items-center transition-[width] duration-300 motion-reduce:transition-none sm:flex",
            searchFocused ? "w-64" : "w-48"
          )}
        >
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            aria-label="Tìm kiếm"
            name="search"
            type="text"
            placeholder="Tìm kiếm…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="h-11 w-full rounded-lg bg-secondary pr-4 pl-9 text-sm text-foreground ring-1 ring-border transition-[box-shadow,background-color] duration-200 motion-reduce:transition-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="flex size-11 touch-manipulation items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color] duration-200 motion-reduce:transition-none hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label={
            isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
          }
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={() => toast.info("Bạn không có thông báo mới")}
          className="flex size-11 touch-manipulation items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color] duration-200 motion-reduce:transition-none hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Mở thông báo"
        >
          <Bell className="h-5 w-5" />
        </button>

        <AccountMenu />
      </div>
    </header>
  )
}
