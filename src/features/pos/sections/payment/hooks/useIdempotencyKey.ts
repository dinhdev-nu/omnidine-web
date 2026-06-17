import { useEffect, useState } from "react"
import type { Order } from "@/types/order-type"
import { generateIdempotencyKey } from "../utils/payment"

export function useIdempotencyKey(
  restaurantId: string,
  orderData: Order | null
): string {
  const [key, setKey] = useState("")

  useEffect(() => {
    if (!restaurantId || !orderData?._id) {
      setKey("")
      return
    }

    setKey(generateIdempotencyKey())
  }, [restaurantId, orderData?._id])

  return key
}
