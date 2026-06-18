import React from "react"
import Button from "../../../ui/Button"
import Icon from "../../../ui/AppIcon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../../ui/DropdownMenu"
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
import type { AllowedOrderItemStatusUpdate, Order } from "@/types/domain/order"

interface OrderTableDesktopRowProps {
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
      <tr
        className={`transition-smooth border-b border-border hover:bg-muted/30 ${highlighted ? "animate-pulse bg-primary/10" : ""}`}
      >
        <td className="p-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleExpand(order)}
              className="h-6 w-6"
            >
              <Icon
                name={expanded ? "ChevronDown" : "ChevronRight"}
                size={16}
              />
            </Button>
            <span className="font-mono text-sm font-medium">
              #{order.order_number}
            </span>
          </div>
        </td>
        <td className="p-4">
          <div className="text-sm font-medium text-foreground">
            {formatDateTime(order.created_at)}
          </div>
        </td>
        <td className="p-4">
          <div className="text-sm font-medium text-foreground">
            {getOrderTypeLabel(order.order_type)}
          </div>
        </td>
        <td className="p-4">
          <div className="text-sm text-muted-foreground">
            {getCustomerDisplayName(order)}
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-foreground">
              {formatCurrency(order.total_amount)}
            </span>
            <span className="text-xs text-muted-foreground">
              {order.currency}
            </span>
          </div>
        </td>
        <td className="p-4">
          <div className="text-sm font-medium text-foreground">
            {getOrderSourceLabel(order.source)}
          </div>
        </td>
        <td className="p-4">
          <TableOrderStatusBadge status={order.status} />
        </td>
        <td className="p-4">
          <TablePaymentStatusBadge status={order.payment_status} />
        </td>
        <td className="p-4">
          <div className="flex items-center space-x-2">
            {order.payment_status === "unpaid" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPaymentClick(order)}
                className="hover-scale"
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
                  className="hover-scale"
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
                className="hover-scale"
                title="Hủy đơn"
              >
                <Icon name="Trash" size={16} />
              </Button>
            )}
          </div>
        </td>
      </tr>

      {expanded && (
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
                    <div className="lg:col-span-2">
                      {/* Order Identification */}
                      <div className="mb-3 overflow-hidden rounded-md border border-border bg-card">
                        <div className="border-b border-border bg-muted/50 px-3 py-1.5">
                          <h5 className="text-xs font-semibold text-foreground">
                            Thông tin đơn hàng
                          </h5>
                        </div>
                        <div className="space-y-2 p-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Số đơn
                            </span>
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
                      </div>

                      {/* Customer Information */}
                      <div className="mb-3 overflow-hidden rounded-md border border-border bg-blue-50/30 bg-card dark:bg-blue-950/20">
                        <div className="border-b border-border bg-muted/50 px-3 py-1.5">
                          <h5 className="text-xs font-semibold text-foreground">
                            Khách hàng
                          </h5>
                        </div>
                        <div className="space-y-2 p-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tên</span>
                            <span className="font-semibold">
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
                      </div>

                      {/* Timeline */}
                      <div className="mb-3 overflow-hidden rounded-md border border-border bg-card">
                        <div className="border-b border-border bg-muted/50 px-3 py-1.5">
                          <h5 className="text-xs font-semibold text-foreground">
                            Thời gian
                          </h5>
                        </div>
                        <div className="space-y-1.5 p-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tạo</span>
                            <span>
                              {formatDateTime(detailOrder.created_at)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Cập nhật
                            </span>
                            <span>
                              {formatDateTime(detailOrder.updated_at)}
                            </span>
                          </div>
                          {detailOrder.status === "completed" &&
                            detailOrder.completed_at && (
                              <div className="flex justify-between text-green-600">
                                <span className="text-muted-foreground">
                                  Hoàn thành
                                </span>
                                <span>
                                  {formatDateTime(detailOrder.completed_at)}
                                </span>
                              </div>
                            )}
                          {detailOrder.status === "cancelled" &&
                            detailOrder.cancelled_at && (
                              <div className="flex justify-between text-destructive">
                                <span className="text-muted-foreground">
                                  Hủy
                                </span>
                                <span>
                                  {formatDateTime(detailOrder.cancelled_at)}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-md border border-border bg-card">
                        <div className="border-b border-border bg-muted/50 px-3 py-1.5">
                          <h5 className="flex items-center gap-2 text-xs font-semibold text-foreground">
                            <Icon name="ShoppingBag" size={12} />
                            Món ăn ({detailOrder.items?.length || 0})
                          </h5>
                        </div>
                        <div className="max-h-[200px] divide-y divide-border overflow-y-auto">
                          {detailOrder.items?.map((item) => {
                            const isCancelled = item.status === "cancelled"
                            return (
                              <div
                                key={item._id ?? `${item.menu_item_id}-${item.created_at}`}
                                className={`px-3 py-2 transition-colors hover:bg-muted/30 ${isCancelled ? "bg-muted/20 opacity-60" : ""}`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isCancelled ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}
                                      >
                                        {item.quantity}
                                      </span>
                                      <span
                                        className={`truncate text-sm font-medium ${isCancelled ? "text-muted-foreground line-through" : "text-foreground"}`}
                                      >
                                        {item.item_name}
                                      </span>
                                      <TableOrderItemStatusBadge
                                        status={item.status}
                                      />
                                    </div>
                                    <div className="mt-0.5 ml-7 text-xs text-muted-foreground">
                                      {formatCurrency(item.unit_price)}
                                    </div>
                                    {item.notes && (
                                      <p className="mt-0.5 ml-7 text-xs text-muted-foreground italic">
                                        📝 {item.notes}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span
                                      className={`text-sm font-semibold whitespace-nowrap ${isCancelled ? "text-muted-foreground line-through" : "text-foreground"}`}
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
                                            <Icon
                                              name="MoreVertical"
                                              size={14}
                                            />
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
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

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
                            <span className="text-muted-foreground">
                              Tạm tính
                            </span>
                            <span>{formatCurrency(detailOrder.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Phí dịch vụ (
                              {(
                                (detailOrder.service_charge_rate ?? 0) * 100
                              ).toFixed(0)}
                              %)
                            </span>
                            <span>
                              +
                              {formatCurrency(
                                detailOrder.service_charge_amount ?? 0
                              )}
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
                              Thuế (
                              {((detailOrder.tax_rate ?? 0) * 100).toFixed(0)}%)
                            </span>
                            <span>
                              +{formatCurrency(detailOrder.tax_amount ?? 0)}
                            </span>
                          </div>
                          <div className="mt-1.5 border-t border-border pt-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                Tổng
                              </span>
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
                              <span className="text-muted-foreground">
                                Nhân viên
                              </span>
                              <span className="font-medium">
                                {detailOrder.staff_id}
                              </span>
                            </div>
                          )}
                          {detailOrder.notes && (
                            <div className="border-t border-border pt-1.5">
                              <span className="mb-1 block text-muted-foreground">
                                Ghi chú
                              </span>
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
                  </>
                ) : null}
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="h-2 bg-muted/20" />
          </td>
        </tr>
      )}
    </React.Fragment>
  )
}

export default OrderTableDesktopRow
