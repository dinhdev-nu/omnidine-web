import Button from "../../../ui/Button"
import type { MenuItemModalFooterProps } from "./menu-item-modal.types"

export function MenuItemModalFooter({
  isLoading,
  isEditing,
  formData,
  onClose,
  onSave,
}: MenuItemModalFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border p-6">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Hủy
      </Button>
      <Button
        variant="default"
        onClick={() => onSave(formData)}
        disabled={isLoading}
        iconName="Save"
        iconPosition="left"
      >
        {isEditing ? "Cập nhật" : "Thêm mới"}
      </Button>
    </div>
  )
}
