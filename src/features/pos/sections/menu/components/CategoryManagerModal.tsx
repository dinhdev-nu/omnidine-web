import React from "react"
import type { RefObject } from "react"

import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { MenuCategoryWithCount } from "@/types/domain/menu"

import Button from "../../../ui/Button"
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
  returnFocusRef?: RefObject<HTMLElement | null>
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
  returnFocusRef,
}) => {
  const hasPendingAction = categories.some(
    (category) =>
      checkingToggleCategoryId === category._id ||
      isCategoryActionPending(category._id, "toggle-active") ||
      isCategoryActionPending(category._id, "reorder-up") ||
      isCategoryActionPending(category._id, "reorder-down") ||
      isCategoryActionPending(category._id, "delete")
  )

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !hasPendingAction) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50"
        className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-3xl flex-col gap-0 overflow-hidden rounded-lg border border-border bg-card p-0 shadow-xl sm:max-w-3xl"
        aria-busy={hasPendingAction}
        onEscapeKeyDown={(event) => {
          if (hasPendingAction) event.preventDefault()
        }}
        onPointerDownOutside={(event) => {
          if (hasPendingAction) event.preventDefault()
        }}
        onCloseAutoFocus={(event) => {
          const trigger = returnFocusRef?.current
          if (trigger?.isConnected) {
            event.preventDefault()
            trigger.focus()
          }
        }}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-4 sm:p-6">
          <DialogHeader className="min-w-0 flex-1 flex-row items-center gap-3 text-left">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Icon
                name="Settings"
                size={20}
                color="white"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-xl leading-tight font-semibold text-pretty text-foreground">
                Quản lý danh mục
              </DialogTitle>
              <DialogDescription className="text-pretty">
                Sắp xếp, chỉnh sửa hoặc thay đổi trạng thái các danh mục.
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={hasPendingAction}
              aria-label="Đóng hộp thoại quản lý danh mục"
              className="shrink-0"
            >
              <Icon name="X" size={20} aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {categories.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 px-4 text-center">
              <Icon
                name="FolderOpen"
                size={36}
                className="text-muted-foreground"
                aria-hidden="true"
              />
              <p className="font-medium text-foreground">Chưa có danh mục</p>
              <p className="text-sm text-pretty text-muted-foreground">
                Thêm danh mục để sắp xếp các món trong thực đơn.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3" role="list">
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
                    role="listitem"
                    aria-busy={isAnyPending}
                    className="flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="size-11 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                        {category.image_url ? (
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <Icon
                              name="Image"
                              size={16}
                              className="text-muted-foreground"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <p
                            className="min-w-0 max-w-full truncate text-sm font-medium text-foreground"
                            title={category.name}
                          >
                            {category.name}
                          </p>
                          <Badge
                            variant={
                              category.is_active ? "default" : "secondary"
                            }
                          >
                            {category.is_active ? "Đang bật" : "Đang ẩn"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {category.item_count || 0} món
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 sm:flex sm:items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMove(category._id, "up")}
                        disabled={index === 0 || isAnyPending}
                        aria-label={`Đưa danh mục ${category.name} lên`}
                        title="Đưa lên"
                        className="justify-self-center"
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
                        onClick={() => onMove(category._id, "down")}
                        disabled={
                          index === categories.length - 1 || isAnyPending
                        }
                        aria-label={`Đưa danh mục ${category.name} xuống`}
                        title="Đưa xuống"
                        className="justify-self-center"
                      >
                        {isMoveDownPending ? (
                          <Spinner className="size-4" />
                        ) : (
                          <Icon
                            name="ChevronDown"
                            size={16}
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(category)}
                        disabled={isAnyPending}
                        aria-label={`Chỉnh sửa danh mục ${category.name}`}
                        title="Chỉnh sửa"
                        className="justify-self-center"
                      >
                        <Icon name="Edit" size={16} aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onToggleActive(category._id, category.is_active)
                        }
                        disabled={isAnyPending}
                        aria-label={
                          category.is_active
                            ? `Ẩn danh mục ${category.name}`
                            : `Hiện danh mục ${category.name}`
                        }
                        title={
                          category.is_active
                            ? "Ẩn danh mục"
                            : "Hiện danh mục"
                        }
                        className="justify-self-center"
                      >
                        {isTogglePending ? (
                          <Spinner className="size-4" />
                        ) : (
                          <Icon
                            name={category.is_active ? "EyeOff" : "Eye"}
                            size={16}
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(category._id)}
                        disabled={isAnyPending}
                        aria-label={`Xóa danh mục ${category.name}`}
                        title="Xóa"
                        className="justify-self-center text-error hover:text-error"
                      >
                        {isDeletePending ? (
                          <Spinner className="size-4" />
                        ) : (
                          <Icon name="Trash2" size={16} aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none bg-card p-4 sm:p-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={hasPendingAction}
              className="w-full sm:w-auto"
            >
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryManagerModal
