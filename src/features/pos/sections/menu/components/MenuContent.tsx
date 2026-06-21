import Icon from "@/components/AppIcon"
import MenuItemCard from "./MenuItemCard"
import MenuTable from "./MenuTable"
import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuContent({ controller }: MenuSectionViewProps) {
  const {
    isTableView,
    items,
    categoryMap,
    openEditItem,
    dispatchMenuUi,
    handleToggleAvailability,
    handleToggleFeatured,
    handleReorderItem,
    isItemActionPending,
  } = controller
  return (
    <>
      {isTableView ? (
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
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              categoryName={categoryMap[item.category_id] ?? "KhÃ´ng rÃµ"}
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
            <div className="col-span-full p-12 text-center">
              <Icon
                name="Search"
                size={48}
                className="mx-auto mb-4 text-muted-foreground"
              />
              <h3 className="mb-2 text-lg font-medium text-foreground">
                KhÃ´ng tÃ¬m tháº¥y mÃ³n Äƒn nÃ o
              </h3>
              <p className="mb-4 text-muted-foreground">
                Thá»­ thay Ä‘á»•i bá»™ lá»c hoáº·c thÃªm mÃ³n má»›i
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
