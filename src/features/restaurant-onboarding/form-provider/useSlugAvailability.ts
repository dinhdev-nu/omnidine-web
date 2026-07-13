import { useCallback, useEffect, useRef } from "react"
import { checkRestaurantSlug } from "@/services/restaurants"
import { toAppError } from "@/services/core/error"
import {
  getSlugCheckErrorMessage,
  SLUG_CHECK_DEBOUNCE_MS,
} from "./form-provider.utils"
import type { SlugCheckStatus } from "./types"
import type { CreateRestaurantFormSetters } from "./useCreateRestaurantFormStore"

interface UseSlugAvailabilityOptions
  extends Pick<
    CreateRestaurantFormSetters,
    "setErrors" | "setLastCheckedSlug" | "setSlugCheckStatus"
  > {
  isEditing: boolean
  slug?: string
  lastCheckedSlug: string | null
  slugCheckStatus: SlugCheckStatus
}

export function useSlugAvailability({
  isEditing,
  slug,
  lastCheckedSlug,
  slugCheckStatus,
  setErrors,
  setLastCheckedSlug,
  setSlugCheckStatus,
}: UseSlugAvailabilityOptions) {
  const slugCheckRequestIdRef = useRef(0)
  const normalizedSlug = (slug ?? "").trim()

  const handleSlugChanged = useCallback(
    (nextSlug?: string) => {
      const nextNormalizedSlug = (nextSlug ?? "").trim()

      slugCheckRequestIdRef.current += 1

      if (lastCheckedSlug !== null) {
        setLastCheckedSlug(null)
      }

      if (isEditing || !nextNormalizedSlug) {
        if (slugCheckStatus !== "idle") {
          setSlugCheckStatus("idle")
        }
        return
      }

      if (slugCheckStatus !== "checking") {
        setSlugCheckStatus("checking")
      }
    },
    [
      isEditing,
      lastCheckedSlug,
      setLastCheckedSlug,
      setSlugCheckStatus,
      slugCheckStatus,
    ]
  )

  useEffect(() => {
    if (isEditing || !normalizedSlug) {
      return
    }

    const requestId = slugCheckRequestIdRef.current + 1
    slugCheckRequestIdRef.current = requestId

    const timeoutId = window.setTimeout(async () => {
      try {
        if (slugCheckRequestIdRef.current !== requestId) return

        const result = await checkRestaurantSlug({ slug: normalizedSlug })

        if (slugCheckRequestIdRef.current === requestId) {
          setLastCheckedSlug(normalizedSlug)

          if (result.available) {
            setSlugCheckStatus("available")
            setErrors((prev) => {
              if (!prev.slug) return prev

              const next = { ...prev }
              delete next.slug
              return next
            })
            return
          }

          setSlugCheckStatus("taken")
          setErrors((prev) => ({
            ...prev,
            slug: "Slug đã được sử dụng, vui lòng chọn slug khác",
          }))
        }
      } catch (error) {
        if (slugCheckRequestIdRef.current === requestId) {
          const appError = toAppError(error, "Không thể kiểm tra slug lúc này")
          const message = getSlugCheckErrorMessage(appError)

          setSlugCheckStatus(
            appError.errorCode === "INVALID_SLUG_FORMAT" ? "taken" : "idle"
          )
          setErrors((prev) => ({
            ...prev,
            slug: message,
          }))
        }
      }
    }, SLUG_CHECK_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [
    isEditing,
    normalizedSlug,
    setErrors,
    setLastCheckedSlug,
    setSlugCheckStatus,
  ])

  const validateSlugAvailability = useCallback(
    async (slug?: string): Promise<boolean> => {
      if (isEditing) return true

      if (!slug) return true

      const normalizedSlug = slug.trim()
      if (!normalizedSlug) return true

      if (lastCheckedSlug === normalizedSlug) {
        if (slugCheckStatus === "available") return true

        if (slugCheckStatus === "taken") {
          setSlugCheckStatus("taken")
          setErrors((prev) => ({
            ...prev,
            slug: "Slug đã được sử dụng, vui lòng chọn slug khác",
          }))
          return false
        }
      }

      try {
        const result = await checkRestaurantSlug({ slug: normalizedSlug })
        if (result.available) {
          setSlugCheckStatus("available")
          setErrors((prev) => {
            if (!prev.slug) return prev

            const next = { ...prev }
            delete next.slug
            return next
          })
          return true
        }

        setSlugCheckStatus("taken")
        setErrors((prev) => ({
          ...prev,
          slug: "Slug đã được sử dụng, vui lòng chọn slug khác",
        }))
        return false
      } catch (error) {
        const appError = toAppError(error, "Không thể kiểm tra slug lúc này")
        const message = getSlugCheckErrorMessage(appError)

        setSlugCheckStatus(
          appError.errorCode === "INVALID_SLUG_FORMAT" ? "taken" : "idle"
        )
        setErrors((prev) => ({
          ...prev,
          slug: message,
        }))

        return false
      }
    },
    [isEditing, lastCheckedSlug, setErrors, setSlugCheckStatus, slugCheckStatus]
  )

  return {
    handleSlugChanged,
    validateSlugAvailability,
  }
}
