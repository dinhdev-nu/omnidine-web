import React from "react"
import Button from "../../../components/Button"
import Icon from "@/components/AppIcon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../../components/DropdownMenu"
import {
  formatCurrency,
  formatDateTime,
  TableOrderStatusBadge,
  TablePaymentStatusBadge,
  TableOrderItemStatusBadge,
} from "./order-display"
import {
  getCustomerDisplayName,
  getOrderSourceLabel,
  getOrderTypeLabel,
} from "./order-table-utils"
import type { AllowedOrderItemStatusUpdate, Order } from "@/types/order-type"

interface OrderTableMobileCardProps {
  order: Order
  detailOrder?: Order | null
  isLoadingDetail?: boolean
  highlighted: boolean
  expanded: boolean
  onToggleExpand: (order: Order) => void
  onPaymentClick: (order: Order) => void
  onUpdateStatusClick: (order: Order) => void
  onCancelOrder: (order: Order) => void
  onUpdateOrderItemStatus?: (
    order: Order,
    itemId: string,
    status: AllowedOrderItemStatusUpdate
  ) => void
  onCancelOrderItemClick?: (order: Order, itemId: string) => void
  onEditDiscountClick?: (order: Order) => void
}

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
      {/* Card Header */}
      <div
        className={`space-y-3 rounded-lg border border-border p-4 ${highlighted ? "animate-pulse border-primary bg-primary/10" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleExpand(order)}
              className="h-8 w-8"
            >
              <Icon
                name={expanded ? "ChevronDown" : "ChevronRight"}
                size={16}
              />
            </Button>
            <span className="font-mono text-sm font-medium">
              #{order.order_number}
            </span>
            <span className="text-xs text-muted-foreground">
              {getCustomerDisplayName(order)}
            </span>
            <TableOrderStatusBadge status={order.status} />
            <TablePaymentStatusBadge status={order.payment_status} />
          </div>
          <div className="flex items-center space-x-2">
            {order.payment_status === "unpaid" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPaymentClick(order)}
                className="h-8 w-8"
                title="Thanh toán"
              >
                <Icon name="CreditCard" size={16} />
              </Button>
            )}
            {order.status !== "cancelled" &&
              order.status !== "completed" &&
              order.status !== "refunded" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateStatusClick(order)}
                  className="h-8 w-8"
                  title="Cập nhật trạng thái"
                >
                  <Icon name="GitBranch" size={16} />
                </Button>
              )}
            {order.status !== "cancelled" && order.status !== "completed" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCancelOrder(order)}
                className="h-8 w-8"
              >
                <Icon name="Trash" size={16} />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Ngày tạo:</span>
            <p className="font-medium text-foreground">
              {formatDateTime(order.created_at)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Loại đơn:</span>
            <p className="font-medium text-foreground">
              {getOrderTypeLabel(order.order_type)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Tổng tiền:</span>
            <p className="font-semibold text-foreground">
              {formatCurrency(order.total_amount)}
            </p>
            <p className="text-xs text-muted-foreground">{order.currency}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Nguồn đơn:</span>
            <p className="font-medium text-foreground">
              {getOrderSourceLabel(order.source)}
            </p>
          </div>
        </div>
      </div>

      {/* Expansion Row */}
      {expanded && (
        <div className="space-y-4 rounded-b-lg border border-t-0 border-border bg-muted/20 p-4">
          {/* Loading State */}
          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span className="text-sm">Đang tải...</span>
              </div>
            </div>
          ) : detailOrder ? (
            <>
              {/* Order Items */}
              {/* Order Identification */}
              <div className="space-y-2 text-xs">
                <div className="mb-2 font-medium text-foreground">
                  Thông tin đơn hàng
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số đơn</span>
                  <span className="font-semibold">
                    {detailOrder.order_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại</span>
                  <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {getOrderTypeLabel(detailOrder.order_type)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nguồn</span>
                  <span className="inline-block rounded bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
                    {getOrderSourceLabel(detailOrder.source)}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-2 border-t border-border pt-3 text-xs">
                <div className="mb-2 font-medium text-foreground">
                  Khách hàng
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên</span>
                  <span className="font-medium">
                    {getCustomerDisplayName(detailOrder)}
                  </span>
                </div>
                {detailOrder.customer_phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SĐT</span>
                    <span className="font-medium">
                      {detailOrder.customer_phone}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bàn</span>
                  <span className="font-medium">
                    {detailOrder.table_id
                      ? `Bàn ${detailOrder.table_id}`
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2 border-t border-border pt-3 text-xs">
                <div className="mb-2 font-medium text-foreground">
                  Thời gian
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạo</span>
                  <span>{formatDateTime(detailOrder.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cập nhật</span>
                  <span>{formatDateTime(detailOrder.updated_at)}</span>
                </div>
                {detailOrder.status === "completed" &&
                  detailOrder.completed_at && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-muted-foreground">Hoàn thành</span>
                      <span>{formatDateTime(detailOrder.completed_at)}</span>
                    </div>
                  )}
                {detailOrder.status === "cancelled" &&
                  detailOrder.cancelled_at && (
                    <div className="flex justify-between text-destructive">
                      <span className="text-muted-foreground">Hủy</span>
                      <span>{formatDateTime(detailOrder.cancelled_at)}</span>
                    </div>
                  )}
              </div>

              {/* Order Items */}
              <div className="space-y-2 border-t border-border pt-3 text-xs">
                <div className="mb-2 font-medium text-foreground">
                  Món ({items.length})
                </div>
                <div className="space-y-1.5">
                  {items.map((item, index) => {
                    const isCancelled = item.status === "cancelled"
                    return (
                      <div
                        key={item._id ?? index}
                        className={`rounded bg-white p-2 dark:bg-muted/30 ${isCancelled ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
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
                                    variant="ghost"
                                    size="icon"
                                    className="ml-1 h-6 w-6 text-muted-foreground hover:text-foreground"
                                  >
                                    <Icon name="MoreVertical" size={14} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-36"
                                >
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
                                        item._id || ""
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
                          <p className="mt-1 text-xs text-warning">
                            📝 {item.notes}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-1 rounded border-t border-border bg-primary/5 p-2 pt-3 text-xs">
                <div className="mb-2 font-medium text-foreground">
                  Thanh toán
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatCurrency(subtotal)}</span>
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
                          className="h-5 w-5 shrink-0 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditDiscountClick?.(order)
                          }}
                        >
                          <Icon name="Edit2" size={12} />
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Thuế ({((detailOrder.tax_rate ?? 0) * 100).toFixed(0)}%)
                  </span>
                  <span>+{formatCurrency(detailOrder.tax_amount ?? 0)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-bold">
                  <span>Tổng</span>
                  <span className="text-primary">
                    {formatCurrency(total)} {detailOrder.currency}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {detailOrder.notes && (
                <div className="border-t border-border pt-3 text-xs">
                  <div className="mb-2 font-medium text-foreground">
                    Ghi chú
                  </div>
                  <p className="rounded bg-white p-2 dark:bg-muted/30">
                    {detailOrder.notes}
                  </p>
                </div>
              )}

              {/* Cancellation Reason */}
              {detailOrder.cancel_reason && (
                <div className="rounded border-t border-border bg-destructive/10 p-2 pt-3 text-xs">
                  <div className="mb-1 font-medium text-destructive">
                    Lý do hủy
                  </div>
                  <p className="text-destructive">
                    {detailOrder.cancel_reason}
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </>
  )
}

export default OrderTableMobileCard
