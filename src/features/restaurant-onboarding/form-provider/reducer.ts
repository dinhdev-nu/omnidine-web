import type React from "react"
import type { RestaurantDTO } from "../constants"
import { createInitialRestaurantFormData } from "./form-provider.utils"
import type {
  CreateRestaurantProviderProps,
  RestaurantFormErrors,
  SlugCheckStatus,
} from "./types"

export interface CreateRestaurantFormReducerState {
  formData: RestaurantDTO
  errors: RestaurantFormErrors
  logoPreview: string | null
  coverPreview: string | null
  galleryPreviews: string[]
  isSubmitting: boolean
  activeUploadCount: number
  slugCheckStatus: SlugCheckStatus
  lastCheckedSlug: string | null
  isLocating: boolean
  locationError: string | null
}

export type CreateRestaurantFormReducerAction =
  | { type: "setFormData"; value: React.SetStateAction<RestaurantDTO> }
  | { type: "setErrors"; value: React.SetStateAction<RestaurantFormErrors> }
  | { type: "setLogoPreview"; value: React.SetStateAction<string | null> }
  | { type: "setCoverPreview"; value: React.SetStateAction<string | null> }
  | { type: "setGalleryPreviews"; value: React.SetStateAction<string[]> }
  | { type: "setIsSubmitting"; value: React.SetStateAction<boolean> }
  | { type: "setActiveUploadCount"; value: React.SetStateAction<number> }
  | {
      type: "setSlugCheckStatus"
      value: React.SetStateAction<SlugCheckStatus>
    }
  | { type: "setLastCheckedSlug"; value: React.SetStateAction<string | null> }
  | { type: "setIsLocating"; value: React.SetStateAction<boolean> }
  | { type: "setLocationError"; value: React.SetStateAction<string | null> }

function resolveReducerStateAction<T>(
  current: T,
  value: React.SetStateAction<T>
): T {
  if (typeof value === "function") {
    return (value as (previous: T) => T)(current)
  }

  return value
}

export function createInitialFormReducerState({
  initialFormData,
  initialImagePreviews,
}: Pick<
  CreateRestaurantProviderProps,
  "initialFormData" | "initialImagePreviews"
>): CreateRestaurantFormReducerState {
  return {
    formData: createInitialRestaurantFormData(initialFormData),
    errors: {},
    logoPreview: initialImagePreviews?.logoUrl ?? null,
    coverPreview: initialImagePreviews?.coverUrl ?? null,
    galleryPreviews: initialImagePreviews?.galleryUrls ?? [],
    isSubmitting: false,
    activeUploadCount: 0,
    slugCheckStatus: "idle",
    lastCheckedSlug: null,
    isLocating: false,
    locationError: null,
  }
}

export function createRestaurantFormReducer(
  state: CreateRestaurantFormReducerState,
  action: CreateRestaurantFormReducerAction
): CreateRestaurantFormReducerState {
  switch (action.type) {
    case "setFormData":
      return {
        ...state,
        formData: resolveReducerStateAction(state.formData, action.value),
      }
    case "setErrors":
      return {
        ...state,
        errors: resolveReducerStateAction(state.errors, action.value),
      }
    case "setLogoPreview":
      return {
        ...state,
        logoPreview: resolveReducerStateAction(state.logoPreview, action.value),
      }
    case "setCoverPreview":
      return {
        ...state,
        coverPreview: resolveReducerStateAction(
          state.coverPreview,
          action.value
        ),
      }
    case "setGalleryPreviews":
      return {
        ...state,
        galleryPreviews: resolveReducerStateAction(
          state.galleryPreviews,
          action.value
        ),
      }
    case "setIsSubmitting":
      return {
        ...state,
        isSubmitting: resolveReducerStateAction(
          state.isSubmitting,
          action.value
        ),
      }
    case "setActiveUploadCount":
      return {
        ...state,
        activeUploadCount: resolveReducerStateAction(
          state.activeUploadCount,
          action.value
        ),
      }
    case "setSlugCheckStatus":
      return {
        ...state,
        slugCheckStatus: resolveReducerStateAction(
          state.slugCheckStatus,
          action.value
        ),
      }
    case "setLastCheckedSlug":
      return {
        ...state,
        lastCheckedSlug: resolveReducerStateAction(
          state.lastCheckedSlug,
          action.value
        ),
      }
    case "setIsLocating":
      return {
        ...state,
        isLocating: resolveReducerStateAction(state.isLocating, action.value),
      }
    case "setLocationError":
      return {
        ...state,
        locationError: resolveReducerStateAction(
          state.locationError,
          action.value
        ),
      }
    default:
      return state
  }
}
