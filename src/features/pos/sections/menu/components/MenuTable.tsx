import React from "react"

import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import type { MenuItem } from "@/types/domain/menu"

import Button from "../../../ui/Button"
import { Spinner } from "../../../ui/Spinner"
import MenuItemCard from "./MenuItemCard"

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

type ItemAction =
  | "toggle-availability"
  | "toggle-featured"
  | "reorder-up"
  | "reorder-down"
  | "delete"

interface MenuTableProps {
  items: MenuItem[]
  categoryMap: Record<string, string>
  onEdit: (item: MenuItem) => void
  onDelete: (id: string) => void
  onToggleAvailability: (id: string, isAvailable: boolean) => void
  onToggleFeatured: (id: string, isFeatured: boolean) => void
  onMoveItem: (id: string, direction: "up" | "down") => void
  isItemActionPending: (itemId: string, action: ItemAction) => boolean
  onAddItem: () => void
}

const formatPrice = (price: number): string => currencyFormatter.format(price)

const StatusBadge: React.FC<{ isAvailable: boolean }> = ({ isAvailable }) => (
  <span
    className={
      isAvailable
        ? "inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-1 text-xs font-medium text-success"
        : "inline-flex items-center gap-1 rounded-full border border-warning/20 bg-warning/10 px-2 py-1 text-xs font-medium text-warning"
    }
  >
    <Icon
      name={isAvailable ? "CheckCircle" : "XCircle"}
      size={12}
      aria-hidden="true"
    />
    <span>{isAvailable ? "Kích hoạt" : "Tạm ngưng"}</span>
  </span>
)

