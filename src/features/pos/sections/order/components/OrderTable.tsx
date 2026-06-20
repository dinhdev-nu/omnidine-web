import React, { useCallback, useReducer, useRef } from "react"
import ConfirmationDialog from "../../../ui/ConfirmationDialog"
import OrderTableDesktopRow from "./OrderTableDesktopRow"
import OrderTableMobileCard from "./OrderTableMobileCard"
import type {
  AllowedOrderItemStatusUpdate,
  AllowedOrderStatusUpdate,
  Order,
  OrderDiscountType,
} from "@/types/domain/order"

interface OrderTableProps {
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

const STATUS_LABELS: Record<AllowedOrderStatusUpdate, string> = {
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  ready: "Sẵn sàng",
  delivering: "Đang giao",
  completed: "Hoàn thành",
}

function getAllowedNextStatuses(order: Order): AllowedOrderStatusUpdate[] {
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

type OrderDiscountEditType = "fixed" | "percent"

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

function useOrderTableController({
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
      await onUpdateOrderItemStatus(order, itemId, status)
      const detailOrder = await onLoadOrderDetail(order._id)
      dispatchTable({
        type: "setDetailOrder",
        orderId: order._id,
        order: detailOrder,
      })
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

  const handleCancelItemClick = useCallback((order: Order, itemId: string) => {
    selectedItemToCancelRef.current = { order, itemId }
    dispatchTable({ type: "requestCancelItem" })
  }, [])

  const handleConfirmDiscount = useCallback(async () => {
    if (!selectedOrderToDiscount || !onUpdateOrderDiscount) return
    try {
      dispatchTable({ type: "startDiscount" })
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

type OrderTableController = ReturnType<typeof useOrderTableController>

interface OrderTableViewProps {
  controller: OrderTableController
}

function OrderDesktopTable({ controller }: OrderTableViewProps) {
  const {
    orders,
    detailOrders,
    loadingDetailOrders,
    highlightedOrderId,
    expandedRows,
    handleToggleExpand,
    handleOrderClick,
    handleUpdateStatusClick,
    handleCancelClick,
    handleUpdateOrderItemStatus,
    handleCancelItemClick,
    handleEditDiscountClick,
  } = controller
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="p-4 text-left font-medium text-muted-foreground">
              <div className="flex items-center space-x-2">
                <span>Số đơn</span>
              </div>
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              <span>Ngày tạo</span>
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Loại đơn
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Khách hàng
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Tổng tiền
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Nguồn đơn
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Trạng thái
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              TT Thanh toán
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderTableDesktopRow
              key={order._id}
              order={order}
              detailOrder={detailOrders[order._id]}
              isLoadingDetail={loadingDetailOrders[order._id]}
              highlighted={highlightedOrderId === order._id}
              expanded={expandedRows.has(order._id)}
              onToggleExpand={handleToggleExpand}
              onPaymentClick={handleOrderClick}
              onUpdateStatusClick={handleUpdateStatusClick}
              onCancelOrder={handleCancelClick}
              onUpdateOrderItemStatus={handleUpdateOrderItemStatus}
              onCancelOrderItemClick={handleCancelItemClick}
              onEditDiscountClick={handleEditDiscountClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OrderMobileCards({ controller }: OrderTableViewProps) {
  const {
    orders,
    detailOrders,
    loadingDetailOrders,
    highlightedOrderId,
    expandedRows,
    handleToggleExpand,
    handleOrderClick,
    handleUpdateStatusClick,
    handleCancelClick,
    handleUpdateOrderItemStatus,
    handleCancelItemClick,
    handleEditDiscountClick,
  } = controller
  return (
    <div className="space-y-4 p-4 lg:hidden">
      {orders.map((order) => (
        <OrderTableMobileCard
          key={order._id}
          order={order}
          detailOrder={detailOrders[order._id]}
          isLoadingDetail={loadingDetailOrders[order._id]}
          highlighted={highlightedOrderId === order._id}
          expanded={expandedRows.has(order._id)}
          onToggleExpand={handleToggleExpand}
          onPaymentClick={handleOrderClick}
          onUpdateStatusClick={handleUpdateStatusClick}
          onCancelOrder={handleCancelClick}
          onUpdateOrderItemStatus={handleUpdateOrderItemStatus}
          onCancelOrderItemClick={handleCancelItemClick}
          onEditDiscountClick={handleEditDiscountClick}
        />
      ))}
    </div>
  )
}

function OrderTableDialogs({ controller }: OrderTableViewProps) {
  const {
    showUpdateStatusDialog,
    dispatchTable,
    handleConfirmUpdateStatus,
    selectedOrderToUpdateStatus,
    nextStatus,
    isUpdatingStatus,
    showCancelDialog,
    handleConfirmCancel,
    selectedOrderToCancel,
    isCancelling,
    cancelReason,
    showDiscountDialog,
    handleConfirmDiscount,
    selectedOrderToDiscount,
    isUpdatingDiscount,
    discountType,
    discountValue,
    discountRef,
    showCancelItemDialog,
    selectedItemToCancelRef,
    handleConfirmCancelItem,
    isCancellingItem,
    cancelItemReason,
  } = controller
  return (
    <>
      <ConfirmationDialog
        isOpen={showUpdateStatusDialog}
        onClose={() => dispatchTable({ type: "closeUpdateStatus" })}
        onConfirm={handleConfirmUpdateStatus}
        title="Cập nhật trạng thái đơn"
        message={`Chọn trạng thái mới cho đơn ${selectedOrderToUpdateStatus?.order_number ?? ""}.`}
        confirmText="Cập nhật"
        cancelText="Đóng"
        variant="default"
        icon="GitBranch"
        isLoading={isUpdatingStatus}
      >
        <div className="mt-3">
          <label
            htmlFor="order-next-status"
            className="mb-1 block text-xs text-muted-foreground"
          >
            Trạng thái mới
          </label>
          <select
            id="order-next-status"
            className="h-9 w-full rounded border border-border bg-background px-2 text-sm"
            value={nextStatus}
            onChange={(e) =>
              dispatchTable({
                type: "setNextStatus",
                nextStatus: e.target.value as AllowedOrderStatusUpdate,
              })
            }
          >
            {(selectedOrderToUpdateStatus
              ? getAllowedNextStatuses(selectedOrderToUpdateStatus)
              : []
            ).map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </ConfirmationDialog>
      <ConfirmationDialog
        isOpen={showCancelDialog}
        onClose={() => dispatchTable({ type: "closeCancelOrder" })}
        onConfirm={handleConfirmCancel}
        title="Hủy đơn hàng"
        message={`Bạn có chắc muốn hủy đơn ${selectedOrderToCancel?.order_number}? Hành động này không thể hoàn tác.`}
        confirmText="Hủy đơn"
        cancelText="Đóng"
        variant="danger"
        icon="Trash"
        isLoading={isCancelling}
      >
        <div className="mt-3">
          <label
            htmlFor="order-cancel-reason"
            className="mb-1 block text-xs text-muted-foreground"
          >
            Lý do hủy (tuỳ chọn)
          </label>
          <textarea
            id="order-cancel-reason"
            className="min-h-[80px] w-full rounded border border-border p-2 text-sm"
            placeholder="Nhập lý do hủy để lưu lại (ví dụ: Khách đổi ý)"
            value={cancelReason}
            onChange={(e) =>
              dispatchTable({
                type: "setCancelReason",
                reason: e.target.value,
              })
            }
          />
        </div>
      </ConfirmationDialog>

      <ConfirmationDialog
        isOpen={showDiscountDialog}
        onClose={() => dispatchTable({ type: "closeDiscount" })}
        onConfirm={handleConfirmDiscount}
        title="Cập nhật giảm giá"
        message={`Cập nhật giảm giá cho đơn ${selectedOrderToDiscount?.order_number}.`}
        confirmText="Cập nhật"
        cancelText="Đóng"
        variant="default"
        icon="Tag"
        isLoading={isUpdatingDiscount}
      >
        <div className="mt-3 space-y-3">
          <div>
            <label
              htmlFor="order-discount-type"
              className="mb-1 block text-xs text-muted-foreground"
            >
              Loại giảm giá
            </label>
            <select
              id="order-discount-type"
              className="h-9 w-full rounded border border-border bg-background px-2 text-sm"
              value={discountType}
              onChange={(e) =>
                dispatchTable({
                  type: "setDiscountType",
                  discountType: e.target.value as OrderDiscountEditType,
                })
              }
            >
              <option value="fixed">Tiền mặt</option>
              <option value="percent">Phần trăm (%)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="order-discount-value"
              className="mb-1 block text-xs text-muted-foreground"
            >
              Giá trị
            </label>
            <input
              id="order-discount-value"
              type="number"
              className="h-9 w-full rounded border border-border bg-background px-2 text-sm"
              value={discountValue}
              onChange={(e) =>
                dispatchTable({
                  type: "setDiscountValue",
                  discountValue: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label
              htmlFor="order-discount-reference"
              className="mb-1 block text-xs text-muted-foreground"
            >
              Mã giảm giá / chương trình
            </label>
            <input
              id="order-discount-reference"
              type="text"
              className="h-9 w-full rounded border border-border bg-background px-2 text-sm"
              placeholder="Nhập mã voucher hoặc tên chương trình"
              value={discountRef}
              onChange={(e) =>
                dispatchTable({
                  type: "setDiscountRef",
                  discountRef: e.target.value,
                })
              }
            />
          </div>
        </div>
      </ConfirmationDialog>

      <ConfirmationDialog
        isOpen={showCancelItemDialog}
        onClose={() => {
          dispatchTable({ type: "closeCancelItem" })
          selectedItemToCancelRef.current = null
        }}
        onConfirm={handleConfirmCancelItem}
        title="Hủy món ăn"
        message={`Bạn có chắc muốn hủy món này trong đơn?`}
        confirmText="Hủy món"
        cancelText="Đóng"
        variant="danger"
        icon="Trash"
        isLoading={isCancellingItem}
      >
        <div className="mt-3">
          <label
            htmlFor="order-item-cancel-reason"
            className="mb-1 block text-xs text-muted-foreground"
          >
            Lý do hủy (tuỳ chọn)
          </label>
          <textarea
            id="order-item-cancel-reason"
            className="min-h-[80px] w-full rounded border border-border p-2 text-sm"
            placeholder="Nhập lý do hủy món..."
            value={cancelItemReason}
            onChange={(e) =>
              dispatchTable({
                type: "setCancelItemReason",
                reason: e.target.value,
              })
            }
          />
        </div>
      </ConfirmationDialog>
    </>
  )
}

function OrderTableView({ controller }: OrderTableViewProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <OrderDesktopTable controller={controller} />
      <OrderMobileCards controller={controller} />
      <OrderTableDialogs controller={controller} />
    </div>
  )
}

const OrderTable: React.FC<OrderTableProps> = (props) => {
  const controller = useOrderTableController(props)

  return <OrderTableView controller={controller} />
}

export default OrderTable
