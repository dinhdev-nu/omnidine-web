import { useCallback, useReducer, useRef } from "react"

import type {
  AllowedOrderItemStatusUpdate,
  AllowedOrderStatusUpdate,
  Order,
  OrderDiscountType,
} from "@/types/domain/order"

export interface OrderTableProps {
  orders: Order[]
  highlightedOrderId?: string
  onLoadOrderDetail: (orderId: string) => Promise<Order>
  onUpdateOrderStatus: (
    order: Order,
    status: AllowedOrderStatusUpdate
  ) => Promise<void>
  onPaymentClick: (order: Order) => void
  onCancelOrder: (order: Order, reason?: string) => Promise<void>
  onUpdateOrderItemStatus?: (
    order: Order,
    itemId: string,
    status: AllowedOrderItemStatusUpdate
  ) => Promise<void>
  onCancelOrderItem?: (
    order: Order,
    itemId: string,
    reason?: string
  ) => Promise<void>
  onUpdateOrderDiscount?: (
    order: Order,
    type: OrderDiscountType,
    value: number,
    discountRef?: string
  ) => Promise<void>
}

export const STATUS_LABELS: Record<AllowedOrderStatusUpdate, string> = {
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  ready: "Sẵn sàng",
  delivering: "Đang giao",
  completed: "Hoàn thành",
}

export function getAllowedNextStatuses(
  order: Order
): AllowedOrderStatusUpdate[] {
  switch (order.status) {
    case "pending":
      return ["confirmed"]
    case "confirmed":
      return ["preparing"]
    case "preparing":
      return ["ready"]
    case "ready":
      return order.order_type === "delivery"
        ? ["delivering", "completed"]
        : ["completed"]
    case "delivering":
      return ["completed"]
    default:
      return []
  }
}

// ── Main component ─────────────────────────────────────────────────────────────

export type OrderDiscountEditType = "fixed" | "percent"

type OrderTableState = {
  expandedRows: Set<string>
  selectedOrderToCancel: Order | null
  showCancelDialog: boolean
  cancelReason: string
  isCancelling: boolean
  selectedOrderToUpdateStatus: Order | null
  showUpdateStatusDialog: boolean
  nextStatus: AllowedOrderStatusUpdate | ""
  isUpdatingStatus: boolean
  detailOrders: Record<string, Order>
  loadingDetailOrders: Record<string, boolean>
  selectedOrderToDiscount: Order | null
  showDiscountDialog: boolean
  discountType: OrderDiscountEditType
  discountValue: number
  discountRef: string
  isUpdatingDiscount: boolean
  showCancelItemDialog: boolean
  cancelItemReason: string
  isCancellingItem: boolean
}

type OrderTableAction =
  | { type: "toggleExpanded"; orderId: string }
  | { type: "setLoadingDetail"; orderId: string; isLoading: boolean }
  | { type: "setDetailOrder"; orderId: string; order: Order }
  | { type: "requestCancelOrder"; order: Order }
  | { type: "closeCancelOrder" }
  | { type: "setCancelReason"; reason: string }
  | { type: "startCancelOrder" }
  | { type: "finishCancelOrder" }
  | {
      type: "requestUpdateStatus"
      order: Order
      nextStatus: AllowedOrderStatusUpdate
    }
  | { type: "closeUpdateStatus" }
  | { type: "setNextStatus"; nextStatus: AllowedOrderStatusUpdate }
  | { type: "startUpdateStatus" }
  | { type: "finishUpdateStatus" }
  | {
      type: "requestDiscount"
      order: Order
      discountType: OrderDiscountEditType
      discountValue: number
      discountRef: string
    }
  | { type: "closeDiscount" }
  | { type: "setDiscountType"; discountType: OrderDiscountEditType }
  | { type: "setDiscountValue"; discountValue: number }
  | { type: "setDiscountRef"; discountRef: string }
  | { type: "startDiscount" }
  | { type: "finishDiscount" }
  | { type: "requestCancelItem" }
  | { type: "closeCancelItem" }
  | { type: "setCancelItemReason"; reason: string }
  | { type: "startCancelItem" }
  | { type: "finishCancelItem" }

