import { useRef } from "react"

import Icon from "@/components/AppIcon"
import Button from "../../../ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/DropdownMenu"
import { TableOrderItemStatusBadge } from "./order-display"
import { formatCurrency, formatDateTime } from "./order-format"
import {
  getCustomerDisplayName,
  getOrderSourceLabel,
  getOrderTypeLabel,
} from "../order-table-utils"
import type { MobileDetailSectionProps } from "./order-table-mobile.types"

export function MobileOrderInfo({ detailOrder }: MobileDetailSectionProps) {
  return (
    <>
      <div className="space-y-2 text-xs">
        <div className="mb-2 font-medium text-foreground">
          Thông tin đơn hàng
        </div>
        <div className="flex min-w-0 justify-between gap-3">
          <span className="text-muted-foreground">Số đơn</span>
          <span className="min-w-0 break-words text-right font-semibold">{detailOrder.order_number}</span>
        </div>
        <div className="flex min-w-0 justify-between gap-3">
          <span className="text-muted-foreground">Loại</span>
          <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {getOrderTypeLabel(detailOrder.order_type)}
          </span>
        </div>
        <div className="flex min-w-0 justify-between gap-3">
          <span className="text-muted-foreground">Nguồn</span>
          <span className="inline-block rounded bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
            {getOrderSourceLabel(detailOrder.source)}
          </span>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-2 border-t border-border pt-3 text-xs">
        <div className="mb-2 font-medium text-foreground">Khách hàng</div>
        <div className="flex min-w-0 justify-between gap-3">
          <span className="text-muted-foreground">Tên</span>
          <span className="min-w-0 break-words text-right font-medium">
            {getCustomerDisplayName(detailOrder)}
          </span>
        </div>
        {detailOrder.customer_phone && (
          <div className="flex min-w-0 justify-between gap-3">
            <span className="text-muted-foreground">SĐT</span>
            <span className="font-medium">{detailOrder.customer_phone}</span>
          </div>
        )}
        <div className="flex min-w-0 justify-between gap-3">
          <span className="text-muted-foreground">Bàn</span>
          <span className="font-medium">
            {detailOrder.table_id ? `Bàn ${detailOrder.table_id}` : "N/A"}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2 border-t border-border pt-3 text-xs">
        <div className="mb-2 font-medium text-foreground">Thời gian</div>
        <div className="flex min-w-0 justify-between gap-3">
          <span className="text-muted-foreground">Tạo</span>
          <span>{formatDateTime(detailOrder.created_at)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cập nhật</span>
          <span>{formatDateTime(detailOrder.updated_at)}</span>
        </div>
        {detailOrder.status === "completed" && detailOrder.completed_at && (
          <div className="flex min-w-0 justify-between gap-3 text-green-600">
            <span className="text-muted-foreground">Hoàn thành</span>
            <span>{formatDateTime(detailOrder.completed_at)}</span>
          </div>
        )}
        {detailOrder.status === "cancelled" && detailOrder.cancelled_at && (
          <div className="flex min-w-0 justify-between gap-3 text-destructive">
            <span className="text-muted-foreground">Hủy</span>
            <span>{formatDateTime(detailOrder.cancelled_at)}</span>
          </div>
        )}
      </div>
    </>
  )
}

export function MobileOrderItems({
  order,
  items,
  isActionable,
  onUpdateOrderItemStatus,
  onCancelOrderItemClick,
}: MobileDetailSectionProps) {
  const actionsTriggerRefs = useRef(new Map<string, HTMLButtonElement>())

  return (
    <div className="space-y-2 border-t border-border pt-3 text-xs">
      <div className="mb-2 font-medium text-foreground">
        Món ({items.length})
      </div>
      <div className="space-y-1.5">
        {items.map((item, index) => {
          const isCancelled = item.status === "cancelled"
          const triggerKey = item._id ?? String(index)
          return (
            <div
              key={item._id ?? index}
              className={`rounded bg-white p-2 dark:bg-muted/30 ${isCancelled ? "opacity-60" : ""}`}
            >
              <div className="flex min-w-0 items-start justify-between gap-2">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  <span
                    className={`font-medium ${isCancelled ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {item.item_name}
                  </span>
                  <TableOrderItemStatusBadge status={item.status} />
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`font-medium whitespace-nowrap ${isCancelled ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {formatCurrency(item.total_price)}
                  </span>
                  {isActionable && !isCancelled && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          ref={(element) => {
                            if (element) {
                              actionsTriggerRefs.current.set(triggerKey, element)
                            } else {
                              actionsTriggerRefs.current.delete(triggerKey)
                            }
                          }}
                          variant="ghost"
                          size="icon"
                          aria-label={`Mở thao tác cho ${item.item_name}`}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <Icon name="MoreVertical" size={14} aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          onClick={() =>
                            onUpdateOrderItemStatus?.(
                              order,
                              item._id || "",
                              "preparing"
                            )
                          }
                        >
                          Báo đang làm
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onUpdateOrderItemStatus?.(
                              order,
                              item._id || "",
                              "ready"
                            )
                          }
                        >
                          Báo làm xong
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onUpdateOrderItemStatus?.(
                              order,
                              item._id || "",
                              "served"
                            )
                          }
                        >
                          Đã lên món
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            onCancelOrderItemClick?.(
                              order,
                              item._id || "",
                              actionsTriggerRefs.current.get(triggerKey)
                            )
                          }
                        >
                          Hủy món
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {formatCurrency(item.unit_price)} × {item.quantity}
              </div>
              {item.notes && (
                <p className="mt-1 text-xs text-warning">📝 {item.notes}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function MobilePaymentSummary({
  order,
  detailOrder,
  isActionable,
  subtotal,
  discountAmount,
  discountTypeLabel,
  total,
  onEditDiscountClick,
}: MobileDetailSectionProps) {
  return (
    <div className="space-y-1 rounded border-t border-border bg-primary/5 p-2 pt-3 text-xs">
      <div className="mb-2 font-medium text-foreground">Thanh toán</div>
      <div className="flex min-w-0 justify-between gap-3">
        <span className="text-muted-foreground">Tạm tính</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex min-w-0 justify-between gap-3">
        <span className="text-muted-foreground">
          Phí dịch vụ (
          {((detailOrder.service_charge_rate ?? 0) * 100).toFixed(0)}
          %)
        </span>
        <span>+{formatCurrency(detailOrder.service_charge_amount ?? 0)}</span>
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
                aria-label={`Chỉnh sửa giảm giá đơn ${order.order_number}`}
                className="shrink-0 text-muted-foreground hover:text-foreground"
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
          <div className="flex justify-between gap-2 text-xs text-muted-foreground">
            <span className="shrink-0">Mã:</span>
            <span className="min-w-0 truncate text-right">
              {detailOrder.discount_ref}
            </span>
          </div>
        )}
      </div>
      <div className="flex min-w-0 justify-between gap-3">
        <span className="text-muted-foreground">
          Thuế ({((detailOrder.tax_rate ?? 0) * 100).toFixed(0)}%)
        </span>
        <span>+{formatCurrency(detailOrder.tax_amount ?? 0)}</span>
      </div>
      <div className="flex min-w-0 justify-between gap-3 border-t border-border pt-2 font-bold">
        <span>Tổng</span>
        <span className="text-primary">
          {formatCurrency(total)} {detailOrder.currency}
        </span>
      </div>
    </div>
  )
}

export function MobileOrderNotes({ detailOrder }: MobileDetailSectionProps) {
  return (
    <>
      {detailOrder.notes && (
        <div className="border-t border-border pt-3 text-xs">
          <div className="mb-2 font-medium text-foreground">Ghi chú</div>
          <p className="break-words rounded bg-white p-2 dark:bg-muted/30">
            {detailOrder.notes}
          </p>
        </div>
      )}

      {/* Cancellation Reason */}
      {detailOrder.cancel_reason && (
        <div className="rounded border-t border-border bg-destructive/10 p-2 pt-3 text-xs">
          <div className="mb-1 font-medium text-destructive">Lý do hủy</div>
          <p className="break-words text-destructive">{detailOrder.cancel_reason}</p>
        </div>
      )}
    </>
  )
}
