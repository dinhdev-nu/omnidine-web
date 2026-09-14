import Icon from "@/components/AppIcon"
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Button from "../../../ui/Button"
import type { MenuItemModalHeaderProps } from "./menu-item-modal.types"

export function MenuItemModalHeader({
  isEditing,
  isLoading,
}: MenuItemModalHeaderProps) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-4 sm:p-6">
      <DialogHeader className="min-w-0 flex-1 flex-row items-center gap-3 text-left">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Icon
            name={isEditing ? "Edit" : "Plus"}
            size={20}
            color="white"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <DialogTitle className="text-xl leading-tight font-semibold text-pretty text-foreground">
            {isEditing ? "Chỉnh sửa món ăn" : "Thêm món mới"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing
              ? "Cập nhật thông tin, hình ảnh và trạng thái của món ăn."
              : "Nhập thông tin và hình ảnh cho món ăn mới."}
          </DialogDescription>
        </div>
      </DialogHeader>

      <DialogClose asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading}
          aria-label="Đóng hộp thoại món ăn"
          className="shrink-0"
        >
          <Icon name="X" size={20} aria-hidden="true" />
        </Button>
      </DialogClose>
    </div>
  )
}
