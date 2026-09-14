import { useRef } from "react"

import Button from "../../../ui/Button"
import Icon from "../../../ui/AppIcon"
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
import type {
  OrderDesktopDetailProps,
  OrderTableDetailItemRowProps,
} from "./order-table-desktop.types"

function OrderTableDetailItemRow({
  order,
  item,
  isActionable,
  onUpdateOrderItemStatus,
  onCancelOrderItemClick,
}: OrderTableDetailItemRowProps) {
  const isCancelled = item.status === "cancelled"
  const itemId = item._id || ""
  const actionsTriggerRef = useRef<HTMLButtonElement>(null)

  return (
    <div
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
            <TableOrderItemStatusBadge status={item.status} />
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
                  ref={actionsTriggerRef}
                  variant="ghost"
                  size="icon"
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  aria-label={`Mở thao tác cho ${item.item_name}`}
                >
                  <Icon name="MoreVertical" size={14} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onClick={() =>
                    onUpdateOrderItemStatus?.(order, itemId, "preparing")
                  }
                >
                  Báo đang làm
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    onUpdateOrderItemStatus?.(order, itemId, "ready")
                  }
                >
                  Báo làm xong
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    onUpdateOrderItemStatus?.(order, itemId, "served")
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
                      itemId,
                      actionsTriggerRef.current
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
}

export function OrderDesktopDetailMain({
  order,
  detailOrder,
  isActionable,
  onUpdateOrderItemStatus,
  onCancelOrderItemClick,
}: OrderDesktopDetailProps) {
  return (
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
            <span className="text-muted-foreground">Số đơn</span>
            <span className="font-semibold">{detailOrder.order_number}</span>
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
          <h5 className="text-xs font-semibold text-foreground">Khách hàng</h5>
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
              <span className="font-medium">{detailOrder.customer_phone}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bàn</span>
            <span className="font-medium">
              {detailOrder.table_id ? `Bàn ${detailOrder.table_id}` : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-3 overflow-hidden rounded-md border border-border bg-card">
        <div className="border-b border-border bg-muted/50 px-3 py-1.5">
          <h5 className="text-xs font-semibold text-foreground">Thời gian</h5>
        </div>
        <div className="space-y-1.5 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tạo</span>
            <span>{formatDateTime(detailOrder.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cập nhật</span>
            <span>{formatDateTime(detailOrder.updated_at)}</span>
          </div>
          {detailOrder.status === "completed" && detailOrder.completed_at && (
            <div className="flex justify-between text-green-600">
              <span className="text-muted-foreground">Hoàn thành</span>
              <span>{formatDateTime(detailOrder.completed_at)}</span>
            </div>
          )}
          {detailOrder.status === "cancelled" && detailOrder.cancelled_at && (
            <div className="flex justify-between text-destructive">
              <span className="text-muted-foreground">Hủy</span>
              <span>{formatDateTime(detailOrder.cancelled_at)}</span>
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
          {detailOrder.items?.map((item) => (
            <OrderTableDetailItemRow
              key={item._id ?? `${item.menu_item_id}-${item.created_at}`}
              order={order}
              item={item}
              isActionable={isActionable}
              onUpdateOrderItemStatus={onUpdateOrderItemStatus}
              onCancelOrderItemClick={onCancelOrderItemClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
