import React from "react"
import { OrderDesktopExpandedRow } from "./OrderDesktopExpandedRow"
import { OrderDesktopSummaryRow } from "./OrderDesktopSummaryRow"
import type { OrderTableDesktopRowProps } from "./order-table-desktop.types"

const OrderTableDesktopRow: React.FC<OrderTableDesktopRowProps> = ({
  order,
  detailOrder,
  isLoadingDetail,
  highlighted,
  expanded,
  onToggleExpand,
  onPaymentClick,
  onUpdateStatusClick,
  onCancelOrder,
  onUpdateOrderItemStatus,
  onCancelOrderItemClick,
  onEditDiscountClick,
}) => {
  const isActionable =
    order.status !== "completed" &&
    order.status !== "cancelled" &&
    order.status !== "refunded"
  const discountAmount = detailOrder?.discount_amount ?? 0
  const discountTypeLabel = detailOrder
    ? detailOrder.discount_type === "none"
      ? "Không giảm giá"
      : detailOrder.discount_type === "percent"
        ? `${((detailOrder.discount_value ?? 0) * 100).toFixed(0)}%`
        : detailOrder.discount_type === "coupon"
          ? "Mã giảm giá"
          : "Tiền mặt"
    : "Không giảm giá"

  return (
    <React.Fragment>
      <OrderDesktopSummaryRow
        order={order}
        highlighted={highlighted}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
        onPaymentClick={onPaymentClick}
        onUpdateStatusClick={onUpdateStatusClick}
        onCancelOrder={onCancelOrder}
      />

      {expanded ? (
        <OrderDesktopExpandedRow
          order={order}
          detailOrder={detailOrder}
          isLoadingDetail={isLoadingDetail}
          isActionable={isActionable}
          discountAmount={discountAmount}
          discountTypeLabel={discountTypeLabel}
          onUpdateOrderItemStatus={onUpdateOrderItemStatus}
          onCancelOrderItemClick={onCancelOrderItemClick}
          onEditDiscountClick={onEditDiscountClick}
        />
      ) : null}
    </React.Fragment>
  )
}

export default OrderTableDesktopRow
