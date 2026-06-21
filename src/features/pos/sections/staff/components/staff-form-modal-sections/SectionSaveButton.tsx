import Button from "../../../../ui/Button"
import type { StaffSubmitSection } from "../staff-form-modal.types"

export interface SectionSaveButtonProps {
  section: Exclude<StaffSubmitSection, "all">
  isEditMode: boolean
  isDisabled: boolean
  onSubmit: (section?: StaffSubmitSection) => void
}

export function SectionSaveButton({
  section,
  isEditMode,
  isDisabled,
  onSubmit,
}: SectionSaveButtonProps) {
  if (!isEditMode) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onSubmit(section)}
      disabled={isDisabled}
      iconName="Save"
      iconPosition="left"
    >
      Lưu phần này
    </Button>
  )
}
