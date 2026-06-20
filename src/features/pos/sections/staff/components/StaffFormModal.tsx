import React from "react"
import { toast } from "sonner"

import { uploadSingleFile } from "@/services/uploads"
import type { StaffPermissions } from "@/types/domain/staff"

import {
  StaffAccountSection,
  StaffAvatarSection,
  StaffFormFooter,
  StaffFormHeader,
  StaffPermissionsSection,
  StaffProfileSection,
  StaffStatusSection,
} from "./StaffFormModalSections"
import type { StaffFormData, StaffFormModalProps } from "./staff-form-modal.types"
export type {
  StaffFormData,
  StaffFormMode,
  StaffSubmitSection,
} from "./staff-form-modal.types"

const EMPTY_STAFF_ERRORS: Partial<Record<keyof StaffFormData, string>> = {}

const StaffFormModal: React.FC<StaffFormModalProps> = ({
  isOpen,
  mode = "add",
  formData,
  errors = EMPTY_STAFF_ERRORS,
  isLoading = false,
  onClose,
  onFieldChange,
  onSubmit,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const imagePreview = formData.avatar_url ?? ""

  if (!isOpen) return null

  const isEditMode = mode === "edit"
  const title = isEditMode ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"
  const icon = isEditMode ? "Edit" : "UserPlus"
  const submitText = isEditMode ? "Lưu thay đổi" : "Thêm nhân viên"
  const submitIcon = isEditMode ? "Save" : "UserPlus"

  const handleRemoveImage = () => {
    onFieldChange("avatar_url", "")
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const uploadedInfo = await uploadSingleFile(file)
      onFieldChange("avatar_url", uploadedInfo.url)

      if (isEditMode) {
        onSubmit("avatar", { avatarUrl: uploadedInfo.url })
      }

      toast.success("Tải ảnh lên thành công")
    } catch (error: Error | unknown) {
      const err = error as Error
      toast.error(err.message || "Lỗi khi tải ảnh lên")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const togglePermission = (key: keyof StaffPermissions) => {
    onFieldChange("permissions", {
      ...formData.permissions,
      [key]: !formData.permissions[key],
    })
  }

  const sectionProps = {
    formData,
    errors,
    isEditMode,
    isLoading,
    isUploading,
    onSubmit,
    onFieldChange,
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center overflow-hidden">
      <button
        type="button"
        aria-label="Đóng modal nhân viên"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="shadow-modal relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-card">
        <StaffFormHeader title={title} icon={icon} onClose={onClose} />

        <div className="max-h-[calc(90vh-200px)] space-y-6 overflow-y-auto p-6">
          <StaffProfileSection {...sectionProps} />
          <StaffAccountSection {...sectionProps} />
          <StaffStatusSection {...sectionProps} />
          <StaffAvatarSection
            {...sectionProps}
            imagePreview={imagePreview}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handleRemoveImage={handleRemoveImage}
          />
          <StaffPermissionsSection
            {...sectionProps}
            togglePermission={togglePermission}
          />
        </div>

        <StaffFormFooter
          isEditMode={isEditMode}
          isLoading={isLoading}
          submitIcon={submitIcon}
          submitText={submitText}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}

export default StaffFormModal
