import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { createRestaurant } from "@/services/restaurants"
import { toAppError } from "@/services/core/error"
import {
  REQUIRED_FIELDS,
  isFieldFilled,
  isOperatingHoursComplete,
} from "../constants"
import type { RestaurantDTO } from "../constants"
import {
  buildPayload,
  getCreateRestaurantErrorMessage,
  hasAtLeastOneOpenDay,
} from "./form-provider.utils"
import type { CreateRestaurantFormSetters } from "./useCreateRestaurantFormStore"

interface UseCreateRestaurantSubmitOptions
  extends Pick<
    CreateRestaurantFormSetters,
    "setErrors" | "setIsSubmitting" | "setSlugCheckStatus"
  > {
  formData: RestaurantDTO
  isSubmitting: boolean
  isUploadingAssets: boolean
  validateSlugAvailability: (slug?: string) => Promise<boolean>
}

export function useCreateRestaurantSubmit({
  formData,
  isSubmitting,
  isUploadingAssets,
  setErrors,
  setIsSubmitting,
  setSlugCheckStatus,
  validateSlugAvailability,
}: UseCreateRestaurantSubmitOptions) {
  const navigate = useNavigate()

  const validateBeforeSubmit = useCallback(
    (payload: RestaurantDTO): boolean => {
      const nextErrors: Partial<Record<keyof RestaurantDTO, string>> = {}

      REQUIRED_FIELDS.forEach((field) => {
        if (!isFieldFilled(payload, field)) {
          nextErrors[field] = "TrÆ°á»ng nÃ y lÃ  báº¯t buá»™c"
        }
      })

      if (!isOperatingHoursComplete(payload.operating_hours)) {
        nextErrors.operating_hours =
          "Giá» hoáº¡t Ä‘á»™ng khÃ´ng há»£p lá»‡ (Ä‘á»‹nh dáº¡ng HH:mm)"
      }

      if (!hasAtLeastOneOpenDay(payload)) {
        nextErrors.operating_hours =
          "NhÃ  hÃ ng pháº£i má»Ÿ Ã­t nháº¥t 1 ngÃ y trong tuáº§n"
      }

      setErrors(nextErrors)

      if (Object.keys(nextErrors).length > 0) {
        toast.error("Vui lÃ²ng kiá»ƒm tra láº¡i thÃ´ng tin báº¯t buá»™c")
        return false
      }

      return true
    },
    [setErrors]
  )

  return useCallback(async () => {
    if (isSubmitting) return

    if (isUploadingAssets) {
      toast.info("Äang táº£i áº£nh lÃªn, vui lÃ²ng Ä‘á»£i hoÃ n táº¥t")
      return
    }

    try {
      const payload = buildPayload(formData)

      const isValidPayload = validateBeforeSubmit(payload)
      if (!isValidPayload) return

      const isSlugAvailable = await validateSlugAvailability(payload.slug)
      if (!isSlugAvailable) return

      setIsSubmitting(true)

      const createdRestaurant = await createRestaurant(payload)

      toast.success("Táº¡o nhÃ  hÃ ng thÃ nh cÃ´ng")
      navigate("/restaurants", {
        replace: true,
        state: {
          createdRestaurantId: createdRestaurant._id,
        },
      })
    } catch (error) {
      const appError = toAppError(error, "KhÃ´ng thá»ƒ táº¡o nhÃ  hÃ ng")
      if (appError.errorCode === "CONFLICT_ERROR") {
        setSlugCheckStatus("taken")
        setErrors((prev) => ({
          ...prev,
          slug: "Slug Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng, vui lÃ²ng chá»n slug khÃ¡c",
        }))
      }

      toast.error(getCreateRestaurantErrorMessage(appError))
    } finally {
      setIsSubmitting(false)
    }
  }, [
    formData,
    isSubmitting,
    isUploadingAssets,
    navigate,
    setErrors,
    setIsSubmitting,
    setSlugCheckStatus,
    validateBeforeSubmit,
    validateSlugAvailability,
  ])
}
