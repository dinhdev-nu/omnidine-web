import React from "react"
import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import Button from "../../../ui/Button"
import type { MenuCategoryWithCount } from "@/types/domain/menu"
import { Spinner } from "../../../ui/Spinner"

type CategoryAction = "toggle-active" | "reorder-up" | "reorder-down" | "delete"

interface CategoryManagerModalProps {
  isOpen: boolean
  categories: MenuCategoryWithCount[]
  checkingToggleCategoryId?: string | null
  onClose: () => void
  onEdit: (category: MenuCategoryWithCount) => void
  onToggleActive: (categoryId: string, isActive: boolean) => void
  onDelete: (categoryId: string) => void
  onMove: (categoryId: string, direction: "up" | "down") => void
  isCategoryActionPending: (
    categoryId: string,
    action: CategoryAction
  ) => boolean
}

const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  categories,
  checkingToggleCategoryId = null,
  onClose,
  onEdit,
  onToggleActive,
  onDelete,
  onMove,
  isCategoryActionPending,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center overflow-hidden">
      <button
        type="button"
        aria-label="ÄÃ³ng modal quáº£n lÃ½ danh má»¥c"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="shadow-modal relative mx-4 w-full max-w-3xl animate-in rounded-lg border border-border bg-card duration-200 zoom-in-95 fade-in">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Icon name="Settings" size={20} color="white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Quản lý danh mục
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover-scale"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="flex flex-col gap-3">
            {categories.map((category, index) => {
              const isMoveUpPending = isCategoryActionPending(
                category._id,
                "reorder-up"
              )
              const isMoveDownPending = isCategoryActionPending(
                category._id,
                "reorder-down"
              )
              const isTogglePending =
                isCategoryActionPending(category._id, "toggle-active") ||
                checkingToggleCategoryId === category._id
              const isDeletePending = isCategoryActionPending(
                category._id,
                "delete"
              )
              const isAnyPending =
                isMoveUpPending ||
                isMoveDownPending ||
                isTogglePending ||
                isDeletePending

              return (
                <div
                  key={category._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="size-10 overflow-hidden rounded-md border border-border bg-muted">
                      {category.image_url ? (
                        <Image
                          src={category.image_url}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Icon
                            name="Image"
                            size={14}
                            className="text-muted-foreground"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        {category.name}
                      </p>
                      <span
                        className={
                          category.is_active
                            ? "rounded-full bg-success/10 px-2 py-0.5 text-xs text-success"
                            : "rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning"
                        }
                      >
                        {category.is_active ? "Đang bật" : "Đang ẩn"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {category.item_count || 0} món
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => onMove(category._id, "up")}
                      disabled={index === 0 || isAnyPending}
                      title="Đưa lên"
                    >
                      {isMoveUpPending ? (
                        <Spinner className="size-4" />
                      ) : (
                        <Icon name="ChevronUp" size={16} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => onMove(category._id, "down")}
                      disabled={index === categories.length - 1 || isAnyPending}
                      title="Đưa xuống"
                    >
                      {isMoveDownPending ? (
                        <Spinner className="size-4" />
                      ) : (
                        <Icon name="ChevronDown" size={16} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => onEdit(category)}
                      disabled={isAnyPending}
                      title="Chỉnh sửa"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() =>
                        onToggleActive(category._id, category.is_active)
                      }
                      disabled={isAnyPending}
                      title={
                        category.is_active ? "Ẩn danh mục" : "Hiện danh mục"
                      }
                    >
                      {isTogglePending ? (
                        <Spinner className="size-4" />
                      ) : (
                        <Icon
                          name={category.is_active ? "EyeOff" : "Eye"}
                          size={16}
                        />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-error hover:text-error size-8"
                      onClick={() => onDelete(category._id)}
                      disabled={isAnyPending}
                      title="Xóa"
                    >
                      {isDeletePending ? (
                        <Spinner className="size-4" />
                      ) : (
                        <Icon name="Trash2" size={16} />
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border p-6">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CategoryManagerModal
