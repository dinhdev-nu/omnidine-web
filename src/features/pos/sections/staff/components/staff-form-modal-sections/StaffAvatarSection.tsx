import type React from "react"
import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import Button from "../../../../ui/Button"
import type { StaffFormSectionProps } from "../staff-form-modal.types"

export interface StaffAvatarSectionProps extends Pick<
  StaffFormSectionProps,
  "errors" | "isLoading" | "isUploading"
> {
  imagePreview: string
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveImage: () => void
}

export function StaffAvatarSection({
  errors,
  isLoading,
  isUploading,
  imagePreview,
  fileInputRef,
  handleFileChange,
  handleRemoveImage,
}: StaffAvatarSectionProps) {
  const isDisabled = isLoading || isUploading

  return (
    <section
      aria-labelledby="staff-avatar-section-title"
      className="flex flex-col gap-4 rounded-lg border border-border p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="staff-avatar-section-title"
            className="flex items-center gap-2 text-base font-semibold text-foreground"
          >
            <Icon name="Image" size={18} aria-hidden="true" />
            <span>Ảnh đại diện</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Ảnh tải lên thành công sẽ tự động cập nhật hồ sơ.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative shrink-0">
          <div className="size-24 overflow-hidden rounded-full border-2 border-border bg-muted">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Ảnh đại diện của nhân viên"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Icon name="User" size={40} className="text-muted-foreground" />
              </div>
            )}
          </div>
          {imagePreview && (
            <Button
              variant="error"
              size="icon"
              onClick={handleRemoveImage}
              disabled={isDisabled}
              aria-label="Xóa ảnh đại diện đã chọn"
              className="absolute -top-2 -right-2 rounded-full"
            >
              <Icon name="X" size={16} aria-hidden="true" />
            </Button>
          )}
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-2">
          <input
            name="avatar"
            aria-label="Tải ảnh nhân viên"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isDisabled}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
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
            <p role="alert" className="mt-1 text-xs text-error">
              {errors.avatar_url}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
