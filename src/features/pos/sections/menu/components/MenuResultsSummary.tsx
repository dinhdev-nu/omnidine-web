import Icon from "@/components/AppIcon"

import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuResultsSummary({ controller }: MenuSectionViewProps) {
  const { items, filterCategory, categoryMap } = controller

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Hiển thị {items.length} món ăn
      </p>

      {items.length > 0 && filterCategory !== "all" && (
        <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Filter" size={16} aria-hidden="true" />
          <span className="min-w-0 break-words">
            Danh mục: {categoryMap[filterCategory] ?? ""}
          </span>
        </div>
      )}
    </div>
  )
}
