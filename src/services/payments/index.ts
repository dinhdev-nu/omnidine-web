import { apiClient, unwrapResponseData } from "../core/client"
import type { ApiSuccessResponse } from "../core/types"
import type {
  CreateCashPaymentPayload,
  CreatePaymentResponse,
} from "@/types/domain/payment"
import { toAppError } from "../core/error"

const PAYMENT_ENDPOINT_FALLBACK_MESSAGE: Record<string, string> = {
  create: "Failed to create payment",
  list: "Failed to list payments",
  get: "Failed to get payment",
  refund: "Failed to refund payment",
}

export function toPaymentEndpointError(
  endpoint: keyof typeof PAYMENT_ENDPOINT_FALLBACK_MESSAGE,
  error: unknown
) {
  return toAppError(error, PAYMENT_ENDPOINT_FALLBACK_MESSAGE[endpoint])
}

export async function createCashPayment(
  restaurantId: string,
  orderId: string,
  payload: CreateCashPaymentPayload
): Promise<CreatePaymentResponse> {
  try {
    const response = await apiClient.post<
      ApiSuccessResponse<CreatePaymentResponse>
    >(`/restaurants/${restaurantId}/orders/${orderId}/payments/cash`, payload)
    return unwrapResponseData(response)
  } catch (err) {
    throw toPaymentEndpointError("create", err)
  }
}
