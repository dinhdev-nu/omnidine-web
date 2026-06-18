import { useState } from "react"
import { Bell, Moon, Search, Sun } from "lucide-react"

import { AccountMenu } from "@/components/navigation/AccountMenu"
import { cn } from "@/lib/utils"

interface SettingsHeaderProps {
  isDark: boolean
  onToggle: () => void
}

export function SettingsHeader({ isDark, onToggle }: SettingsHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3 sm:gap-6">
        <a href="/" className="flex items-center">
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
          onClick={onToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          aria-label={
            isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
          }
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          aria-label="Mở thông báo"
        >
          <Bell className="h-5 w-5" />
        </button>

        <AccountMenu />
      </div>
    </header>
  )
}
