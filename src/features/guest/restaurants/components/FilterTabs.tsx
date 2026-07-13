import type { LucideIcon } from "lucide-react"
import { CalendarDays, Flame, House, Sparkles, Star, Tag } from "lucide-react"

import { cn } from "@/lib/utils"

import type { FeedFilter } from "../types"

interface FilterTab {
  id: FeedFilter
  label: string
  icon: LucideIcon
  color: string
}

interface FilterTabsProps {
  activeFilter: FeedFilter
  onFilterChange: (filter: FeedFilter) => void
}

const FILTERS: FilterTab[] = [
  { id: "all", label: "Tất cả", icon: House, color: "text-gray-700" },
  { id: "promotion", label: "Khuyến mãi", icon: Tag, color: "text-red-500" },
  {
    id: "new_menu",
    label: "Menu mới",
    icon: Sparkles,
    color: "text-purple-500",
  },
  { id: "feedback", label: "Review", icon: Star, color: "text-yellow-500" },
  { id: "event", label: "Sự kiện", icon: CalendarDays, color: "text-blue-500" },
  {
    id: "experience",
    label: "Kinh nghiệm",
    icon: Flame,
    color: "text-orange-500",
  },
]

export default function FilterTabs({
  activeFilter,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <nav
      aria-label="Lọc bài viết"
      className="mb-4 rounded-2xl border border-border bg-card p-2 shadow-sm sm:mb-6 sm:p-4"
    >
      <div
        role="group"
        aria-label="Loại bài viết"
        className="scrollbar-hide flex touch-pan-x snap-x snap-mandatory scroll-px-2 items-center gap-2 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 motion-reduce:scroll-auto xl:gap-1"
      >
        {FILTERS.map((filter) => {
          const IconComponent = filter.icon
          const isActive = activeFilter === filter.id

          return (
            <button
              type="button"
              aria-pressed={isActive}
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "flex min-h-11 shrink-0 touch-manipulation snap-start items-center gap-2 rounded-2xl px-4 py-2.5 whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none xl:gap-1 xl:px-2",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-secondary"
              )}
            >
              <IconComponent
                aria-hidden="true"
                className={cn(
                  "size-4",
                  isActive ? "text-primary-foreground" : filter.color
                )}
              />
              <span className="text-sm font-medium xl:text-xs">
                {filter.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
