import type React from "react"
import type { DayKey, RestaurantDTO } from "../../constants"
import type { SlugCheckStatus } from "../../FormProvider"

export type SetField = (
  name: keyof RestaurantDTO,
  value: RestaurantDTO[keyof RestaurantDTO]
) => void
export type ChangeTextField = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => void
export type ChangeNumberField = (
  name: "latitude" | "longitude",
  value: string
) => void
export type UploadImage = (
  event: React.ChangeEvent<HTMLInputElement>,
  type: "logo_url" | "cover_image_url" | "gallery_urls"
) => void
export type ChangeOperatingClosed = (dayId: DayKey, closed: boolean) => void
export type ChangeOperatingTime = (
  dayId: DayKey,
  key: "open" | "close",
  value: string
) => void

export interface BaseFormSectionProps {
  formData: RestaurantDTO
  errors: Partial<Record<keyof RestaurantDTO, string>>
}

export interface BrandIdentitySectionProps extends BaseFormSectionProps {
  setField: SetField
  changeTextField: ChangeTextField
  slugCheckStatus: SlugCheckStatus
}

export interface MediaSectionProps {
  logoPreview: string | null
  coverPreview: string | null
  galleryPreviews: string[]
  uploadImage: UploadImage
}

export interface LocationContactSectionProps extends BaseFormSectionProps {
  setField: SetField
  changeTextField: ChangeTextField
  changeNumberField: ChangeNumberField
  requestCurrentLocation: () => void
  isLocating: boolean
  locationError: string | null
}

export interface OperatingHoursSectionProps {
  formData: RestaurantDTO
  changeOperatingClosed: ChangeOperatingClosed
  changeOperatingTime: ChangeOperatingTime
}
