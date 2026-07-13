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
    <section
      aria-labelledby="staff-profile-section-title"
      className="flex flex-col gap-4 rounded-lg border border-border p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3
            id="staff-profile-section-title"
            className="flex items-center gap-2 text-base font-semibold text-foreground"
          >
            <Icon name="User" size={18} aria-hidden="true" />
            <span>Thông tin hồ sơ</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Cập nhật thông tin nhận diện và liên hệ của nhân viên.
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
          name="employee_code"
          label="Mã nhân viên"
          type="text"
          placeholder="VD: NV001"
          autoComplete="off"
          value={formData.employee_code}
          onChange={(e) => onFieldChange("employee_code", e.target.value)}
          error={errors.employee_code}
          required
          disabled={isEditMode || isLoading}
        />
        <Input
          name="full_name"
          label="Họ và tên"
          type="text"
          placeholder="Nhập họ tên đầy đủ"
          autoComplete="name"
          value={formData.full_name}
          onChange={(e) => onFieldChange("full_name", e.target.value)}
          error={errors.full_name}
          required
          disabled={isLoading}
        />
        <Select
          name="position"
          label="Vai trò"
          placeholder="Chọn vai trò"
          options={ROLE_OPTIONS}
          value={formData.position}
          onChange={(event) => onFieldChange("position", event.target.value)}
          error={errors.position}
          required
          disabled={isLoading}
        />
        <Input
          name="hire_date"
          label="Ngày bắt đầu"
          type="date"
          autoComplete="off"
          value={formData.hire_date}
          onChange={(e) => onFieldChange("hire_date", e.target.value)}
          error={errors.hire_date}
          required={!isEditMode}
          disabled={isLoading}
        />
        <Input
          name="phone"
          label="Số điện thoại"
          type="tel"
          placeholder="0123 456 789"
          autoComplete="tel"
          inputMode="tel"
          value={formData.phone}
          onChange={(e) => onFieldChange("phone", e.target.value)}
          error={errors.phone}
          disabled={isLoading}
        />
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          inputMode="email"
          value={formData.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          error={errors.email}
          disabled={isLoading}
        />
      </div>
    </section>
  )
}
