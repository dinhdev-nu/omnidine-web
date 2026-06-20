import type React from "react"

import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import type {
  StaffPermissions,
  StaffPosition,
  StaffStatus,
} from "@/types/domain/staff"

import Button from "../../../ui/Button"
import Input from "../../../ui/Input"
import Select from "../../../ui/Select"

import type {
  StaffFormModalProps,
  StaffFormSectionProps,
  StaffSubmitSection,
} from "./StaffFormModal.types"

const PERMISSIONS_CONFIG = [
  { key: "can_discount", label: "Giảm giá" },
  { key: "can_cancel_order", label: "Hủy đơn" },
  { key: "can_process_payment", label: "Thanh toán" },
  { key: "can_refund", label: "Hoàn tiền" },
  { key: "can_view_reports", label: "Xem báo cáo" },
  { key: "can_manage_tables", label: "Quản lý bàn" },
  { key: "can_manage_menu", label: "Quản lý menu" },
] as const

interface SectionSaveButtonProps {
  section: Exclude<StaffSubmitSection, "all">
  isEditMode: boolean
  isDisabled: boolean
  onSubmit: (section?: StaffSubmitSection) => void
}

function SectionSaveButton({
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

// ── Static options ────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  { value: "manager" as StaffPosition, label: "Quản lý" },
  { value: "cashier" as StaffPosition, label: "Thu ngân" },
  { value: "kitchen" as StaffPosition, label: "Nhân viên bếp" },
  { value: "waiter" as StaffPosition, label: "Phục vụ" },
  { value: "delivery" as StaffPosition, label: "Giao hàng" },
]

const STATUS_OPTIONS = [
  { value: "active" as StaffStatus, label: "Đang làm việc" },
  { value: "inactive" as StaffStatus, label: "Không hoạt động" },
  { value: "on_leave" as StaffStatus, label: "Đang nghỉ" },
  { value: "terminated" as StaffStatus, label: "Đã nghỉ việc" },
]

// ── Component ─────────────────────────────────────────────────────────────────

interface StaffFormHeaderProps {
  title: string
  icon: string
  onClose: () => void
}

export function StaffFormHeader({
  title,
  icon,
  onClose,
}: StaffFormHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Icon name={icon} size={20} color="white" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="hover-scale"
      >
        <Icon name="X" size={20} />
      </Button>
    </div>
  )
}

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
            <span>Thông tin hồ sơ</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Cập nhật qua API: update-info
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
          label="Mã nhân viên"
          type="text"
          placeholder="VD: NV001"
          value={formData.employee_code}
          onChange={(e) => onFieldChange("employee_code", e.target.value)}
          error={errors.employee_code}
          required
          disabled={isEditMode}
        />
        <Input
          label="Họ và tên"
          type="text"
          placeholder="Nhập họ tên đầy đủ"
          value={formData.full_name}
          onChange={(e) => onFieldChange("full_name", e.target.value)}
          error={errors.full_name}
          required
        />
        <Select
          label="Vai trò"
          placeholder="Chọn vai trò"
          options={ROLE_OPTIONS}
          value={formData.position}
          onChange={(event) => onFieldChange("position", event.target.value)}
          error={errors.position}
          required
        />
        <Input
          label="Ngày bắt đầu"
          type="date"
          value={formData.hire_date}
          onChange={(e) => onFieldChange("hire_date", e.target.value)}
          error={errors.hire_date}
          required={!isEditMode}
        />
        <Input
          label="Số điện thoại"
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
            <span>Liên kết tài khoản</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Cập nhật qua API: link-account
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
        label="User ID liên kết"
        type="text"
        placeholder="Nhập user_id"
        value={formData.user_id}
        onChange={(e) => onFieldChange("user_id", e.target.value)}
        error={errors.user_id}
        required
      />
    </div>
  )
}

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
            <span>Trạng thái làm việc</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Cập nhật qua API: update-status
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
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        options={STATUS_OPTIONS}
        value={formData.status}
        onChange={(event) => onFieldChange("status", event.target.value)}
        error={errors.status}
      />
    </div>
  )
}

interface StaffAvatarSectionProps extends Pick<
  StaffFormSectionProps,
  "errors" | "isUploading"
> {
  imagePreview: string
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveImage: () => void
}

export function StaffAvatarSection({
  errors,
  isUploading,
  imagePreview,
  fileInputRef,
  handleFileChange,
  handleRemoveImage,
}: StaffAvatarSectionProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Icon name="Image" size={18} />
            <span>Ảnh đại diện</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload thành công sẽ tự cập nhật avatar
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="size-24 overflow-hidden rounded-full border-2 border-border bg-muted">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Icon name="User" size={40} className="text-muted-foreground" />
              </div>
            )}
          </div>
          {imagePreview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="bg-error hover:bg-error/80 absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full transition-colors"
            >
              <Icon name="X" size={14} color="white" />
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            aria-label="Táº£i áº£nh nhÃ¢n viÃªn"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            iconName={isUploading ? "Loader" : "Upload"}
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            {isUploading ? "Đang tải lên..." : "Chọn ảnh từ máy..."}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Hỗ trợ định dạng JPG, PNG, WEBP.
          </p>
          {errors.avatar_url && (
            <p className="text-error mt-1 text-xs">{errors.avatar_url}</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface StaffPermissionsSectionProps extends StaffFormSectionProps {
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

interface StaffFormFooterProps {
  isEditMode: boolean
  isLoading: boolean
  submitIcon: string
  submitText: string
  onClose: () => void
  onSubmit: StaffFormModalProps["onSubmit"]
}

export function StaffFormFooter({
  isEditMode,
  isLoading,
  submitIcon,
  submitText,
  onClose,
  onSubmit,
}: StaffFormFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border p-6">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Hủy
      </Button>
      {!isEditMode && (
        <Button
          variant="default"
          onClick={() => onSubmit("all")}
          disabled={isLoading}
          iconName={submitIcon}
          iconPosition="left"
        >
          {submitText}
        </Button>
      )}
    </div>
  )
}
