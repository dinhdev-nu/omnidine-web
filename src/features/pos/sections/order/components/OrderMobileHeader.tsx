import Icon from "@/components/AppIcon"
import Button from "../../../ui/Button"
import { TableOrderStatusBadge, TablePaymentStatusBadge } from "./order-display"
import { formatCurrency, formatDateTime } from "./order-format"
import {
  getCustomerDisplayName,
  getOrderSourceLabel,
  getOrderTypeLabel,
} from "../order-table-utils"
import type { OrderTableMobileCardProps } from "./order-table-mobile.types"

export function OrderMobileHeader({
  order,
  highlighted,
  expanded,
  onToggleExpand,
  onPaymentClick,
  onUpdateStatusClick,
  onCancelOrder,
}: Pick<
  OrderTableMobileCardProps,
  | "order"
  | "highlighted"
  | "expanded"
  | "onToggleExpand"
  | "onPaymentClick"
  | "onUpdateStatusClick"
  | "onCancelOrder"
>) {
  return (
    <article
      className={`space-y-3 rounded-lg border border-border p-3 sm:p-4 ${highlighted ? "animate-pulse border-primary bg-primary/10 motion-reduce:animate-none" : ""}`}
    >
      <div className="flex min-w-0 flex-col gap-3 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`${expanded ? "Thu gọn" : "Mở"} chi tiết đơn ${order.order_number}`}
            aria-expanded={expanded}
            onClick={() => onToggleExpand(order)}
          >
            <Icon name={expanded ? "ChevronDown" : "ChevronRight"} size={16} aria-hidden="true" />
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
        <div className="flex shrink-0 items-center gap-1">
          {order.payment_status === "unpaid" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPaymentClick(order)}
              aria-label={`Thanh toán đơn ${order.order_number}`}
            >
              <Icon name="CreditCard" size={16} aria-hidden="true" />
            </Button>
          )}
          {order.status !== "cancelled" &&
            order.status !== "completed" &&
            order.status !== "refunded" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onUpdateStatusClick(order)}
                aria-label={`Cập nhật trạng thái đơn ${order.order_number}`}
              >
                <Icon name="GitBranch" size={16} aria-hidden="true" />
              </Button>
            )}
          {order.status !== "cancelled" && order.status !== "completed" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCancelOrder(order)}
              aria-label={`Hủy đơn ${order.order_number}`}
            >
              <Icon name="Trash" size={16} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm min-[390px]:grid-cols-2">
        <div className="min-w-0">
          <span className="text-muted-foreground">Ngày tạo:</span>
          <p className="font-medium text-foreground">
            {formatDateTime(order.created_at)}
          </p>
        </div>
        <div className="min-w-0">
          <span className="text-muted-foreground">Loại đơn:</span>
          <p className="font-medium text-foreground">
            {getOrderTypeLabel(order.order_type)}
          </p>
        </div>
        <div className="min-w-0">
          <span className="text-muted-foreground">Tổng tiền:</span>
          <p className="font-semibold text-foreground">
            {formatCurrency(order.total_amount)}
          </p>
          <p className="text-xs text-muted-foreground">{order.currency}</p>
        </div>
        <div className="min-w-0">
          <span className="text-muted-foreground">Nguồn đơn:</span>
          <p className="font-medium text-foreground">
            {getOrderSourceLabel(order.source)}
          </p>
        </div>
      </div>
    </article>
  )
}
