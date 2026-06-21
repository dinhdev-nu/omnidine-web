import Icon from "@/components/AppIcon"
import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuResultsSummary({ controller }: MenuSectionViewProps) {
  const { items, filterCategory, categoryMap } = controller
  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Hiá»ƒn thá»‹ {items.length} mÃ³n Äƒn
      </p>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {items.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Filter" size={16} />
            <span>
              {filterCategory !== "all" &&
                `Danh má»¥c: ${categoryMap[filterCategory] ?? ""}`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
