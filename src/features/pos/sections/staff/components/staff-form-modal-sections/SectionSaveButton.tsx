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

  const sectionLabel = {
    info: "thông tin hồ sơ",
    account: "liên kết tài khoản",
    status: "trạng thái làm việc",
    avatar: "ảnh đại diện",
    permissions: "quyền truy cập",
  }[section]

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => onSubmit(section)}
      disabled={isDisabled}
      iconName="Save"
      iconPosition="left"
      aria-label={`Lưu phần ${sectionLabel}`}
      className="w-full sm:w-auto"
    >
      Lưu phần này
    </Button>
  )
}
