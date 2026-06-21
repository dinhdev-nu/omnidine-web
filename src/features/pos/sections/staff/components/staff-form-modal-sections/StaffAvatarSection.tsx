import type React from "react"
import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import Button from "../../../../ui/Button"
import type { StaffFormSectionProps } from "../staff-form-modal.types"

export interface StaffAvatarSectionProps extends Pick<
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
