import Button from "../../../ui/Button"
import Icon from "../../../ui/AppIcon"
import { TableOrderStatusBadge, TablePaymentStatusBadge } from "./order-display"
import { formatCurrency, formatDateTime } from "./order-format"
import {
  getCustomerDisplayName,
  getOrderSourceLabel,
  getOrderTypeLabel,
} from "../order-table-utils"
import type { OrderTableDesktopRowProps } from "./order-table-desktop.types"

export function OrderDesktopSummaryRow({
  order,
  highlighted,
  expanded,
  onToggleExpand,
  onPaymentClick,
  onUpdateStatusClick,
  onCancelOrder,
}: Pick<
  OrderTableDesktopRowProps,
  | "order"
  | "highlighted"
  | "expanded"
  | "onToggleExpand"
  | "onPaymentClick"
  | "onUpdateStatusClick"
  | "onCancelOrder"
>) {
  return (
    <tr
      className={`transition-smooth border-b border-border hover:bg-muted/30 motion-reduce:transition-none ${highlighted ? "animate-pulse bg-primary/10 motion-reduce:animate-none" : ""}`}
    >
      <td className="p-4">
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground tabular-nums">
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
        <div className="flex items-center gap-1">
          {order.payment_status === "unpaid" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPaymentClick(order)}
              className="hover-scale"
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
                className="hover-scale"
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
              className="hover-scale"
              aria-label={`Hủy đơn ${order.order_number}`}
            >
              <Icon name="Trash" size={16} aria-hidden="true" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
}