const orderTableInitialState: OrderTableState = {
  expandedRows: new Set(),
  selectedOrderToCancel: null,
  showCancelDialog: false,
  cancelReason: "",
  isCancelling: false,
  selectedOrderToUpdateStatus: null,
  showUpdateStatusDialog: false,
  nextStatus: "",
  isUpdatingStatus: false,
  detailOrders: {},
  loadingDetailOrders: {},
  selectedOrderToDiscount: null,
  showDiscountDialog: false,
  discountType: "fixed",
  discountValue: 0,
  discountRef: "",
  isUpdatingDiscount: false,
  showCancelItemDialog: false,
  cancelItemReason: "",
  isCancellingItem: false,
}

function orderTableReducer(
  state: OrderTableState,
  action: OrderTableAction
): OrderTableState {
  switch (action.type) {
    case "toggleExpanded": {
      const expandedRows = new Set(state.expandedRows)
      if (expandedRows.has(action.orderId)) {
        expandedRows.delete(action.orderId)
      } else {
        expandedRows.add(action.orderId)
      }
      return { ...state, expandedRows }
    }
    case "setLoadingDetail":
      return {
        ...state,
        loadingDetailOrders: {
          ...state.loadingDetailOrders,
          [action.orderId]: action.isLoading,
        },
      }
    case "setDetailOrder":
      return {
        ...state,
        detailOrders: { ...state.detailOrders, [action.orderId]: action.order },
      }
    case "requestCancelOrder":
      return {
        ...state,
        selectedOrderToCancel: action.order,
        showCancelDialog: true,
      }
    case "closeCancelOrder":
      return {
        ...state,
        showCancelDialog: false,
        selectedOrderToCancel: null,
        cancelReason: "",
      }
    case "setCancelReason":
      return { ...state, cancelReason: action.reason }
    case "startCancelOrder":
      return { ...state, isCancelling: true }
    case "finishCancelOrder":
      return {
        ...state,
        isCancelling: false,
        showCancelDialog: false,
        selectedOrderToCancel: null,
        cancelReason: "",
      }
    case "requestUpdateStatus":
      return {
        ...state,
        selectedOrderToUpdateStatus: action.order,
        nextStatus: action.nextStatus,
        showUpdateStatusDialog: true,
      }
    case "closeUpdateStatus":
      return {
        ...state,
        showUpdateStatusDialog: false,
        selectedOrderToUpdateStatus: null,
        nextStatus: "",
      }
    case "setNextStatus":
      return { ...state, nextStatus: action.nextStatus }
    case "startUpdateStatus":
      return { ...state, isUpdatingStatus: true }
    case "finishUpdateStatus":
      return {
        ...state,
        isUpdatingStatus: false,
        showUpdateStatusDialog: false,
        selectedOrderToUpdateStatus: null,
        nextStatus: "",
      }
    case "requestDiscount":
      return {
        ...state,
        selectedOrderToDiscount: action.order,
        discountType: action.discountType,
        discountValue: action.discountValue,
        discountRef: action.discountRef,
        showDiscountDialog: true,
      }
    case "closeDiscount":
      return {
        ...state,
        showDiscountDialog: false,
        selectedOrderToDiscount: null,
        discountRef: "",
      }
    case "setDiscountType":
      return { ...state, discountType: action.discountType }
    case "setDiscountValue":
      return { ...state, discountValue: action.discountValue }
    case "setDiscountRef":
      return { ...state, discountRef: action.discountRef }
    case "startDiscount":
      return { ...state, isUpdatingDiscount: true }
    case "finishDiscount":
      return {
        ...state,
        isUpdatingDiscount: false,
        showDiscountDialog: false,
        selectedOrderToDiscount: null,
      }
    case "requestCancelItem":
      return { ...state, cancelItemReason: "", showCancelItemDialog: true }
    case "closeCancelItem":
      return {
        ...state,
        showCancelItemDialog: false,
        cancelItemReason: "",
      }
    case "setCancelItemReason":
      return { ...state, cancelItemReason: action.reason }
    case "startCancelItem":
      return { ...state, isCancellingItem: true }
    case "finishCancelItem":
      return { ...state, isCancellingItem: false, showCancelItemDialog: false }
    default:
      return state
  }
}

