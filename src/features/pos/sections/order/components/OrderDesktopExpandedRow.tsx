import Icon from "../../../ui/AppIcon"
import { formatDateTime } from "./order-format"
import { OrderDesktopDetailMain } from "./OrderDesktopDetailMain"
import { OrderDesktopDetailSidebar } from "./OrderDesktopDetailSidebar"
import type { OrderDesktopExpandedRowProps } from "./order-table-desktop.types"

export function OrderDesktopExpandedRow({
  order,
  detailOrder,
  isLoadingDetail,
  isActionable,
  discountAmount,
  discountTypeLabel,
  onUpdateOrderItemStatus,
  onCancelOrderItemClick,
  onEditDiscountClick,
}: OrderDesktopExpandedRowProps) {
  return (
    <tr className="bg-gradient-to-b from-muted/30 to-muted/10">
      <td colSpan={9} className="p-0">
        <div className="space-y-4 px-4 py-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Icon name="FileText" size={16} className="text-primary" />
              Chi tiết đơn hàng
            </h4>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(order.created_at)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {isLoadingDetail && !detailOrder ? (
              <div className="flex items-center justify-center py-8 lg:col-span-3">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span className="text-sm">Đang tải...</span>
                </div>
              </div>
            ) : null}

            {!isLoadingDetail && detailOrder ? (
              <>
                <OrderDesktopDetailMain
                  order={order}
                  detailOrder={detailOrder}
                  isActionable={isActionable}
                  discountAmount={discountAmount}
                  discountTypeLabel={discountTypeLabel}
                  onUpdateOrderItemStatus={onUpdateOrderItemStatus}
                  onCancelOrderItemClick={onCancelOrderItemClick}
                />
                <OrderDesktopDetailSidebar
                  order={order}
                  detailOrder={detailOrder}
                  isActionable={isActionable}
                  discountAmount={discountAmount}
                  discountTypeLabel={discountTypeLabel}
                  onEditDiscountClick={onEditDiscountClick}
                />
              </>
            ) : null}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="h-2 bg-muted/20" />
      </td>
    </tr>
  )
}
