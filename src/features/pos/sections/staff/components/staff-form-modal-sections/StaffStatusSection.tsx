import Icon from "@/components/AppIcon"
import Select from "../../../../ui/Select"
import type { StaffFormSectionProps } from "../staff-form-modal.types"
import { STATUS_OPTIONS } from "./staff-form-section.constants"
import { SectionSaveButton } from "./SectionSaveButton"

export function StaffStatusSection({
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
            <Icon name="Activity" size={18} />
            <span>Tráº¡ng thÃ¡i lÃ m viá»‡c</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Cáº­p nháº­t qua API: update-status
          </p>
        </div>
        <SectionSaveButton
          section="status"
          isEditMode={isEditMode}
          isDisabled={isLoading || isUploading}
          onSubmit={onSubmit}
        />
      </div>

      <Select
        label="Tráº¡ng thÃ¡i"
        placeholder="Chá»n tráº¡ng thÃ¡i"
        options={STATUS_OPTIONS}
        value={formData.status}
        onChange={(event) => onFieldChange("status", event.target.value)}
        error={errors.status}
      />
    </div>
  )
}
