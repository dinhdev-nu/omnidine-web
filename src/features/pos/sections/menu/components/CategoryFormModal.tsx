import React from "react"
import type { RefObject } from "react"
import { toast } from "sonner"

import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { uploadSingleFile } from "@/services/uploads"

import Button from "../../../ui/Button"
import Input from "../../../ui/Input"
import { Spinner } from "../../../ui/Spinner"

interface CategoryFormModalProps {
  isOpen: boolean
  isSubmitting: boolean
  isEditing: boolean
  categoryName: string
  categoryDescription: string
  categoryImageUrl: string
  categorySortOrder: string
  categoryNameError?: string | null
  categorySortOrderError?: string | null
  onClose: () => void
  onSubmit: () => void
  onCategoryNameChange: (value: string) => void
  onCategoryDescriptionChange: (value: string) => void
  onCategoryImageUrlChange: (value: string) => void
  onCategorySortOrderChange: (value: string) => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  isSubmitting,
  isEditing,
  categoryName,
  categoryDescription,
  categoryImageUrl,
  categorySortOrder,
  categoryNameError = null,
  categorySortOrderError = null,
  onClose,
  onSubmit,
  onCategoryNameChange,
  onCategoryDescriptionChange,
  onCategoryImageUrlChange,
  onCategorySortOrderChange,
  returnFocusRef,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isUploadingImage, setIsUploadingImage] = React.useState(false)
  const isBusy = isSubmitting || isUploadingImage

  const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      const uploaded = await uploadSingleFile(file)
      onCategoryImageUrlChange(uploaded.url)
      toast.success("Tải ảnh danh mục thành công")
    } catch (error) {
      const uploadError = error as Error
      toast.error(uploadError.message || "Không thể tải ảnh danh mục")
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isBusy) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50"
        className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md flex-col gap-0 overflow-hidden rounded-lg border border-border bg-card p-0 shadow-xl sm:max-w-md"
        aria-busy={isBusy}
        onEscapeKeyDown={(event) => {
          if (isBusy) event.preventDefault()
        }}
        onPointerDownOutside={(event) => {
          if (isBusy) event.preventDefault()
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
            if (!isBusy) onSubmit()
          }}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-4 sm:p-6">
            <DialogHeader className="min-w-0 flex-1 flex-row items-center gap-3 text-left">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                <Icon
                  name={isEditing ? "Edit" : "Plus"}
                  size={20}
                  color="white"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-xl leading-tight font-semibold text-pretty text-foreground">
                  {isEditing ? "Cập nhật danh mục" : "Thêm danh mục mới"}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {isEditing
                    ? "Cập nhật tên, mô tả và hình ảnh của danh mục."
                    : "Nhập thông tin cho danh mục thực đơn mới."}
                </DialogDescription>
              </div>
            </DialogHeader>

            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isBusy}
                aria-label="Đóng hộp thoại danh mục"
                className="shrink-0"
              >
                <Icon name="X" size={20} aria-hidden="true" />
              </Button>
            </DialogClose>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <Input
              id="category-name"
              name="categoryName"
              label="Tên danh mục"
              type="text"
              autoComplete="off"
              value={categoryName}
              onChange={(event) => onCategoryNameChange(event.target.value)}
              placeholder="Nhập tên danh mục"
              required
              error={
                categoryNameError ? (
                  <span id="category-name-error">{categoryNameError}</span>
                ) : undefined
              }
              aria-describedby={
                categoryNameError ? "category-name-error" : undefined
              }
            />

            <Input
              id="category-description"
              name="categoryDescription"
              label="Mô tả"
              type="text"
              autoComplete="off"
              value={categoryDescription}
              onChange={(event) =>
                onCategoryDescriptionChange(event.target.value)
              }
              placeholder="Mô tả danh mục"
            />

            <Input
              id="category-sort-order"
              name="categorySortOrder"
              label="Thứ tự hiển thị"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={categorySortOrder}
              onChange={(event) =>
                onCategorySortOrderChange(event.target.value)
              }
              placeholder="Ví dụ: 0"
              disabled={isEditing}
              description={
                isEditing
                  ? "Dùng chức năng sắp xếp danh mục để thay đổi thứ tự hiển thị."
                  : undefined
              }
              error={
                categorySortOrderError ? (
                  <span id="category-sort-order-error">
                    {categorySortOrderError}
                  </span>
                ) : undefined
              }
              aria-describedby={
                categorySortOrderError
                  ? "category-sort-order-error"
                  : undefined
              }
            />

            <fieldset className="flex min-w-0 flex-col gap-3">
              <legend className="text-sm font-medium text-foreground">
                Ảnh danh mục
              </legend>

              <div className="flex flex-col gap-3 min-[360px]:flex-row min-[360px]:items-center">
                <div className="size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                  {categoryImageUrl ? (
                    <Image
                      src={categoryImageUrl}
                      alt={
                        categoryName
                          ? `Ảnh xem trước của ${categoryName}`
                          : "Ảnh xem trước của danh mục"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Icon
                        name="Image"
                        size={20}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    id="category-image-file"
                    name="categoryImage"
                    type="file"
                    aria-label="Chọn ảnh danh mục"
                    aria-describedby="category-image-help"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handleUploadImage}
                  />
                  <span id="category-image-help" className="sr-only">
                    Chấp nhận ảnh JPEG, PNG hoặc WEBP.
                  </span>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isBusy}
                    iconName={isUploadingImage ? undefined : "Upload"}
                    iconPosition="left"
                    className="w-full min-[360px]:w-auto"
                  >
                    {isUploadingImage ? (
                      <span
                        className="inline-flex items-center gap-2"
                        role="status"
                      >
                        <Spinner className="size-4" />
                        Đang tải ảnh…
                      </span>
                    ) : (
                      "Tải ảnh từ máy"
                    )}
                  </Button>

                  {categoryImageUrl && (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => onCategoryImageUrlChange("")}
                      disabled={isBusy}
                      className="w-full justify-start text-muted-foreground min-[360px]:w-auto"
                    >
                      Xóa ảnh
                    </Button>
                  )}
                </div>
              </div>
            </fieldset>

            <Input
              id="category-image-url"
              name="categoryImageUrl"
              label="Hoặc nhập URL ảnh"
              type="url"
              inputMode="url"
              autoComplete="url"
              value={categoryImageUrl}
              onChange={(event) =>
                onCategoryImageUrlChange(event.target.value)
              }
              placeholder="https://example.com/category.jpg"
            />
          </div>

          <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none bg-card p-4 sm:p-6">
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isBusy}
                className="w-full sm:w-auto"
              >
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="default"
              disabled={isBusy}
              iconName={
                isSubmitting ? undefined : isEditing ? "Save" : "Plus"
              }
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2" role="status">
                  <Spinner className="size-4" />
                  Đang lưu…
                </span>
              ) : isEditing ? (
                "Cập nhật"
              ) : (
                "Thêm danh mục"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryFormModal
