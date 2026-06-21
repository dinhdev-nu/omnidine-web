import Icon from "@/components/AppIcon"
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
  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Icon name="Shield" size={18} />
            <span>Quyền truy cập</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Cập nhật qua API: update-permissions
          </p>
        </div>
        <SectionSaveButton
          section="permissions"
          isEditMode={isEditMode}
          isDisabled={isLoading || isUploading}
          onSubmit={onSubmit}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/20 p-4 sm:grid-cols-2 md:grid-cols-3">
        {PERMISSIONS_CONFIG.map((perm) => {
          const isChecked =
            !!formData.permissions?.[perm.key as keyof StaffPermissions]
          return (
            <label
              key={perm.key}
              className="group flex cursor-pointer items-center gap-3"
            >
              <div
                className={`flex size-5 items-center justify-center rounded border transition-colors ${isChecked ? "border-primary bg-primary" : "border-input bg-background group-hover:border-primary/50"}`}
              >
                {isChecked && (
                  <Icon
                    name="Check"
                    size={14}
                    className="text-primary-foreground"
                  />
                )}
              </div>
              <span className="text-sm font-medium text-card-foreground select-none">
                {perm.label}
              </span>
              <input
                type="checkbox"
                className="hidden"
                checked={isChecked}
                onChange={() =>
                  togglePermission(perm.key as keyof StaffPermissions)
                }
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}
