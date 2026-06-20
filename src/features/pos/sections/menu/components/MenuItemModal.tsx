import React, { useState } from "react"
import Icon from "@/components/AppIcon"
import Button from "../../../ui/Button"
import Input from "../../../ui/Input"
import Select from "../../../ui/Select"
import Image from "@/components/AppImage"

type ItemStatus = "available" | "unavailable"
type FeaturedStatus = "normal" | "featured"

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

interface Category {
  id: string
  name: string
}

const EMPTY_IMAGE_PREVIEW_URLS: string[] = []
const EMPTY_CATEGORIES: Category[] = []
const EMPTY_MENU_ITEM_ERRORS: Partial<Record<keyof MenuItemFormData, string>> =
  {}

interface MenuItemModalProps {
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
}

type UploadMethod = "upload" | "url"

const STATUS_OPTIONS = [
  { value: "available", label: "Có sẵn" },
  { value: "unavailable", label: "Hết hàng" },
]

const FEATURED_OPTIONS = [
  { value: "normal", label: "Bình thường" },
  { value: "featured", label: "Nổi bật" },
]

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200",
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=200",
  "https://images.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_640.jpg",
]

const DEFAULT_MENU_ITEM: MenuItemFormData = {
  name: "",
  description: "",
  price: "",
  sortOrder: "",
  category: "",
  imageUrls: [],
  status: "available",
  featured: "normal",
}

type CategoryOption = { value: string; label: string }

interface MenuItemModalHeaderProps {
  isEditing: boolean
  onClose: () => void
}

