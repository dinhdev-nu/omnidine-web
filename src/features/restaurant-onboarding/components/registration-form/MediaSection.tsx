import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Camera, ImagePlus, Store } from "lucide-react"
import type { MediaSectionProps } from "./registration-form.types"

export function MediaSection({
  logoPreview,
  coverPreview,
  galleryPreviews,
  uploadImage,
}: MediaSectionProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Hình ảnh &amp; Nhận diện
        </CardTitle>
        <CardDescription>Logo, ảnh bìa và bộ ảnh thư viện</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="space-y-2">
            <Label>Logo thương hiệu</Label>
            <label htmlFor="logo-upload" className="block cursor-pointer">
              <input
                id="logo-upload"
                name="logo-upload"
                type="file"
                accept="image/*"
                onChange={(event) => uploadImage(event, "logo_url")}
                className="peer sr-only"
                aria-label="Tải logo thương hiệu"
              />
              <div
                className={cn(
                  "group flex size-32 items-center justify-center overflow-hidden rounded-xl border-2 transition-[background-color,border-color,box-shadow] motion-reduce:transition-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-focus-visible:outline-none",
                  logoPreview
                    ? "border-transparent shadow-lg"
                    : "border-dashed border-border hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground/60 transition-colors motion-reduce:transition-none group-hover:text-primary">
                    <Store className="size-8" />
                    <span className="text-xs font-semibold tracking-wider uppercase">
                      Tải lên
                    </span>
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="flex-1 space-y-2">
            <Label>Ảnh bìa (Cover)</Label>
            <label htmlFor="cover-upload" className="block h-32 cursor-pointer">
              <input
                id="cover-upload"
                name="cover-upload"
                type="file"
                accept="image/*"
                onChange={(event) => uploadImage(event, "cover_image_url")}
                className="peer sr-only"
                aria-label="Tải ảnh bìa"
              />
              <div
                className={cn(
                  "group relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border-2 transition-[background-color,border-color,box-shadow] motion-reduce:transition-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-focus-visible:outline-none",
                  coverPreview
                    ? "border-transparent shadow-lg"
                    : "border-dashed border-border hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="Cover"
                      width={1200}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity motion-reduce:transition-none group-hover:opacity-100">
                      <Camera className="size-8 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground/60 transition-colors motion-reduce:transition-none group-hover:text-primary">
                    <ImagePlus className="size-8" />
                    <span className="text-xs font-semibold tracking-wider uppercase">
                      Tải ảnh bìa
                    </span>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Thư viện ảnh (Gallery)</Label>
          <label htmlFor="gallery-upload" className="block cursor-pointer">
            <input
              id="gallery-upload"
              name="gallery-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => uploadImage(event, "gallery_urls")}
              className="peer sr-only"
              aria-label="Tải thư viện ảnh"
            />
            <div className="flex min-h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-border transition-[background-color,border-color] motion-reduce:transition-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-focus-visible:outline-none hover:border-primary/50 hover:bg-primary/5">
              <div className="flex flex-col items-center gap-2 text-muted-foreground/70">
                <ImagePlus className="size-6" />
                <span className="text-xs font-semibold tracking-wider uppercase">
                  Tải thêm ảnh (tối đa 8)
                </span>
              </div>
            </div>
          </label>

          {galleryPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 pt-2 sm:grid-cols-4">
              {galleryPreviews.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary/20"
                >
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    width={400}
                    height={400}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
