import { useCallback } from "react"
import { toast } from "sonner"
import type { CreateRestaurantFormSetters } from "./useCreateRestaurantFormStore"

type UseCurrentLocationOptions = Pick<
  CreateRestaurantFormSetters,
  "setFormData" | "setIsLocating" | "setLocationError"
>

export function useCurrentLocation({
  setFormData,
  setIsLocating,
  setLocationError,
}: UseCurrentLocationOptions) {
  return useCallback(
    (showErrorToast = true) => {
      if (!navigator.geolocation) {
        const message = "Thiết bị không hỗ trợ lấy vị trí tự động"
        setLocationError(message)
        if (showErrorToast) {
          toast.error(message)
        }
        return
      }

      setIsLocating(true)
      setLocationError(null)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          setFormData((prev) => ({
            ...prev,
            latitude: Number(latitude.toFixed(6)),
            longitude: Number(longitude.toFixed(6)),
          }))
          setLocationError(null)
          setIsLocating(false)
        },
        (error) => {
          let message = "Không thể lấy vị trí hiện tại"
          if (error.code === error.PERMISSION_DENIED) {
            message =
              'Bạn đã từ chối quyền vị trí. Hãy bấm "Lấy lại vị trí" để thử lại'
          }
          if (error.code === error.POSITION_UNAVAILABLE) {
            message = "Không xác định được vị trí hiện tại"
          }
          if (error.code === error.TIMEOUT) {
            message = "Yêu cầu lấy vị trí bị quá thời gian"
          }

          setLocationError(message)
          setIsLocating(false)
          if (showErrorToast) {
            toast.error(message)
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 1000 * 60 * 5,
        }
      )
    },
    [setFormData, setIsLocating, setLocationError]
  )
}
