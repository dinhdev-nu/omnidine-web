import Icon from "@/components/AppIcon"
import Input from "../../../../ui/Input"
import Select from "../../../../ui/Select"
import type { StaffFormSectionProps } from "../staff-form-modal.types"
import { ROLE_OPTIONS } from "./staff-form-section.constants"
import { SectionSaveButton } from "./SectionSaveButton"

export function StaffProfileSection({
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
            <Icon name="User" size={18} />
            <span>ThÃ´ng tin há»“ sÆ¡</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Cáº­p nháº­t qua API: update-info
          </p>
        </div>
        <SectionSaveButton
          section="info"
          isEditMode={isEditMode}
          isDisabled={isLoading || isUploading}
          onSubmit={onSubmit}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="MÃ£ nhÃ¢n viÃªn"
          type="text"
          placeholder="VD: NV001"
          value={formData.employee_code}
          onChange={(e) => onFieldChange("employee_code", e.target.value)}
          error={errors.employee_code}
          required
          disabled={isEditMode}
        />
        <Input
          label="Há» vÃ  tÃªn"
          type="text"
          placeholder="Nháº­p há» tÃªn Ä‘áº§y Ä‘á»§"
          value={formData.full_name}
          onChange={(e) => onFieldChange("full_name", e.target.value)}
          error={errors.full_name}
          required
        />
        <Select
          label="Vai trÃ²"
          placeholder="Chá»n vai trÃ²"
          options={ROLE_OPTIONS}
          value={formData.position}
          onChange={(event) => onFieldChange("position", event.target.value)}
          error={errors.position}
          required
        />
        <Input
          label="NgÃ y báº¯t Ä‘áº§u"
          type="date"
          value={formData.hire_date}
          onChange={(e) => onFieldChange("hire_date", e.target.value)}
          error={errors.hire_date}
          required={!isEditMode}
        />
        <Input
          label="Sá»‘ Ä‘iá»‡n thoáº¡i"
          type="tel"
          placeholder="0123 456 789"
          value={formData.phone}
          onChange={(e) => onFieldChange("phone", e.target.value)}
          error={errors.phone}
        />
        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          error={errors.email}
        />
      </div>
    </div>
  )
}
