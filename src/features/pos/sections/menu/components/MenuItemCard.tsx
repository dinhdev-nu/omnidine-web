import React from "react"

import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import type { MenuItem } from "@/types/domain/menu"

import Button from "../../../ui/Button"
import { Spinner } from "../../../ui/Spinner"

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

interface MenuItemCardProps {
  item: MenuItem
  categoryName: string
  onEdit: (item: MenuItem) => void
  onDelete: (id: string) => void
  onToggleAvailability: (id: string, isAvailable: boolean) => void
  onToggleFeatured: (id: string, isFeatured: boolean) => void
  onMoveItem: (id: string, direction: "up" | "down") => void
  isItemActionPending: (itemId: string, action: ItemAction) => boolean
}

const formatPrice = (price: number): string => currencyFormatter.format(price)

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  categoryName,
  onEdit,
  onDelete,
  onToggleAvailability,
  onToggleFeatured,
  onMoveItem,
  isItemActionPending,
}) => {
  const isMoveUpPending = isItemActionPending(item._id, "reorder-up")
  const isMoveDownPending = isItemActionPending(item._id, "reorder-down")
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
    <article
      className="rounded-lg border border-border bg-card p-4 transition-[box-shadow] hover:shadow-md motion-reduce:transition-none"
      aria-busy={isAnyPending}
    >
      <div className="flex flex-col gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={item.images?.[0]?.url ?? ""}
              alt={item.name}
              className="size-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h2 className="truncate text-sm font-medium text-foreground" title={item.name}>
              {item.name}
            </h2>
            <p className="truncate text-xs text-muted-foreground" title={categoryName}>
              {categoryName}
            </p>
          </div>
        </div>

        <div
          className="grid grid-cols-5 gap-1"
          aria-label={`Thao tác cho món ${item.name}`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMoveItem(item._id, "up")}
            className="justify-self-center"
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
            className="justify-self-center"
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
            onClick={() => onToggleFeatured(item._id, item.is_featured)}
            className="justify-self-center"
            disabled={isAnyPending}
            aria-label={
              item.is_featured
                ? `Bỏ nổi bật món ${item.name}`
                : `Đánh dấu nổi bật món ${item.name}`
            }
            title={item.is_featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
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
            onClick={() => onEdit(item)}
            className="justify-self-center"
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
            className="justify-self-center text-error hover:text-error"
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
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-primary">
            {formatPrice(item.base_price)}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {item.is_featured && (
              <span className="flex items-center gap-1 text-warning">
                <Icon name="Star" size={12} aria-hidden="true" />
                <span className="text-xs">Nổi bật</span>
              </span>
            )}
            <span
              className={
                item.is_available
                  ? "flex items-center gap-1 text-success"
                  : "flex items-center gap-1 text-warning"
              }
            >
              <Icon
                name={item.is_available ? "CheckCircle" : "XCircle"}
                size={12}
                aria-hidden="true"
              />
              <span className="text-xs">
                {item.is_available ? "Kích hoạt" : "Tạm ngưng"}
              </span>
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Cập nhật:{" "}
          {new Date(item.updated_at || item.created_at).toLocaleDateString(
            "vi-VN"
          )}
        </p>

        <div className="border-t border-border pt-2">
          <Button
            variant={item.is_available ? "outline" : "default"}
            size="sm"
            fullWidth
            onClick={() => onToggleAvailability(item._id, item.is_available)}
            iconName={
              isToggleAvailabilityPending
                ? undefined
                : item.is_available
                  ? "XCircle"
                  : "CheckCircle"
            }
            iconPosition="left"
            disabled={isAnyPending}
          >
            {isToggleAvailabilityPending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-4" />
                Đang cập nhật…
              </span>
            ) : item.is_available ? (
              "Tạm ngưng"
            ) : (
              "Kích hoạt"
            )}
          </Button>
        </div>
      </div>
    </article>
  )
}

export default MenuItemCard
