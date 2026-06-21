import React, { useState } from "react"
import {
  DEFAULT_MENU_ITEM,
  EMPTY_CATEGORIES,
  EMPTY_IMAGE_PREVIEW_URLS,
  EMPTY_MENU_ITEM_ERRORS,
} from "./menu-item-modal.constants"
import { MenuItemDetailsFields } from "./MenuItemDetailsFields"
import { MenuItemImageFields } from "./MenuItemImageFields"
import { MenuItemModalFooter } from "./MenuItemModalFooter"
import { MenuItemModalHeader } from "./MenuItemModalHeader"
import type { MenuItemModalProps, UploadMethod } from "./menu-item-modal.types"

export type { MenuItemFormData } from "./menu-item-modal.types"

const MenuItemModal: React.FC<MenuItemModalProps> = ({
  isOpen,
  isLoading = false,
  isEditing = false,
  item = null,
  imagePreviewUrls = EMPTY_IMAGE_PREVIEW_URLS,
  categories = EMPTY_CATEGORIES,
  errors = EMPTY_MENU_ITEM_ERRORS,
  onClose,
  onSave,
  onFieldChange,
  onImageFileChange,
  onAddImageUrl,
  onRemoveImageAt,
}) => {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("upload")
  const [pendingImageUrl, setPendingImageUrl] = useState("")

  if (!isOpen) return null

  const formData = item ?? DEFAULT_MENU_ITEM
  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    onImageFileChange(files)
    e.currentTarget.value = ""
  }

  const imagePreviews = imagePreviewUrls

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center overflow-hidden">
      <button
        type="button"
        aria-label="Đóng modal món ăn"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="shadow-modal relative mx-4 max-h-[90vh] w-full max-w-2xl animate-in overflow-hidden rounded-lg border border-border bg-card duration-200 zoom-in-95 fade-in">
        <MenuItemModalHeader isEditing={isEditing} onClose={onClose} />

        <div className="max-h-[calc(90vh-140px)] space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MenuItemDetailsFields
              formData={formData}
              categoryOptions={categoryOptions}
              errors={errors}
              isEditing={isEditing}
              onFieldChange={onFieldChange}
            />
            <MenuItemImageFields
              uploadMethod={uploadMethod}
              setUploadMethod={setUploadMethod}
              pendingImageUrl={pendingImageUrl}
              setPendingImageUrl={setPendingImageUrl}
              handleFileUpload={handleFileUpload}
              imagePreviews={imagePreviews}
              onAddImageUrl={onAddImageUrl}
              onRemoveImageAt={onRemoveImageAt}
            />
          </div>
        </div>

        <MenuItemModalFooter
          isLoading={isLoading}
          isEditing={isEditing}
          formData={formData}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  )
}

export default MenuItemModal
