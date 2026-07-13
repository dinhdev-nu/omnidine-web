import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Hình ảnh món ăn
        </p>
        <ToggleGroup
          type="single"
          variant="outline"
          value={uploadMethod}
          onValueChange={(value) => {
            if (value === "upload" || value === "url") {
              setUploadMethod(value)
            }
          }}
          aria-label="Cách thêm hình ảnh"
          className="mb-3 w-full"
        >
          <ToggleGroupItem
            value="upload"
            aria-label="Tải ảnh từ thiết bị"
            className="min-h-11 min-w-0 flex-1"
          >
            <Icon name="Upload" size={16} aria-hidden="true" />
            Tải ảnh lên
          </ToggleGroupItem>
          <ToggleGroupItem
            value="url"
            aria-label="Thêm ảnh bằng URL"
            className="min-h-11 min-w-0 flex-1"
          >
            <Icon name="Link" size={16} aria-hidden="true" />
            URL
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {uploadMethod === "upload" ? (
        <div className="flex flex-col gap-3">
          <input
            type="file"
            id="menu-item-images"
            name="images"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileUpload}
            aria-describedby="menu-item-image-help"
            className="peer sr-only"
          />
          <span id="menu-item-image-help" className="sr-only">
            Chấp nhận ảnh PNG, JPG hoặc WEBP, tối đa 5 MB mỗi ảnh.
          </span>
          <label
            htmlFor="menu-item-images"
            className="group flex min-h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted transition-colors hover:border-primary hover:bg-primary/5 peer-focus-visible:border-ring peer-focus-visible:ring-2 peer-focus-visible:ring-ring/30 motion-reduce:transition-none"
          >
            {imagePreviews.length > 0 ? (
              <div className="relative h-full w-full">
                <Image
                  src={imagePreviews[0]}
                  alt="Ảnh xem trước của món ăn"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
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
                <p className="text-xs">
                  PNG, JPG, WEBP (tối đa 5 MB mỗi ảnh)
                </p>
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
                    alt={`Ảnh món ăn ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImageAt(index)}
                    className="absolute top-0 right-0 flex size-11 items-center justify-center rounded-bl-lg bg-black/70 text-white transition-colors hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none motion-reduce:transition-none"
                    aria-label={`Xóa ảnh ${index + 1}`}
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto pr-1">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="menu-item-image-url"
              name="imageUrl"
              label="URL hình ảnh"
              type="url"
              inputMode="url"
              autoComplete="url"
              value={pendingImageUrl}
              onChange={(e) => setPendingImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              wrapperClassName="min-w-0 flex-1"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full self-end sm:w-auto"
              disabled={!pendingImageUrl.trim()}
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
                alt="Ảnh xem trước của món ăn"
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
                    alt={`Ảnh món ăn ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImageAt(index)}
                    className="absolute top-0 right-0 flex size-11 items-center justify-center rounded-bl-lg bg-black/70 text-white transition-colors hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none motion-reduce:transition-none"
                    aria-label={`Xóa ảnh ${index + 1}`}
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
                  className="h-16 w-full overflow-hidden rounded border border-border transition-[box-shadow] hover:ring-2 hover:ring-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none"
                  aria-label={`Chọn ảnh mẫu ${index + 1}`}
                >
                  <Image
                    src={url}
                    alt=""
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
