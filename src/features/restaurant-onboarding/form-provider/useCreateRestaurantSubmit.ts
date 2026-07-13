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
          nextErrors[field] = "Trường này là bắt buộc"
        }
      })

      if (!isOperatingHoursComplete(payload.operating_hours)) {
        nextErrors.operating_hours =
          "Giờ hoạt động không hợp lệ (định dạng HH:mm)"
      }

      if (!hasAtLeastOneOpenDay(payload)) {
        nextErrors.operating_hours =
          "Nhà hàng phải mở ít nhất 1 ngày trong tuần"
      }

      setErrors(nextErrors)

      if (Object.keys(nextErrors).length > 0) {
        toast.error("Vui lòng kiểm tra lại thông tin bắt buộc")
        return false
      }

      return true
    },
    [setErrors]
  )

  return useCallback(async () => {
    if (isSubmitting) return

    if (isUploadingAssets) {
      toast.info("Đang tải ảnh lên, vui lòng đợi hoàn tất")
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

      toast.success("Tạo nhà hàng thành công")
      navigate("/restaurants", {
        replace: true,
        state: {
          createdRestaurantId: createdRestaurant._id,
        },
      })
    } catch (error) {
      const appError = toAppError(error, "Không thể tạo nhà hàng")
      if (appError.errorCode === "CONFLICT_ERROR") {
        setSlugCheckStatus("taken")
        setErrors((prev) => ({
          ...prev,
          slug: "Slug đã được sử dụng, vui lòng chọn slug khác",
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
