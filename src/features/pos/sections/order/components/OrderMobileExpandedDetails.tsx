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
    <div className="space-y-4 rounded-b-lg border border-t-0 border-border bg-muted/20 p-3 sm:p-4">
      {isLoadingDetail ? (
        <div className="flex items-center justify-center py-8">
          <output aria-live="polite" className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Loader2" size={16} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
            <span className="text-sm">Đang tải…</span>
          </output>
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
