import Icon from "@/components/AppIcon"

import Button from "../../../ui/Button"
import MenuItemCard from "./MenuItemCard"
import MenuTable from "./MenuTable"
import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuContent({ controller }: MenuSectionViewProps) {
  const {
    isTableView,
    items,
    categoryMap,
    openAddItem,
    openEditItem,
    dispatchMenuUi,
    handleToggleAvailability,
    handleToggleFeatured,
    handleReorderItem,
    isItemActionPending,
  } = controller

  if (isTableView) {
    return (
      <MenuTable
        items={items}
        categoryMap={categoryMap}
        onEdit={openEditItem}
        onDelete={(id) =>
          dispatchMenuUi({ type: "requestDeleteItem", itemId: id })
        }
        onToggleAvailability={handleToggleAvailability}
        onToggleFeatured={handleToggleFeatured}
        onMoveItem={handleReorderItem}
        isItemActionPending={isItemActionPending}
        onAddItem={openAddItem}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <MenuItemCard
          key={item._id}
          item={item}
          categoryName={categoryMap[item.category_id] ?? "Không rõ"}
          onEdit={openEditItem}
          onDelete={(id) =>
            dispatchMenuUi({ type: "requestDeleteItem", itemId: id })
          }
          onToggleAvailability={handleToggleAvailability}
          onToggleFeatured={handleToggleFeatured}
          onMoveItem={handleReorderItem}
          isItemActionPending={isItemActionPending}
        />
      ))}

      {items.length === 0 && (
        <div className="col-span-full flex min-h-56 flex-col items-center justify-center gap-3 p-4 text-center sm:p-12">
          <Icon
            name="Search"
            size={48}
            className="text-muted-foreground"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-lg font-medium text-foreground">
              Không tìm thấy món ăn nào
            </h2>
            <p className="mt-1 text-pretty text-muted-foreground">
              Thử thay đổi bộ lọc hoặc thêm món mới.
            </p>
          </div>
          <Button
            variant="default"
            onClick={openAddItem}
            iconName="Plus"
            iconPosition="left"
          >
            Thêm món mới
          </Button>
        </div>
      )}
    </div>
  )
}
