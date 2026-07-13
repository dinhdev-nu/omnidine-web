import type { ComponentProps } from "react"
import Icon from "@/components/AppIcon"
import Input from "../../../ui/Input"
import MenuCategory from "./MenuCategory"
import MenuGrid from "./MenuGrid"

export type MainPosMenuPanelProps = {
  searchQuery: string
  activeCategory: string
  uiCategories: ComponentProps<typeof MenuCategory>["categories"]
  uiMenuItems: ComponentProps<typeof MenuGrid>["menuItems"]
  isLoading: boolean
  error: unknown | null
  onSearchQueryChange: (value: string) => void
  onActiveCategoryChange: (value: string) => void
  onAddToCart: ComponentProps<typeof MenuGrid>["onAddToCart"]
}

export function MainPosMenuPanel({
  searchQuery,
  activeCategory,
  uiCategories,
  uiMenuItems,
  isLoading,
  error,
  onSearchQueryChange,
  onActiveCategoryChange,
  onAddToCart,
}: MainPosMenuPanelProps) {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden border-r border-border bg-surface">
      <div className="border-b border-border p-3 sm:p-4">
        <h1 className="mb-4 text-xl font-semibold text-foreground text-balance">
          Thực đơn
        </h1>

        <div className="relative mb-4">
          <Input
            type="search"
            name="pos-menu-search"
            aria-label="Tìm món theo tên"
            autoComplete="off"
            placeholder="Tìm món theo tên…"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="w-full pr-10"
          />
          <Icon
            name="Search"
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          />
        </div>

        <nav aria-label="Danh mục món ăn">
          <p className="mb-2 text-sm font-medium text-foreground">Danh mục</p>
          <MenuCategory
            categories={uiCategories}
            activeCategory={activeCategory}
            onCategoryChange={onActiveCategoryChange}
          />
        </nav>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
        <MenuGrid
          menuItems={uiMenuItems}
          onAddToCart={onAddToCart}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </section>
  )
}
