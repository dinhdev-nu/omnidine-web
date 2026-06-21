import Icon from "@/components/AppIcon"
import Button from "../../../ui/Button"
import type { MenuItemModalHeaderProps } from "./menu-item-modal.types"

export function MenuItemModalHeader({
  isEditing,
  onClose,
}: MenuItemModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Icon name={isEditing ? "Edit" : "Plus"} size={20} color="white" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          {isEditing ? "Chỉnh sửa món ăn" : "Thêm món mới"}
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
  )
}
