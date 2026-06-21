import type React from "react"
import { useCallback } from "react"
import { toast } from "sonner"
import { toAppError } from "@/services/core/error"
import { UPLOAD_ALLOWED_MIME_TYPES } from "@/types/domain/upload"
import type { RestaurantDTO } from "../constants"
import {
  getUploadErrorMessage,
  MAX_GALLERY_ITEMS,
  readFileAsDataUrl,
  uploadByCount,
} from "./form-provider.utils"
import type { ImageUploadType } from "./types"
import type { CreateRestaurantFormSetters } from "./useCreateRestaurantFormStore"

interface UseRestaurantImageUploadOptions
  extends Pick<
    CreateRestaurantFormSetters,
    | "setActiveUploadCount"
    | "setCoverPreview"
    | "setFormData"
    | "setGalleryPreviews"
    | "setLogoPreview"
  > {
  formData: RestaurantDTO
}

export function useRestaurantImageUpload({
  formData,
  setActiveUploadCount,
  setCoverPreview,
  setFormData,
  setGalleryPreviews,
  setLogoPreview,
}: UseRestaurantImageUploadOptions) {
  const beginUpload = useCallback(() => {
    setActiveUploadCount((prev) => prev + 1)
  }, [setActiveUploadCount])

  const endUpload = useCallback(() => {
    setActiveUploadCount((prev) => Math.max(0, prev - 1))
  }, [setActiveUploadCount])

  return useCallback(
    async (
      event: React.ChangeEvent<HTMLInputElement>,
      type: ImageUploadType
    ) => {
      const files = Array.from(event.target.files ?? [])

      if (!files.length) return

      const invalidFile = files.find(
        (file) =>
          !UPLOAD_ALLOWED_MIME_TYPES.includes(
            file.type as (typeof UPLOAD_ALLOWED_MIME_TYPES)[number]
          )
      )

      if (invalidFile) {
        toast.error("Chá»‰ há»— trá»£ áº£nh JPEG hoáº·c PNG")
        event.target.value = ""
        return
      }

      if (type === "logo_url" || type === "cover_image_url") {
        const file = files[0]

        try {
          const preview = await readFileAsDataUrl(file)

          if (type === "logo_url") {
            setLogoPreview(preview)
          } else {
            setCoverPreview(preview)
          }

          beginUpload()
          const [uploaded] = await uploadByCount([file])

          setFormData((prev) => ({
            ...prev,
            [type]: uploaded.url,
          }))
          toast.success(
            type === "logo_url"
              ? "Logo Ä‘Ã£ Ä‘Æ°á»£c táº£i lÃªn"
              : "áº¢nh bÃ¬a Ä‘Ã£ Ä‘Æ°á»£c táº£i lÃªn"
          )
        } catch (error) {
          setFormData((prev) => ({
            ...prev,
            [type]: "",
          }))
          if (type === "logo_url") {
            setLogoPreview(null)
          } else {
            setCoverPreview(null)
          }
          const appError = toAppError(error, "KhÃ´ng thá»ƒ táº£i áº£nh lÃªn mÃ¡y chá»§")
          toast.error(getUploadErrorMessage(appError))
        } finally {
          endUpload()
          event.target.value = ""
        }

        return
      }

      const availableSlots = Math.max(
        0,
        MAX_GALLERY_ITEMS - (formData.gallery_urls?.length ?? 0)
      )
      const nextFiles = files.slice(0, availableSlots)

      if (!nextFiles.length) {
        event.target.value = ""
        return
      }

      try {
        const nextPreviews = await Promise.all(
          nextFiles.map((file) => readFileAsDataUrl(file))
        )
        setGalleryPreviews((prev) => [...prev, ...nextPreviews])

        beginUpload()
        const uploadedItems = await uploadByCount(nextFiles)

        setFormData((prev) => ({
          ...prev,
          gallery_urls: [
            ...(prev.gallery_urls ?? []),
            ...uploadedItems.map((item) => item.url),
          ],
        }))
        toast.success(`ÄÃ£ táº£i lÃªn ${uploadedItems.length} áº£nh trong thÆ° viá»‡n`)
      } catch (error) {
        setGalleryPreviews((prev) =>
          prev.slice(0, Math.max(0, prev.length - nextFiles.length))
        )
        const appError = toAppError(
          error,
          "KhÃ´ng thá»ƒ táº£i má»™t sá»‘ áº£nh trong thÆ° viá»‡n lÃªn mÃ¡y chá»§"
        )
        toast.error(getUploadErrorMessage(appError))
      } finally {
        endUpload()
        event.target.value = ""
      }
    },
    [
      beginUpload,
      endUpload,
      formData.gallery_urls,
      setCoverPreview,
      setFormData,
      setGalleryPreviews,
      setLogoPreview,
    ]
  )
}
