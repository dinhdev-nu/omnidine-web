import type React from "react"
import { useCallback, useReducer } from "react"
import type { RestaurantDTO } from "../constants"
import {
  createInitialFormReducerState,
  createRestaurantFormReducer,
} from "./reducer"
import type {
  CreateRestaurantProviderValueOptions,
  RestaurantFormErrors,
  SlugCheckStatus,
} from "./types"

export interface CreateRestaurantFormSetters {
  setFormData: (value: React.SetStateAction<RestaurantDTO>) => void
  setErrors: (value: React.SetStateAction<RestaurantFormErrors>) => void
  setLogoPreview: (value: React.SetStateAction<string | null>) => void
  setCoverPreview: (value: React.SetStateAction<string | null>) => void
  setGalleryPreviews: (value: React.SetStateAction<string[]>) => void
  setIsSubmitting: (value: React.SetStateAction<boolean>) => void
  setActiveUploadCount: (value: React.SetStateAction<number>) => void
  setSlugCheckStatus: (value: React.SetStateAction<SlugCheckStatus>) => void
  setLastCheckedSlug: (value: React.SetStateAction<string | null>) => void
  setIsLocating: (value: React.SetStateAction<boolean>) => void
  setLocationError: (value: React.SetStateAction<string | null>) => void
}

export function useCreateRestaurantFormStore({
  initialFormData,
  initialImagePreviews,
}: CreateRestaurantProviderValueOptions) {
  const [formReducerState, dispatchFormReducer] = useReducer(
    createRestaurantFormReducer,
    { initialFormData, initialImagePreviews },
    createInitialFormReducerState
  )

  const setFormData = useCallback(
    (value: React.SetStateAction<RestaurantDTO>) => {
      dispatchFormReducer({ type: "setFormData", value })
    },
    []
  )
  const setErrors = useCallback(
    (value: React.SetStateAction<RestaurantFormErrors>) => {
      dispatchFormReducer({ type: "setErrors", value })
    },
    []
  )
  const setLogoPreview = useCallback(
    (value: React.SetStateAction<string | null>) => {
      dispatchFormReducer({ type: "setLogoPreview", value })
    },
    []
  )
  const setCoverPreview = useCallback(
    (value: React.SetStateAction<string | null>) => {
      dispatchFormReducer({ type: "setCoverPreview", value })
    },
    []
  )
  const setGalleryPreviews = useCallback(
    (value: React.SetStateAction<string[]>) => {
      dispatchFormReducer({ type: "setGalleryPreviews", value })
    },
    []
  )
  const setIsSubmitting = useCallback(
    (value: React.SetStateAction<boolean>) => {
      dispatchFormReducer({ type: "setIsSubmitting", value })
    },
    []
  )
  const setActiveUploadCount = useCallback(
    (value: React.SetStateAction<number>) => {
      dispatchFormReducer({ type: "setActiveUploadCount", value })
    },
    []
  )
  const setSlugCheckStatus = useCallback(
    (value: React.SetStateAction<SlugCheckStatus>) => {
      dispatchFormReducer({ type: "setSlugCheckStatus", value })
    },
    []
  )
  const setLastCheckedSlug = useCallback(
    (value: React.SetStateAction<string | null>) => {
      dispatchFormReducer({ type: "setLastCheckedSlug", value })
    },
    []
  )
  const setIsLocating = useCallback((value: React.SetStateAction<boolean>) => {
    dispatchFormReducer({ type: "setIsLocating", value })
  }, [])
  const setLocationError = useCallback(
    (value: React.SetStateAction<string | null>) => {
      dispatchFormReducer({ type: "setLocationError", value })
    },
    []
  )

  const setters: CreateRestaurantFormSetters = {
    setFormData,
    setErrors,
    setLogoPreview,
    setCoverPreview,
    setGalleryPreviews,
    setIsSubmitting,
    setActiveUploadCount,
    setSlugCheckStatus,
    setLastCheckedSlug,
    setIsLocating,
    setLocationError,
  }

  return {
    formReducerState,
    setters,
  }
}
