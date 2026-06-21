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
        const message = "Thiáº¿t bá»‹ khÃ´ng há»— trá»£ láº¥y vá»‹ trÃ­ tá»± Ä‘á»™ng"
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
          let message = "KhÃ´ng thá»ƒ láº¥y vá»‹ trÃ­ hiá»‡n táº¡i"
          if (error.code === error.PERMISSION_DENIED) {
            message =
              'Báº¡n Ä‘Ã£ tá»« chá»‘i quyá»n vá»‹ trÃ­. HÃ£y báº¥m "Láº¥y láº¡i vá»‹ trÃ­" Ä‘á»ƒ thá»­ láº¡i'
          }
          if (error.code === error.POSITION_UNAVAILABLE) {
            message = "KhÃ´ng xÃ¡c Ä‘á»‹nh Ä‘Æ°á»£c vá»‹ trÃ­ hiá»‡n táº¡i"
          }
          if (error.code === error.TIMEOUT) {
            message = "YÃªu cáº§u láº¥y vá»‹ trÃ­ bá»‹ quÃ¡ thá»i gian"
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
