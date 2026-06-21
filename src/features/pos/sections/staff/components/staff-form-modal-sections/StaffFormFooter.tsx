import Button from "../../../../ui/Button"
import type { StaffFormModalProps } from "../staff-form-modal.types"

export interface StaffFormFooterProps {
  isEditMode: boolean
  isLoading: boolean
  submitIcon: string
  submitText: string
  onClose: () => void
  onSubmit: StaffFormModalProps["onSubmit"]
}

export function StaffFormFooter({
  isEditMode,
  isLoading,
  submitIcon,
  submitText,
  onClose,
  onSubmit,
}: StaffFormFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border p-6">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Hủy
      </Button>
      {!isEditMode && (
        <Button
          variant="default"
          onClick={() => onSubmit("all")}
          disabled={isLoading}
          iconName={submitIcon}
          iconPosition="left"
        >
          {submitText}
        </Button>
      )}
    </div>
  )
}
