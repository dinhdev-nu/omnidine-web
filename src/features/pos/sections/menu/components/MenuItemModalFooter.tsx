import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import Button from "../../../ui/Button"
import { Spinner } from "../../../ui/Spinner"
import type { MenuItemModalFooterProps } from "./menu-item-modal.types"

export function MenuItemModalFooter({
  isLoading,
  isEditing,
}: MenuItemModalFooterProps) {
  return (
    <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none bg-card p-4 sm:p-6">
      <DialogClose asChild>
        <Button
          variant="outline"
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          Hủy
        </Button>
      </DialogClose>
      <Button
        type="submit"
        variant="default"
        disabled={isLoading}
        iconName={isLoading ? undefined : "Save"}
        iconPosition="left"
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-4" />
            Đang lưu…
          </span>
        ) : isEditing ? (
          "Cập nhật"
        ) : (
          "Thêm mới"
        )}
      </Button>
    </DialogFooter>
  )
}
