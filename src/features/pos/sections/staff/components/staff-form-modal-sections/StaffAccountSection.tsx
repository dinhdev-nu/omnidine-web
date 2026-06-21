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
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Icon name="Link" size={18} />
            <span>LiÃªn káº¿t tÃ i khoáº£n</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Cáº­p nháº­t qua API: link-account
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
        label="User ID liÃªn káº¿t"
        type="text"
        placeholder="Nháº­p user_id"
        value={formData.user_id}
        onChange={(e) => onFieldChange("user_id", e.target.value)}
        error={errors.user_id}
        required
      />
    </div>
  )
}
