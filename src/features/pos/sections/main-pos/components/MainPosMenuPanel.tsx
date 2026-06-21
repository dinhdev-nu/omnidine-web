import type { ComponentProps } from "react"
import Icon from "@/components/AppIcon"
import Input from "../../../ui/Input"
import MenuCategory from "./MenuCategory"
import MenuGrid from "./MenuGrid"

export type MainPosMenuPanelProps = {
  showMobileCart: boolean
  searchQuery: string
  activeCategory: string
  uiCategories: ComponentProps<typeof MenuCategory>["categories"]
  uiMenuItems: ComponentProps<typeof MenuGrid>["menuItems"]
  onSearchQueryChange: (value: string) => void
  onActiveCategoryChange: (value: string) => void
  onAddToCart: ComponentProps<typeof MenuGrid>["onAddToCart"]
}

export function MainPosMenuPanel({
  showMobileCart,
  searchQuery,
  activeCategory,
  uiCategories,
  uiMenuItems,
  onSearchQueryChange,
  onActiveCategoryChange,
  onAddToCart,
}: MainPosMenuPanelProps) {
  return (
    <div
      className={[
        "bg-surface flex-1 flex-col overflow-hidden border-r border-border",
        showMobileCart ? "hidden lg:flex" : "flex",
      ].join(" ")}
    >
      <div className="border-b border-border p-4">
        <h1 className="mb-4 text-xl font-semibold text-foreground">Thực đơn</h1>

        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Tìm món theo tên..."
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="w-full pr-10"
          />
          <Icon
            name="Search"
            size={18}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          />
        </div>

        <p className="mb-2 text-sm font-medium text-foreground">Danh mục</p>
        <MenuCategory
          categories={uiCategories}
          activeCategory={activeCategory}
          onCategoryChange={onActiveCategoryChange}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <MenuGrid menuItems={uiMenuItems} onAddToCart={onAddToCart} />
      </div>
    </div>
  )
}
