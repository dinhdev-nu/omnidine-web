import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import Button from "../../../ui/Button"
import Input from "../../../ui/Input"
import { SAMPLE_IMAGES } from "./menu-item-modal.constants"
import type { MenuItemImageFieldsProps } from "./menu-item-modal.types"

export function MenuItemImageFields({
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