const MenuTable: React.FC<MenuTableProps> = ({
  items,
  categoryMap,
  onEdit,
  onDelete,
  onToggleAvailability,
  onToggleFeatured,
  onMoveItem,
  isItemActionPending,
  onAddItem,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-4 text-center sm:p-12">
        <Icon
          name="UtensilsCrossed"
          size={48}
          className="text-muted-foreground"
          aria-hidden="true"
        />
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Chưa có món ăn nào
          </h2>
          <p className="mt-1 text-pretty text-muted-foreground">
            Thêm món ăn đầu tiên để bắt đầu quản lý thực đơn.
          </p>
        </div>
        <Button
          variant="default"
          onClick={onAddItem}
          iconName="Plus"
          iconPosition="left"
        >
          Thêm món mới
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:hidden" aria-label="Danh sách món ăn">
        {items.map((item) => (
          <MenuItemCard
            key={item._id}
            item={item}
            categoryName={categoryMap[item.category_id] ?? "Không rõ"}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleAvailability={onToggleAvailability}
            onToggleFeatured={onToggleFeatured}
            onMoveItem={onMoveItem}
            isItemActionPending={isItemActionPending}
          />
        ))}
      </div>

      <div className="hidden min-w-0 overflow-hidden rounded-lg border border-border bg-card md:block">
        <div
          className="overflow-x-auto overscroll-x-contain"
          role="region"
          aria-label="Bảng món ăn, cuộn ngang để xem thêm"
          tabIndex={0}
        >
          <table className="w-full min-w-[70rem]">
            <caption className="sr-only">
              Danh sách món ăn và các thao tác quản lý
            </caption>
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th scope="col" className="p-4 text-left text-sm font-medium text-foreground">
                  Món ăn
                </th>
                <th scope="col" className="p-4 text-left text-sm font-medium text-foreground">
                  Danh mục
                </th>
                <th scope="col" className="p-4 text-left text-sm font-medium text-foreground">
                  Giá
                </th>
                <th scope="col" className="p-4 text-left text-sm font-medium text-foreground">
                  Trạng thái
                </th>
                <th scope="col" className="p-4 text-left text-sm font-medium text-foreground">
                  Nổi bật
                </th>
                <th scope="col" className="p-4 text-left text-sm font-medium text-foreground">
                  Cập nhật
                </th>
                <th scope="col" className="w-80 p-4 text-center text-sm font-medium text-foreground">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isMoveUpPending = isItemActionPending(
                  item._id,
                  "reorder-up"
                )
                const isMoveDownPending = isItemActionPending(
                  item._id,
                  "reorder-down"
                )
                const isToggleFeaturedPending = isItemActionPending(
                  item._id,
                  "toggle-featured"
                )
                const isToggleAvailabilityPending = isItemActionPending(
                  item._id,
                  "toggle-availability"
                )
                const isDeletePending = isItemActionPending(item._id, "delete")
                const isAnyPending =
                  isMoveUpPending ||
                  isMoveDownPending ||
                  isToggleFeaturedPending ||
                  isToggleAvailabilityPending ||
                  isDeletePending

                return (
                  <tr
                    key={item._id}
                    className="border-b border-border transition-colors hover:bg-muted/30 motion-reduce:transition-none"
                    aria-busy={isAnyPending}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={item.images?.[0]?.url ?? ""}
                            alt={item.name}
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="max-w-52 truncate text-sm font-medium text-foreground" title={item.name}>
                            {item.name}
                          </p>
                          {item.description && (
                            <p
                              className="max-w-52 truncate text-xs text-muted-foreground"
                              title={item.description}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-sm text-foreground">
                      {categoryMap[item.category_id] ?? "Không rõ"}
                    </td>

                    <td className="p-4 text-sm font-semibold whitespace-nowrap text-primary">
                      {formatPrice(item.base_price)}
                    </td>

                    <td className="p-4">
                      <StatusBadge isAvailable={item.is_available} />
                    </td>

                    <td className="p-4">
                      {item.is_featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-1 text-xs text-warning">
                          <Icon name="Star" size={12} aria-hidden="true" />
                          Nổi bật
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Bình thường
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-sm whitespace-nowrap text-muted-foreground">
                      {new Date(
                        item.updated_at || item.created_at
                      ).toLocaleDateString("vi-VN")}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onMoveItem(item._id, "up")}
                          disabled={isAnyPending}
                          aria-label={`Đưa món ${item.name} lên`}
                          title="Đưa lên"
                        >
                          {isMoveUpPending ? (
                            <Spinner className="size-4" />
                          ) : (
                            <Icon name="ChevronUp" size={16} aria-hidden="true" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onMoveItem(item._id, "down")}
                          disabled={isAnyPending}
                          aria-label={`Đưa món ${item.name} xuống`}
                          title="Đưa xuống"
                        >
                          {isMoveDownPending ? (
                            <Spinner className="size-4" />
                          ) : (
                            <Icon name="ChevronDown" size={16} aria-hidden="true" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            onToggleFeatured(item._id, item.is_featured)
                          }
                          disabled={isAnyPending}
                          aria-label={
                            item.is_featured
                              ? `Bỏ nổi bật món ${item.name}`
                              : `Đánh dấu nổi bật món ${item.name}`
                          }
                          title={
                            item.is_featured
                              ? "Bỏ nổi bật"
                              : "Đánh dấu nổi bật"
                          }
                        >
                          {isToggleFeaturedPending ? (
                            <Spinner className="size-4" />
                          ) : (
                            <Icon
                              name={item.is_featured ? "StarOff" : "Star"}
                              size={16}
                              aria-hidden="true"
                            />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            onToggleAvailability(item._id, item.is_available)
                          }
                          disabled={isAnyPending}
                          aria-label={
                            item.is_available
                              ? `Tạm ngưng món ${item.name}`
                              : `Kích hoạt món ${item.name}`
                          }
                          title={item.is_available ? "Tạm ngưng" : "Kích hoạt"}
                        >
                          {isToggleAvailabilityPending ? (
                            <Spinner className="size-4" />
                          ) : (
                            <Icon
                              name={
                                item.is_available ? "XCircle" : "CheckCircle"
                              }
                              size={16}
                              aria-hidden="true"
                            />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                          disabled={isAnyPending}
                          aria-label={`Chỉnh sửa món ${item.name}`}
                          title="Chỉnh sửa"
                        >
                          <Icon name="Edit" size={16} aria-hidden="true" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(item._id)}
                          className="text-error hover:text-error"
                          disabled={isAnyPending}
                          aria-label={`Xóa món ${item.name}`}
                          title="Xóa"
                        >
                          {isDeletePending ? (
                            <Spinner className="size-4" />
                          ) : (
                            <Icon name="Trash2" size={16} aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default MenuTable