export function useOrderTableController({
  orders,
  highlightedOrderId,
  onLoadOrderDetail,
  onUpdateOrderStatus,
  onPaymentClick,
  onCancelOrder,
  onUpdateOrderItemStatus,
  onCancelOrderItem,
  onUpdateOrderDiscount,
}: OrderTableProps) {
  const [tableState, dispatchTable] = useReducer(
    orderTableReducer,
    orderTableInitialState
  )
  const {
    expandedRows,
    selectedOrderToCancel,
    showCancelDialog,
    cancelReason,
    isCancelling,
    selectedOrderToUpdateStatus,
    showUpdateStatusDialog,
    nextStatus,
    isUpdatingStatus,
    detailOrders,
    loadingDetailOrders,
    selectedOrderToDiscount,
    showDiscountDialog,
    discountType,
    discountValue,
    discountRef,
    isUpdatingDiscount,
    showCancelItemDialog,
    cancelItemReason,
    isCancellingItem,
  } = tableState

  const selectedItemToCancelRef = useRef<{
    order: Order
    itemId: string
  } | null>(null)
  const cancelItemReturnFocusRef = useRef<HTMLElement | null>(null)

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOrderClick = useCallback(
    (order: Order) => {
      if (order.payment_status !== "unpaid") return
      onPaymentClick(order)
    },
    [onPaymentClick]
  )

  const handleCancelClick = useCallback((order: Order) => {
    dispatchTable({ type: "requestCancelOrder", order })
  }, [])

  const handleUpdateStatusClick = useCallback((order: Order) => {
    const allowedStatuses = getAllowedNextStatuses(order)
    if (allowedStatuses.length === 0) {
      return
    }

    dispatchTable({
      type: "requestUpdateStatus",
      order,
      nextStatus: allowedStatuses[0],
    })
  }, [])

  const handleConfirmCancel = useCallback(async () => {
    if (!selectedOrderToCancel) return
    try {
      dispatchTable({ type: "startCancelOrder" })
      await onCancelOrder(selectedOrderToCancel, cancelReason || undefined)
    } finally {
      dispatchTable({ type: "finishCancelOrder" })
    }
  }, [selectedOrderToCancel, cancelReason, onCancelOrder])

  const handleConfirmUpdateStatus = useCallback(async () => {
    if (!selectedOrderToUpdateStatus || !nextStatus) return
    try {
      dispatchTable({ type: "startUpdateStatus" })
      await onUpdateOrderStatus(selectedOrderToUpdateStatus, nextStatus)
    } finally {
      dispatchTable({ type: "finishUpdateStatus" })
    }
  }, [selectedOrderToUpdateStatus, nextStatus, onUpdateOrderStatus])

  const handleToggleExpand = useCallback(
    (order: Order) => {
      const isExpanding = !expandedRows.has(order._id)

      dispatchTable({ type: "toggleExpanded", orderId: order._id })

      if (
        !isExpanding ||
        detailOrders[order._id] ||
        loadingDetailOrders[order._id]
      ) {
        return
      }

      dispatchTable({
        type: "setLoadingDetail",
        orderId: order._id,
        isLoading: true,
      })
      void (async () => {
        try {
          const detailOrder = await onLoadOrderDetail(order._id)
          dispatchTable({
            type: "setDetailOrder",
            orderId: order._id,
            order: detailOrder,
          })
        } catch {
          // The service callback already surfaces a recoverable error to the user.
        } finally {
          dispatchTable({
            type: "setLoadingDetail",
            orderId: order._id,
            isLoading: false,
          })
        }
      })()
    },
    [expandedRows, detailOrders, loadingDetailOrders, onLoadOrderDetail]
  )

  const handleUpdateOrderItemStatus = useCallback(
    async (
      order: Order,
      itemId: string,
      status: AllowedOrderItemStatusUpdate
    ) => {
      if (!onUpdateOrderItemStatus) return
      try {
        await onUpdateOrderItemStatus(order, itemId, status)
        const detailOrder = await onLoadOrderDetail(order._id)
        dispatchTable({
          type: "setDetailOrder",
          orderId: order._id,
          order: detailOrder,
        })
      } catch {
        // The service callback already surfaces a recoverable error to the user.
      }
    },
    [onUpdateOrderItemStatus, onLoadOrderDetail]
  )

  const handleEditDiscountClick = useCallback(
    (order: Order) => {
      const detail = detailOrders[order._id] || order
      dispatchTable({
        type: "requestDiscount",
        order,
        discountType: detail.discount_type === "percent" ? "percent" : "fixed",
        discountValue: detail.discount_value || 0,
        discountRef: detail.discount_ref ?? "",
      })
    },
    [detailOrders]
  )

  const handleCancelItemClick = useCallback(
    (
      order: Order,
      itemId: string,
      returnFocusElement?: HTMLElement | null
    ) => {
      selectedItemToCancelRef.current = { order, itemId }
      cancelItemReturnFocusRef.current = returnFocusElement ?? null
      dispatchTable({ type: "requestCancelItem" })
    },
    []
  )

  const handleConfirmDiscount = useCallback(async () => {
    if (!selectedOrderToDiscount || !onUpdateOrderDiscount) return
    try {
      dispatchTable({ type: "startDiscount" })
      try {
        await onUpdateOrderDiscount(
          selectedOrderToDiscount,
          discountType,
          discountValue,
          discountRef
        )
        const detailOrder = await onLoadOrderDetail(selectedOrderToDiscount._id)
        dispatchTable({
          type: "setDetailOrder",
          orderId: selectedOrderToDiscount._id,
          order: detailOrder,
        })
      } catch {
        // The service callback already surfaces a recoverable error to the user.
      }
    } finally {
      dispatchTable({ type: "finishDiscount" })
    }
  }, [
    selectedOrderToDiscount,
    discountType,
    discountValue,
    discountRef,
    onUpdateOrderDiscount,
    onLoadOrderDetail,
  ])

  const handleConfirmCancelItem = useCallback(async () => {
    const selectedItemToCancel = selectedItemToCancelRef.current
    if (!selectedItemToCancel || !onCancelOrderItem) return
    try {
      dispatchTable({ type: "startCancelItem" })
      try {
        await onCancelOrderItem(
          selectedItemToCancel.order,
          selectedItemToCancel.itemId,
          cancelItemReason
        )
        const detailOrder = await onLoadOrderDetail(
          selectedItemToCancel.order._id
        )
        dispatchTable({
          type: "setDetailOrder",
          orderId: selectedItemToCancel.order._id,
          order: detailOrder,
        })
      } catch {
        // The service callback already surfaces a recoverable error to the user.
      }
    } finally {
      dispatchTable({ type: "finishCancelItem" })
      selectedItemToCancelRef.current = null
    }
  }, [cancelItemReason, onCancelOrderItem, onLoadOrderDetail])

  // ── Render ─────────────────────────────────────────────────────────────────
  return {
    orders,
    highlightedOrderId,
    expandedRows,
    detailOrders,
    loadingDetailOrders,
    dispatchTable,
    selectedOrderToCancel,
    showCancelDialog,
    cancelReason,
    isCancelling,
    selectedOrderToUpdateStatus,
    showUpdateStatusDialog,
    nextStatus,
    isUpdatingStatus,
    selectedOrderToDiscount,
    showDiscountDialog,
    discountType,
    discountValue,
    discountRef,
    isUpdatingDiscount,
    showCancelItemDialog,
    cancelItemReason,
    isCancellingItem,
    selectedItemToCancelRef,
    cancelItemReturnFocusRef,
    handleOrderClick,
    handleCancelClick,
    handleUpdateStatusClick,
    handleConfirmCancel,
    handleConfirmUpdateStatus,
    handleToggleExpand,
    handleUpdateOrderItemStatus,
    handleEditDiscountClick,
    handleCancelItemClick,
    handleConfirmDiscount,
    handleConfirmCancelItem,
  }
}

export type OrderTableController = ReturnType<typeof useOrderTableController>
