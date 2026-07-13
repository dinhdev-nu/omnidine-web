import React from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { uploadSingleFile } from "@/services/uploads"
import type { StaffPermissions } from "@/types/domain/staff"

import { Spinner } from "../../../ui/Spinner"
import { StaffAccountSection } from "./staff-form-modal-sections/StaffAccountSection"
import { StaffAvatarSection } from "./staff-form-modal-sections/StaffAvatarSection"
import { StaffFormFooter } from "./staff-form-modal-sections/StaffFormFooter"
import { StaffFormHeader } from "./staff-form-modal-sections/StaffFormHeader"
import { StaffPermissionsSection } from "./staff-form-modal-sections/StaffPermissionsSection"
import { StaffProfileSection } from "./staff-form-modal-sections/StaffProfileSection"
import { StaffStatusSection } from "./staff-form-modal-sections/StaffStatusSection"
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
  isInitializing = false,
  onClose,
  onFieldChange,
  onSubmit,
  returnFocusRef,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const imagePreview = formData.avatar_url ?? ""

  const isEditMode = mode === "edit"
  const title = isEditMode ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"
  const icon = isEditMode ? "Edit" : "UserPlus"
  const submitText = isEditMode ? "Lưu thay đổi" : "Thêm nhân viên"
  const submitIcon = isEditMode ? "Save" : "UserPlus"
  const areControlsDisabled = isLoading || isInitializing
  const isCloseDisabled = isLoading || isUploading

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
    isLoading: areControlsDisabled,
    isUploading,
    onSubmit,
    onFieldChange,
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isCloseDisabled) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        aria-busy={isLoading || isUploading || isInitializing}
        className="block max-h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] gap-0 overflow-hidden rounded-lg p-0 sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl"
        onCloseAutoFocus={(event) => {
          const trigger = returnFocusRef?.current
          if (trigger?.isConnected) {
            event.preventDefault()
            trigger.focus()
          }
        }}
      >
        <form
          className="grid max-h-[calc(100dvh-1rem)] min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden sm:max-h-[calc(100dvh-2rem)]"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit("all")
          }}
        >
          <StaffFormHeader
            title={title}
            icon={icon}
            isCloseDisabled={isCloseDisabled}
          />

          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain p-4 sm:gap-6 sm:p-6">
            {isInitializing && (
              <div
                role="status"
                aria-live="polite"
                className="flex min-h-11 items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 text-sm text-muted-foreground"
              >
                <Spinner className="size-4" aria-hidden="true" />
                Đang tải thông tin nhân viên…
              </div>
            )}
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
            isDisabled={isCloseDisabled || isInitializing}
            submitIcon={submitIcon}
            submitText={submitText}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default StaffFormModal
