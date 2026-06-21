import type React from "react"
import { useCallback } from "react"
import type { DayKey, RestaurantDTO } from "../constants"
import type {
  NumberFieldName,
  OperatingTimeKey,
} from "./types"
import type { CreateRestaurantFormSetters } from "./useCreateRestaurantFormStore"

type UseRestaurantFormActionsOptions = Pick<
  CreateRestaurantFormSetters,
  | "setCoverPreview"
  | "setErrors"
  | "setFormData"
  | "setGalleryPreviews"
  | "setLogoPreview"
> & {
  onSlugChanged?: (slug?: string) => void
}

export function useRestaurantFormActions({
  onSlugChanged,
  setCoverPreview,
  setErrors,
  setFormData,
  setGalleryPreviews,
  setLogoPreview,
}: UseRestaurantFormActionsOptions) {
  const setField = useCallback(
    (name: keyof RestaurantDTO, value: RestaurantDTO[keyof RestaurantDTO]) => {
      setFormData((prev) => ({ ...prev, [name]: value }))
      setErrors((prev) => {
        if (!prev[name]) return prev

        const next = { ...prev }
        delete next[name]
        return next
      })

      if (name === "slug") {
        onSlugChanged?.(typeof value === "string" ? value : undefined)
      }
    },
    [onSlugChanged, setErrors, setFormData]
  )

  const changeTextField = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setField(event.target.name as keyof RestaurantDTO, event.target.value)
    },
    [setField]
  )

  const changeNumberField = useCallback(
    (name: NumberFieldName, value: string) => {
      const normalized = value.trim()
      const parsed = normalized === "" ? undefined : Number(normalized)

      setFormData((prev) => {
        if (parsed !== undefined && Number.isNaN(parsed)) {
          return prev
        }

        return {
          ...prev,
          [name]: parsed,
        }
      })
    },
    [setFormData]
  )

  const changeOperatingClosed = useCallback(
    (dayId: DayKey, closed: boolean) => {
      setFormData((prev) => ({
        ...prev,
        operating_hours: {
          ...prev.operating_hours,
          [dayId]: {
            ...prev.operating_hours[dayId],
            closed,
          },
        },
      }))
    },
    [setFormData]
  )

  const changeOperatingTime = useCallback(
    (dayId: DayKey, key: OperatingTimeKey, value: string) => {
      setFormData((prev) => ({
        ...prev,
        operating_hours: {
          ...prev.operating_hours,
          [dayId]: {
            ...prev.operating_hours[dayId],
            [key]: value,
          },
        },
      }))
    },
    [setFormData]
  )

  const setImagePreviews = useCallback(
    (
      logoUrl?: string | null,
      coverUrl?: string | null,
      galleryUrls?: string[]
    ) => {
      if (logoUrl) setLogoPreview(logoUrl)
      if (coverUrl) setCoverPreview(coverUrl)
      if (galleryUrls && galleryUrls.length > 0) setGalleryPreviews(galleryUrls)
    },
    [setCoverPreview, setGalleryPreviews, setLogoPreview]
  )

  return {
    setField,
    changeTextField,
    changeNumberField,
    changeOperatingClosed,
    changeOperatingTime,
    setImagePreviews,
  }
}
