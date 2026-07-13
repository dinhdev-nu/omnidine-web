import type React from "react"

export type ItemStatus = "available" | "unavailable"

export type FeaturedStatus = "normal" | "featured"

export interface MenuItemFormData {
  name: string
  description: string
  price: string
  sortOrder: string
  category: string
  imageUrls: string[]
  status: ItemStatus
  featured: FeaturedStatus
}

export interface Category {
  id: string
  name: string
}

export interface MenuItemModalProps {
  isOpen: boolean
  isLoading?: boolean
  isEditing?: boolean
  item?: MenuItemFormData | null
  imagePreviewUrls?: string[]
  categories?: Category[]
  errors?: Partial<Record<keyof MenuItemFormData, string>>
  onClose: () => void
  onSave: (data: MenuItemFormData) => void
  onFieldChange: (field: keyof MenuItemFormData, value: string) => void
  onImageFileChange: (files: File[]) => void
  onAddImageUrl: (url: string) => void
  onRemoveImageAt: (index: number) => void
  returnFocusRef?: React.RefObject<HTMLElement | null>
}

export type UploadMethod = "upload" | "url"

export type CategoryOption = { value: string; label: string }

export interface MenuItemModalHeaderProps {
  isEditing: boolean
  isLoading: boolean
}

export interface MenuItemDetailsFieldsProps {
  formData: MenuItemFormData
  categoryOptions: CategoryOption[]
  errors: Partial<Record<keyof MenuItemFormData, string>>
  isEditing: boolean
  onFieldChange: (field: keyof MenuItemFormData, value: string) => void
}

export interface MenuItemImageFieldsProps {
  uploadMethod: UploadMethod
  setUploadMethod: (method: UploadMethod) => void
  pendingImageUrl: string
  setPendingImageUrl: (url: string) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  imagePreviews: string[]
  onAddImageUrl: (url: string) => void
  onRemoveImageAt: (index: number) => void
}

export interface MenuItemModalFooterProps {
  isLoading: boolean
  isEditing: boolean
}
