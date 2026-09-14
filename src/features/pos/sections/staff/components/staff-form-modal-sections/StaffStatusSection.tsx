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
    <section
      aria-labelledby="staff-status-section-title"
      className="flex flex-col gap-4 rounded-lg border border-border p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3
            id="staff-status-section-title"
            className="flex items-center gap-2 text-base font-semibold text-foreground"
          >
            <Icon name="Activity" size={18} aria-hidden="true" />
            <span>Trạng thái làm việc</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Chọn trạng thái hiện tại của nhân viên.
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
        name="status"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        options={STATUS_OPTIONS}
        value={formData.status}
        onChange={(event) => onFieldChange("status", event.target.value)}
        error={errors.status}
        disabled={isLoading}
      />
    </section>
  )
}
