import type React from "react"
import { useCallback, useMemo } from "react"
import {
  REQUIRED_FIELDS,
  isFieldFilled,
} from "../constants"
import type {
  CreateRestaurantActions,
  CreateRestaurantContextValue,
  CreateRestaurantMeta,
  CreateRestaurantProviderValueOptions,
  CreateRestaurantState,
} from "./types"
import { useCreateRestaurantFormStore } from "./useCreateRestaurantFormStore"
import { useCreateRestaurantSubmit } from "./useCreateRestaurantSubmit"
import { useCurrentLocation } from "./useCurrentLocation"
import { useRestaurantFormActions } from "./useRestaurantFormActions"
import { useRestaurantImageUpload } from "./useRestaurantImageUpload"
import { useSlugAvailability } from "./useSlugAvailability"

export function useCreateRestaurantProviderValue({
  isEditing = false,
  initialFormData,
  initialImagePreviews,
}: CreateRestaurantProviderValueOptions) {
  const { formReducerState, setters } = useCreateRestaurantFormStore({
    isEditing,
    initialFormData,
    initialImagePreviews,
  })
  const {
    formData,
    errors,
    logoPreview,
    coverPreview,
    galleryPreviews,
    isSubmitting,
    activeUploadCount,
    slugCheckStatus,
    lastCheckedSlug,
    isLocating,
    locationError,
  } = formReducerState
  const {
    setActiveUploadCount,
    setCoverPreview,
    setErrors,
    setFormData,
    setGalleryPreviews,
    setIsLocating,
    setIsSubmitting,
    setLastCheckedSlug,
    setLocationError,
    setLogoPreview,
    setSlugCheckStatus,
  } = setters

  const isUploadingAssets = activeUploadCount > 0

  const { handleSlugChanged, validateSlugAvailability } = useSlugAvailability({
    isEditing,
    slug: formData.slug,
    lastCheckedSlug,
    slugCheckStatus,
    setErrors,
    setLastCheckedSlug,
    setSlugCheckStatus,
  })

  const requestCurrentLocation = useCurrentLocation({
    setFormData,
    setIsLocating,
    setLocationError,
  })

  const {
    setField,
    changeTextField,
    changeNumberField,
    changeOperatingClosed,
    changeOperatingTime,
    setImagePreviews,
  } = useRestaurantFormActions({
    setCoverPreview,
    setErrors,
    setFormData,
    setGalleryPreviews,
    setLogoPreview,
    onSlugChanged: handleSlugChanged,
  })

  const uploadImage = useRestaurantImageUpload({
    formData,
    setActiveUploadCount,
    setCoverPreview,
    setFormData,
    setGalleryPreviews,
    setLogoPreview,
  })

  const submit = useCreateRestaurantSubmit({
    formData,
    isSubmitting,
    isUploadingAssets,
    setErrors,
    setIsSubmitting,
    setSlugCheckStatus,
    validateSlugAvailability,
  })

  const progress = useMemo(() => {
    const filled = REQUIRED_FIELDS.filter((field) =>
      isFieldFilled(formData, field)
    ).length

    return Math.round((filled / REQUIRED_FIELDS.length) * 100)
  }, [formData])

  const submitForm = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      void submit()
    },
    [submit]
  )

  const state = useMemo<CreateRestaurantState>(
    () => ({
      formData,
      errors,
      progress,
    }),
    [formData, errors, progress]
  )

  const actions = useMemo<CreateRestaurantActions>(
    () => ({
      setField,
      changeTextField,
      changeNumberField,
      changeOperatingClosed,
      changeOperatingTime,
      requestCurrentLocation: () => requestCurrentLocation(true),
      uploadImage,
      submit,
      submitForm,
      setImagePreviews,
    }),
    [
      setField,
      changeTextField,
      changeNumberField,
      setImagePreviews,
      changeOperatingClosed,
      changeOperatingTime,
      requestCurrentLocation,
      uploadImage,
      submit,
      submitForm,
    ]
  )

  const meta = useMemo<CreateRestaurantMeta>(
    () => ({
      logoPreview,
      coverPreview,
      galleryPreviews,
      isSubmitting,
      isUploadingAssets,
      slugCheckStatus,
      isLocating,
      locationError,
    }),
    [
      logoPreview,
      coverPreview,
      galleryPreviews,
      isSubmitting,
      isUploadingAssets,
      slugCheckStatus,
      isLocating,
      locationError,
    ]
  )

  const value = useMemo<CreateRestaurantContextValue>(
    () => ({
      state,
      actions,
      meta,
    }),
    [state, actions, meta]
  )

  return value
}
