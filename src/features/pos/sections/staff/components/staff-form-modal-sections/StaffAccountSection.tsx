import Icon from "@/components/AppIcon"
import Input from "../../../../ui/Input"
import type { StaffFormSectionProps } from "../staff-form-modal.types"
import { SectionSaveButton } from "./SectionSaveButton"

export function StaffAccountSection({
  formData,
  errors,
  isEditMode,
  isLoading,
  isUploading,
  onSubmit,
  onFieldChange,
}: StaffFormSectionProps) {
  return (
    <section
      aria-labelledby="staff-account-section-title"
      className="flex flex-col gap-4 rounded-lg border border-border p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3
            id="staff-account-section-title"
            className="flex items-center gap-2 text-base font-semibold text-foreground"
          >
            <Icon name="Link" size={18} aria-hidden="true" />
            <span>Liên kết tài khoản</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Liên kết hồ sơ này với một tài khoản người dùng hiện có.
          </p>
        </div>
        <SectionSaveButton
          section="account"
          isEditMode={isEditMode}
          isDisabled={isLoading || isUploading}
          onSubmit={onSubmit}
        />
      </div>

      <Input
        name="linked_user_id"
        label="User ID liên kết"
        type="text"
        placeholder="Nhập user_id"
        autoComplete="off"
        spellCheck={false}
        value={formData.user_id}
        onChange={(e) => onFieldChange("user_id", e.target.value)}
        error={errors.user_id}
        required
        disabled={isLoading}
      />
    </section>
  )
}
