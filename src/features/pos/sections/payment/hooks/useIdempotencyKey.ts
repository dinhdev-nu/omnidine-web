import { useMemo } from "react"
import type { Order } from "@/types/domain/order"
import { generateIdempotencyKey } from "../utils/payment"

export function useIdempotencyKey(
  restaurantId: string,
  orderData: Order | null
): string {
  return useMemo(() => {
    if (!restaurantId || !orderData?._id) {
      return ""
    }

    return generateIdempotencyKey()
  }, [restaurantId, orderData?._id])
}
