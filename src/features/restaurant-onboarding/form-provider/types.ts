import type React from "react"
import type { DayKey, RestaurantDTO } from "../constants"

export type NumberFieldName = "latitude" | "longitude"

export type OperatingTimeKey = "open" | "close"

export type ImageUploadType = "logo_url" | "cover_image_url" | "gallery_urls"

export type SlugCheckStatus = "idle" | "checking" | "available" | "taken"

export type RestaurantFormErrors = Partial<Record<keyof RestaurantDTO, string>>

export interface CreateRestaurantState {
  formData: RestaurantDTO
  errors: RestaurantFormErrors
  progress: number
}

export interface CreateRestaurantActions {
  setField: (
    name: keyof RestaurantDTO,
    value: RestaurantDTO[keyof RestaurantDTO]
  ) => void
  changeTextField: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  changeNumberField: (name: NumberFieldName, value: string) => void
  changeOperatingClosed: (dayId: DayKey, closed: boolean) => void
  changeOperatingTime: (
    dayId: DayKey,
    key: OperatingTimeKey,
    value: string
  ) => void
  requestCurrentLocation: () => void
  uploadImage: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: ImageUploadType
  ) => void
  submit: () => Promise<void>
  submitForm: (event: React.FormEvent<HTMLFormElement>) => void
  setImagePreviews?: (
    logoUrl?: string | null,
    coverUrl?: string | null,
    galleryUrls?: string[]
  ) => void
}

export interface CreateRestaurantMeta {
  logoPreview: string | null
  coverPreview: string | null
  galleryPreviews: string[]
  isSubmitting: boolean
  isUploadingAssets: boolean
  slugCheckStatus: SlugCheckStatus
  isLocating: boolean
  locationError: string | null
}

export interface CreateRestaurantContextValue {
  state: CreateRestaurantState
  actions: CreateRestaurantActions
  meta: CreateRestaurantMeta
}

export interface CreateRestaurantProviderProps {
  children: React.ReactNode
  isEditing?: boolean
  restaurantId?: string
  initialFormData?: Partial<RestaurantDTO>
  initialImagePreviews?: {
    logoUrl?: string | null
    coverUrl?: string | null
    galleryUrls?: string[]
  }
}

export type CreateRestaurantProviderValueOptions = Pick<
  CreateRestaurantProviderProps,
  "isEditing" | "initialFormData" | "initialImagePreviews"
>
