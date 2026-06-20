import ConfirmationDialog from "../../../ui/ConfirmationDialog"

import type { AllowedOrderStatusUpdate } from "@/types/domain/order"

import OrderTableDesktopRow from "./OrderTableDesktopRow"
import OrderTableMobileCard from "./OrderTableMobileCard"

import {
  getAllowedNextStatuses,
  STATUS_LABELS,
  type OrderDiscountEditType,
  type OrderTableController,
} from "../hooks/useOrderTableController"

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

export function OrderTableView({ controller }: OrderTableViewProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <OrderDesktopTable controller={controller} />
      <OrderMobileCards controller={controller} />
      <OrderTableDialogs controller={controller} />
    </div>
  )
}
