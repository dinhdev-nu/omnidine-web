import React, { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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
  returnFocusRef,
}) => {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("upload")
  const [pendingImageUrl, setPendingImageUrl] = useState("")

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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50"
        className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-lg border border-border bg-card p-0 shadow-xl sm:max-w-2xl"
        aria-busy={isLoading}
        onEscapeKeyDown={(event) => {
          if (isLoading) event.preventDefault()
        }}
        onPointerDownOutside={(event) => {
          if (isLoading) event.preventDefault()
        }}
        onCloseAutoFocus={(event) => {
          const trigger = returnFocusRef?.current
          if (trigger?.isConnected) {
            event.preventDefault()
            trigger.focus()
          }
        }}
      >
        <form
          noValidate
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          onSubmit={(event) => {
            event.preventDefault()
            if (!isLoading) onSave(formData)
          }}
        >
          <MenuItemModalHeader
            isEditing={isEditing}
            isLoading={isLoading}
          />

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
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
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MenuItemModal