function MenuItemModalHeader({ isEditing, onClose }: MenuItemModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Icon name={isEditing ? "Edit" : "Plus"} size={20} color="white" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          {isEditing ? "Chỉnh sửa món ăn" : "Thêm món mới"}
        </h2>
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

interface MenuItemDetailsFieldsProps {
  formData: MenuItemFormData
  categoryOptions: CategoryOption[]
  errors: Partial<Record<keyof MenuItemFormData, string>>
  isEditing: boolean
  onFieldChange: (field: keyof MenuItemFormData, value: string) => void
}

function MenuItemDetailsFields({
  formData,
  categoryOptions,
  errors,
  isEditing,
  onFieldChange,
}: MenuItemDetailsFieldsProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Tên món ăn"
        type="text"
        value={formData.name}
        onChange={(e) => onFieldChange("name", e.target.value)}
        error={errors.name}
        required
        placeholder="Nhập tên món ăn"
      />

      <Input
        label="Mô tả"
        type="text"
        value={formData.description}
        onChange={(e) => onFieldChange("description", e.target.value)}
        placeholder="Mô tả ngắn về món ăn"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Giá (VNĐ)"
          type="text"
          value={formData.price}
          onChange={(e) => onFieldChange("price", e.target.value)}
          error={errors.price}
          required
          placeholder="0"
        />

        <Select
          label="Danh mục"
          options={categoryOptions}
          value={formData.category}
          onChange={(event) => onFieldChange("category", event.target.value)}
          error={errors.category}
          required
          placeholder="Chọn danh mục"
        />
      </div>

      {!isEditing && (
        <Input
          label="Thứ tự hiển thị"
          type="number"
          min={0}
          step={1}
          value={formData.sortOrder}
          onChange={(e) => onFieldChange("sortOrder", e.target.value)}
          placeholder="Để trống để hệ thống tự sắp xếp"
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Trạng thái"
          options={STATUS_OPTIONS}
          value={formData.status}
          onChange={(event) => onFieldChange("status", event.target.value)}
          placeholder="Chọn trạng thái"
        />

        <Select
          label="Hiển thị"
          options={FEATURED_OPTIONS}
          value={formData.featured}
          onChange={(event) => onFieldChange("featured", event.target.value)}
          placeholder="Chọn hiển thị"
        />
      </div>
    </div>
  )
}

interface MenuItemImageFieldsProps {
  uploadMethod: UploadMethod
  setUploadMethod: (method: UploadMethod) => void
  pendingImageUrl: string
  setPendingImageUrl: (url: string) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  imagePreviews: string[]
  onAddImageUrl: (url: string) => void
  onRemoveImageAt: (index: number) => void
}

function MenuItemImageFields({
  uploadMethod,
  setUploadMethod,
  pendingImageUrl,
  setPendingImageUrl,
  handleFileUpload,
  imagePreviews,
  onAddImageUrl,
  onRemoveImageAt,
}: MenuItemImageFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 block text-sm font-medium text-foreground">
          Hình ảnh món ăn
        </p>
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUploadMethod("upload")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              uploadMethod === "upload"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Icon name="Upload" size={16} className="mr-2 inline" />
            Tải ảnh lên
          </button>
          <button
            type="button"
            onClick={() => setUploadMethod("url")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              uploadMethod === "url"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Icon name="Link" size={16} className="mr-2 inline" />
            URL
          </button>
        </div>
      </div>

      {uploadMethod === "upload" ? (
        <div className="space-y-3">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="group block flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted transition-colors hover:border-primary hover:bg-primary/5"
          >
            {imagePreviews.length > 0 ? (
              <div className="relative h-full w-full">
                <Image
                  src={imagePreviews[0]}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="text-center text-white">
                    <Icon name="Upload" size={32} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">Thêm ảnh</p>
                  </div>
                </div>
                <div className="absolute right-2 bottom-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                  {imagePreviews.length} ảnh
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Icon
                  name="ImagePlus"
                  size={48}
                  className="mx-auto mb-3 text-primary/50 transition-colors group-hover:text-primary"
                />
                <p className="mb-1 text-sm font-medium">
                  Nhấn để chọn nhiều ảnh
                </p>
                <p className="text-xs">PNG, JPG, WEBP (Max 5MB)</p>
              </div>
            )}
          </label>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {imagePreviews.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative h-16 overflow-hidden rounded border border-border"
                >
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImageAt(index)}
                    className="absolute top-1 right-1 rounded bg-black/70 p-1 text-white"
                    aria-label="Xóa ảnh"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
          <div className="flex gap-2">
            <Input
              label="URL hình ảnh"
              type="url"
              value={pendingImageUrl}
              onChange={(e) => setPendingImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <Button
              type="button"
              variant="outline"
              className="self-end"
              onClick={() => {
                const url = pendingImageUrl.trim()
                if (!url) return
                onAddImageUrl(url)
                setPendingImageUrl("")
              }}
            >
              Thêm
            </Button>
          </div>

          <div className="flex h-40 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
            {imagePreviews.length > 0 ? (
              <Image
                src={imagePreviews[0]}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <Icon name="ImagePlus" size={24} className="mx-auto mb-2" />
                <p className="text-xs">Nhập URL để thêm ảnh</p>
              </div>
            )}
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {imagePreviews.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative h-16 overflow-hidden rounded border border-border"
                >
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImageAt(index)}
                    className="absolute top-1 right-1 rounded bg-black/70 p-1 text-white"
                    aria-label="Xóa ảnh"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex-shrink-0">
            <p className="mb-2 block text-xs font-medium text-muted-foreground">
              Hoặc chọn ảnh mẫu
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_IMAGES.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => onAddImageUrl(url)}
                  className="transition-smooth h-16 w-full overflow-hidden rounded border border-border hover:ring-2 hover:ring-primary"
                >
                  <Image
                    src={url}
                    alt={`Sample ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface MenuItemModalFooterProps {
  isLoading: boolean
  isEditing: boolean
  formData: MenuItemFormData
  onClose: () => void
  onSave: (data: MenuItemFormData) => void
}

function MenuItemModalFooter({
  isLoading,
  isEditing,
  formData,
  onClose,
  onSave,
}: MenuItemModalFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border p-6">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Hủy
      </Button>
      <Button
        variant="default"
        onClick={() => onSave(formData)}
        disabled={isLoading}
        iconName="Save"
        iconPosition="left"
      >
        {isEditing ? "Cập nhật" : "Thêm mới"}
      </Button>
    </div>
  )
}

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
