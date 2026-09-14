import Button from "../../../ui/Button"
import Icon from "../../../ui/AppIcon"
import { formatCurrency } from "./order-format"
import type { OrderDesktopDetailProps } from "./order-table-desktop.types"

export function OrderDesktopDetailSidebar({
  order,
  detailOrder,
  isActionable,
  discountAmount,
  discountTypeLabel,
  onEditDiscountClick,
}: OrderDesktopDetailProps) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="border-b border-border bg-muted/50 px-3 py-1.5">
          <h5 className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Icon name="Calculator" size={12} />
            Tổng kết
          </h5>
        </div>
        <div className="space-y-1.5 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tạm tính</span>
            <span>{formatCurrency(detailOrder.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Phí dịch vụ (
              {((detailOrder.service_charge_rate ?? 0) * 100).toFixed(0)}
              %)
            </span>
            <span>
              +{formatCurrency(detailOrder.service_charge_amount ?? 0)}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-muted-foreground">
                  Giảm giá ({discountTypeLabel})
                </span>
                {isActionable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label={`Chỉnh sửa giảm giá đơn ${order.order_number}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditDiscountClick?.(order)
                    }}
                  >
                    <Icon name="Edit2" size={12} aria-hidden="true" />
                  </Button>
                )}
              </div>
              <span className="whitespace-nowrap">
                {discountAmount > 0
                  ? `-${formatCurrency(discountAmount)}`
                  : formatCurrency(0)}
              </span>
            </div>
            {detailOrder.discount_ref && (
              <div className="flex justify-between gap-2 text-muted-foreground">
                <span className="shrink-0">Mã:</span>
                <span className="min-w-0 truncate text-right">
                  {detailOrder.discount_ref}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Thuế ({((detailOrder.tax_rate ?? 0) * 100).toFixed(0)}%)
            </span>
            <span>+{formatCurrency(detailOrder.tax_amount ?? 0)}</span>
          </div>
          <div className="mt-1.5 border-t border-border pt-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Tổng</span>
              <span className="text-base font-bold text-primary">
                {formatCurrency(detailOrder.total_amount)}{" "}
                {detailOrder.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="border-b border-border bg-muted/50 px-3 py-1.5">
          <h5 className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Icon name="Info" size={12} />
            Thông tin
          </h5>
        </div>
        <div className="space-y-2 p-3 text-xs">
          {detailOrder.staff_id && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nhân viên</span>
              <span className="font-medium">{detailOrder.staff_id}</span>
            </div>
          )}
          {detailOrder.notes && (
            <div className="border-t border-border pt-1.5">
              <span className="mb-1 block text-muted-foreground">Ghi chú</span>
              <p className="rounded bg-muted/30 p-1.5 text-foreground italic">
                {detailOrder.notes}
              </p>
            </div>
          )}
          {detailOrder.cancel_reason && (
            <div className="rounded border-t border-destructive/50 bg-destructive/10 p-2 pt-1.5">
              <span className="mb-1 block font-medium text-destructive">
                Lý do hủy
              </span>
              <p className="text-destructive italic">
                {detailOrder.cancel_reason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
