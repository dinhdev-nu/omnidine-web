import Select from "../../../ui/Select"
import CategoryFilter from "./CategoryFilter"
import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuFiltersPanel({ controller }: MenuSectionViewProps) {
  const {
    filterAvailability,
    handleAvailabilityChange,
    filterFeatured,
    handleFeaturedChange,
    uiCategories,
    filterCategory,
    handleCategoryChange,
    pagination,
    setPage,
    setLimit,
    uiItemCounts,
    openAddCategory,
    dispatchMenuUi,
  } = controller
  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-6">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Select
            placeholder="Lọc trạng thái bán"
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "available", label: "Đang bán" },
              { value: "unavailable", label: "Tạm ngưng" },
            ]}
            value={filterAvailability}
            onChange={(e) =>
              handleAvailabilityChange(
                e.target.value as "all" | "available" | "unavailable"
              )
            }
          />

          <Select
            placeholder="Lọc nổi bật"
            options={[
              { value: "all", label: "Tất cả" },
              { value: "featured", label: "Nổi bật" },
              { value: "normal", label: "Bình thường" },
            ]}
            value={filterFeatured}
            onChange={(e) =>
              handleFeaturedChange(
                e.target.value as "all" | "featured" | "normal"
              )
            }
          />

          <Select
            placeholder="Lọc danh mục"
            options={[
              { value: "all", label: "Tất cả danh mục" },
              ...uiCategories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
            value={filterCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          />

          <Select
            placeholder="Số món mỗi trang"
            options={[
              { value: "10", label: "10 món" },
              { value: "25", label: "25 món" },
              { value: "50", label: "50 món" },
              { value: "100", label: "100 món" },
            ]}
            value={String(pagination.limit || 50)}
            onChange={(e) => {
              setPage(1)
              setLimit(Number(e.target.value))
            }}
          />
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={uiCategories}
          selectedCategory={filterCategory}
          onCategoryChange={handleCategoryChange}
          itemCounts={uiItemCounts}
          onAddCategory={openAddCategory}
          onManageCategories={() =>
            dispatchMenuUi({
              type: "setCategoryManagerOpen",
              isOpen: true,
            })
          }
        />
      </div>
    </div>
  )
}
