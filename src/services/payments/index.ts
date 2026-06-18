import { apiClient, unwrapResponseData } from "../core/client"
import type { ApiSuccessResponse } from "../core/types"
import type {
  CreatePaymentPayload,
  CreateCashPaymentPayload,
  CreatePaymentResponse,
  ListPaymentsResponse,
  GetPaymentResponse,
  RefundPaymentPayload,
  RefundPaymentResponse,
} from "@/types/domain/payment"
import { toAppError } from "../core/error"

function compactParams<T extends object>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null) {
        return false
      }

      if (Array.isArray(value)) {
        return value.length > 0
      }

      return true
    })
  ) as Partial<T>
}

const PAYMENT_ENDPOINT_FALLBACK_MESSAGE: Record<string, string> = {
  create: "Failed to create payment",
  list: "Failed to list payments",
  get: "Failed to get payment",
  refund: "Failed to refund payment",
}

export function toPaymentEndpointError(endpoint: keyof typeof PAYMENT_ENDPOINT_FALLBACK_MESSAGE, error: unknown) {
  return toAppError(error, PAYMENT_ENDPOINT_FALLBACK_MESSAGE[endpoint])
}

export async function createPayment(
  restaurantId: string,
  orderId: string,
  payload: CreatePaymentPayload
): Promise<CreatePaymentResponse> {
  try {
    const response = await apiClient.post<ApiSuccessResponse<CreatePaymentResponse>>(
      `/restaurants/${restaurantId}/orders/${orderId}/payments`,
      payload
    )
    return unwrapResponseData(response)
  } catch (err) {
    throw toPaymentEndpointError("create", err)
  }
}

export async function createCashPayment(
  restaurantId: string,
  orderId: string,
  payload: CreateCashPaymentPayload
): Promise<CreatePaymentResponse> {
  try {
    const response = await apiClient.post<ApiSuccessResponse<CreatePaymentResponse>>(
      `/restaurants/${restaurantId}/orders/${orderId}/payments/cash`,
      payload
    )
    return unwrapResponseData(response)
  } catch (err) {
    throw toPaymentEndpointError("create", err)
  }
}

export async function listPayments(
  restaurantId: string,
  orderId: string,
  query: Record<string, unknown> = {}
): Promise<ListPaymentsResponse> {
  try {
    const response = await apiClient.get<ApiSuccessResponse<ListPaymentsResponse>>(
      `/restaurants/${restaurantId}/orders/${orderId}/payments`,
      {
        params: compactParams(query),
      }
    )
    return unwrapResponseData(response)
  } catch (err) {
    throw toPaymentEndpointError("list", err)
  }
}

export async function getPayment(restaurantId: string, orderId: string, paymentId: string): Promise<GetPaymentResponse> {
  try {
    const response = await apiClient.get<ApiSuccessResponse<GetPaymentResponse>>(
      `/restaurants/${restaurantId}/orders/${orderId}/payments/${paymentId}`
    )
    return unwrapResponseData(response)
  } catch (err) {
    throw toPaymentEndpointError("get", err)
  }
}

export async function refundPayment(
  restaurantId: string,
  orderId: string,
  paymentId: string,
  payload: RefundPaymentPayload
): Promise<RefundPaymentResponse> {
  try {
    const response = await apiClient.post<ApiSuccessResponse<RefundPaymentResponse>>(
      `/restaurants/${restaurantId}/orders/${orderId}/payments/${paymentId}/refund`,
      payload
    )
    return unwrapResponseData(response)
  } catch (err) {
    throw toPaymentEndpointError("refund", err)
  }
}

export default {} as unknown
