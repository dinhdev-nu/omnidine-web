import React from "react"
import { OrderMobileExpandedDetails } from "./OrderMobileExpandedDetails"
import { OrderMobileHeader } from "./OrderMobileHeader"
import type { OrderTableMobileCardProps } from "./order-table-mobile.types"

const OrderTableMobileCard: React.FC<OrderTableMobileCardProps> = ({
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
  const items = detailOrder?.items ?? []
  const subtotal = detailOrder?.subtotal ?? 0
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
  const total = detailOrder?.total_amount ?? 0

  return (
    <>
      <OrderMobileHeader
        order={order}
        highlighted={highlighted}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
        onPaymentClick={onPaymentClick}
        onUpdateStatusClick={onUpdateStatusClick}
        onCancelOrder={onCancelOrder}
      />

      {expanded && (
        <OrderMobileExpandedDetails
          order={order}
          detailOrder={detailOrder}
          isLoadingDetail={isLoadingDetail}
          items={items}
          isActionable={isActionable}
          subtotal={subtotal}
          discountAmount={discountAmount}
          discountTypeLabel={discountTypeLabel}
          total={total}
          onUpdateOrderItemStatus={onUpdateOrderItemStatus}
          onCancelOrderItemClick={onCancelOrderItemClick}
          onEditDiscountClick={onEditDiscountClick}
        />
      )}
    </>
  )
}

export default OrderTableMobileCard
