import Icon from "@/components/AppIcon"
import {
  MobileOrderInfo,
  MobileOrderItems,
  MobileOrderNotes,
  MobilePaymentSummary,
} from "./OrderMobileDetailSections"
import type { OrderMobileExpandedDetailsProps } from "./order-table-mobile.types"

export function OrderMobileExpandedDetails({
  order,
  detailOrder,
  isLoadingDetail,
  items,
  isActionable,
  subtotal,
  discountAmount,
  discountTypeLabel,
  total,
  onUpdateOrderItemStatus,
  onCancelOrderItemClick,
  onEditDiscountClick,
}: OrderMobileExpandedDetailsProps) {
  return (
    <div className="space-y-4 rounded-b-lg border border-t-0 border-border bg-muted/20 p-4">
      {isLoadingDetail ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span className="text-sm">Đang tải...</span>
          </div>
        </div>
      ) : detailOrder ? (
        <>
          <MobileOrderInfo
            order={order}
            detailOrder={detailOrder}
            items={items}
            isActionable={isActionable}
            subtotal={subtotal}
            discountAmount={discountAmount}
            discountTypeLabel={discountTypeLabel}
            total={total}
          />
          <MobileOrderItems
            order={order}
            detailOrder={detailOrder}
            items={items}
            isActionable={isActionable}
            subtotal={subtotal}
            discountAmount={discountAmount}
            discountTypeLabel={discountTypeLabel}
            total={total}
            onUpdateOrderItemStatus={onUpdateOrderItemStatus}
            onCancelOrderItemClick={onCancelOrderItemClick}
          />
          <MobilePaymentSummary
            order={order}
            detailOrder={detailOrder}
            items={items}
            isActionable={isActionable}
            subtotal={subtotal}
            discountAmount={discountAmount}
            discountTypeLabel={discountTypeLabel}
            total={total}
            onEditDiscountClick={onEditDiscountClick}
          />
          <MobileOrderNotes
            order={order}
            detailOrder={detailOrder}
            items={items}
            isActionable={isActionable}
            subtotal={subtotal}
            discountAmount={discountAmount}
            discountTypeLabel={discountTypeLabel}
            total={total}
          />
        </>
      ) : null}
    </div>
  )
}
