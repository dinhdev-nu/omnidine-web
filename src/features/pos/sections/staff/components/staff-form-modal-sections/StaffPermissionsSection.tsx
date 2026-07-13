import Icon from "@/components/AppIcon"
import { Checkbox } from "@/components/ui/checkbox"
import type { StaffPermissions } from "@/types/domain/staff"
import type { StaffFormSectionProps } from "../staff-form-modal.types"
import { PERMISSIONS_CONFIG } from "./staff-form-section.constants"
import { SectionSaveButton } from "./SectionSaveButton"

export interface StaffPermissionsSectionProps extends StaffFormSectionProps {
  togglePermission: (key: keyof StaffPermissions) => void
}

export function StaffPermissionsSection({
  formData,
  isEditMode,
  isLoading,
  isUploading,
  onSubmit,
  togglePermission,
}: StaffPermissionsSectionProps) {
  const isDisabled = isLoading || isUploading

  return (
    <section
      aria-labelledby="staff-permissions-section-title"
      className="flex flex-col gap-4 rounded-lg border border-border p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3
            id="staff-permissions-section-title"
            className="flex items-center gap-2 text-base font-semibold text-foreground"
          >
            <Icon name="Shield" size={18} aria-hidden="true" />
            <span>Quyền truy cập</span>
          </h3>
          <p id="staff-permissions-description" className="mt-1 text-xs text-muted-foreground">
            Chọn các thao tác mà nhân viên được phép thực hiện trong POS.
          </p>
        </div>
        <SectionSaveButton
          section="permissions"
          isEditMode={isEditMode}
          isDisabled={isDisabled}
          onSubmit={onSubmit}
        />
      </div>

      <fieldset
        disabled={isDisabled}
        aria-describedby="staff-permissions-description"
        className="grid grid-cols-1 gap-1 rounded-lg bg-muted/20 p-2 sm:grid-cols-2 sm:gap-2 md:grid-cols-3"
      >
        <legend className="sr-only">Quyền được cấp cho nhân viên</legend>
        {PERMISSIONS_CONFIG.map((permission) => {
          const permissionKey = permission.key as keyof StaffPermissions
          const checkboxId = `staff-permission-${permission.key}`
          const isChecked = Boolean(formData.permissions?.[permissionKey])

          return (
            <label
              key={permission.key}
              htmlFor={checkboxId}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted/50 motion-reduce:transition-none has-disabled:cursor-not-allowed has-disabled:opacity-50"
            >
              <Checkbox
                id={checkboxId}
                name={`permissions.${permission.key}`}
                checked={isChecked}
                disabled={isDisabled}
                onCheckedChange={() => togglePermission(permissionKey)}
              />
              <span className="min-w-0 break-words select-none">
                {permission.label}
              </span>
            </label>
          )
        })}
      </fieldset>
    </section>
  )
}
