import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { useRequiredPosData } from "@/features/pos/contexts/usePosContext"
import { POS_BASE_PATH } from "@/routes/pos-route-config"
import { createCashPayment, toPaymentEndpointError } from "@/services/payments"

import type { PaymentMethodId } from "../components/PaymentMethodSelector"
import type { PaymentData } from "../components/PaymentSuccess"
import { useIdempotencyKey } from "./useIdempotencyKey"
import { useOrderData } from "./useOrderData"
import {
  generateQRCodeUrl,
  mapOrderItemsToSummaryItems,
} from "../utils/payment"

export type Step = "method" | "payment" | "success"
export type WalletMethod = Extract<
  PaymentMethodId,
  "momo" | "zalopay" | "banking" | "qr"
>

export interface PaymentSectionProps {
  orderId?: string | null
}

const WALLET_METHODS: WalletMethod[] = ["momo", "zalopay", "banking", "qr"]

const isWalletMethod = (method: PaymentMethodId | ""): method is WalletMethod =>
  WALLET_METHODS.includes(method as WalletMethod)

interface PaymentFlowState {
  orderId: string
  currentStep: Step
  selectedMethod: PaymentMethodId | ""
  amountDigits: string
  paymentResult: PaymentData
}

const createPaymentFlowState = (orderId: string): PaymentFlowState => ({
  orderId,
  currentStep: "method",
  selectedMethod: "",
  amountDigits: "",
  paymentResult: {},
})

export function usePaymentSectionController(orderId?: string | null) {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const { restaurant } = useRequiredPosData()

  const [renderedAt] = useState(() => new Date().toLocaleString("vi-VN"))

  const resolvedOrderId = orderId?.trim() ?? ""
  const restaurantId = restaurant._id
  const [storedFlow, setStoredFlow] = useState<PaymentFlowState>(() =>
    createPaymentFlowState(resolvedOrderId)
  )
  let flow = storedFlow

  if (storedFlow.orderId !== resolvedOrderId) {
    flow = createPaymentFlowState(resolvedOrderId)
    setStoredFlow(flow)
  }

  const { currentStep, selectedMethod, amountDigits, paymentResult } = flow

  const updateFlow = (nextFlow: Partial<Omit<PaymentFlowState, "orderId">>) => {
    setStoredFlow((current) => ({
      ...(current.orderId === resolvedOrderId
        ? current
        : createPaymentFlowState(resolvedOrderId)),
      ...nextFlow,
    }))
  }

  // Fetch order data
  const {
    orderData,
    isLoading: isLoadingOrderDetails,
    error: orderDetailError,
  } = useOrderData(restaurantId, resolvedOrderId)

  // Generate idempotency key
  const idempotencyKey = useIdempotencyKey(restaurantId, orderData)

  // Derived state
  const orderItems = useMemo(
    () => mapOrderItemsToSummaryItems(orderData),
    [orderData]
  )
  const subtotal = orderData?.subtotal ?? 0
  const discountAmount = orderData?.discount_amount ?? 0
  const taxAmount = orderData?.tax_amount ?? 0
  const totalAmount = orderData?.total_amount ?? 0
  const tableNumber = orderData?.table_id ?? null

  const cashPaidAmount = amountDigits ? Number(amountDigits) : 0
  const cashChange = Math.max(cashPaidAmount - totalAmount, 0)
  const cashAmountError =
    amountDigits && cashPaidAmount < totalAmount ? "Số tiền nhận không đủ." : ""
  const quickAmounts = useMemo(
    () => [totalAmount, totalAmount + 50000, totalAmount + 100000],
    [totalAmount]
  )

  const qrCodeUrl = useMemo(() => {
    if (!isWalletMethod(selectedMethod) || !orderData) return ""
    return generateQRCodeUrl(
      orderData.order_number,
      selectedMethod,
      totalAmount,
      idempotencyKey
    )
  }, [idempotencyKey, orderData, selectedMethod, totalAmount])

  // Handlers
  const handleBackToMethod = () => {
    updateFlow({
      currentStep: "method",
      selectedMethod: "",
      amountDigits: "",
    })
  }

  const handleMethodSelect = (method: PaymentMethodId) => {
    updateFlow({
      selectedMethod: method,
      currentStep: "payment",
    })
  }

  const completePayment = (
    method: PaymentMethodId,
    paidAmount: number,
    changeAmount: number
  ) => {
    if (!orderData) return
    updateFlow({
      paymentResult: {
        _id: idempotencyKey,
        createdAt: new Date().toISOString(),
        method,
        paidAmount,
        orderAmount: totalAmount,
        changeAmount,
      },
      currentStep: "success",
    })
  }

  const handleCashComplete = async () => {
    if (cashPaidAmount < totalAmount || !orderData) return
    try {
      await createCashPayment(restaurantId, resolvedOrderId, {
        method: "cash",
        amount: totalAmount,
        cash_tendered: cashPaidAmount,
        idempotency_key: idempotencyKey,
      })
      completePayment("cash", cashPaidAmount, cashChange)
    } catch (error) {
      const appError = toPaymentEndpointError("create", error)
      console.error("Cash payment error:", appError)
      toast.error(appError.message)
    }
  }

  const handleCardComplete = () => completePayment("card", totalAmount, 0)

  const handleWalletComplete = () => {
    if (!isWalletMethod(selectedMethod)) return
    completePayment(selectedMethod, totalAmount, 0)
  }

  const handleLeavePayment = () => {
    if (slug) {
      navigate(`${POS_BASE_PATH}/${slug}/orders`)
    } else {
      updateFlow({ currentStep: "method" })
    }
  }

  const handleResetFlow = () => {
    updateFlow({
      currentStep: "method",
      selectedMethod: "",
      amountDigits: "",
      paymentResult: {},
    })
    if (slug) navigate(`${POS_BASE_PATH}/${slug}/orders`)
  }

  return {
    resolvedOrderId,
    currentStep,
    selectedMethod,
    paymentResult,
    renderedAt,
    orderData,
    isLoadingOrderDetails,
    orderDetailError,
    orderItems,
    subtotal,
    discountAmount,
    taxAmount,
    totalAmount,
    tableNumber,
    cashChange,
    cashAmountError,
    quickAmounts,
    qrCodeUrl,
    updateFlow,
    handleLeavePayment,
    handleBackToMethod,
    handleMethodSelect,
    handleCashComplete,
    handleCardComplete,
    handleWalletComplete,
    handleResetFlow,
  }
}

export type PaymentSectionController = ReturnType<
  typeof usePaymentSectionController
>
