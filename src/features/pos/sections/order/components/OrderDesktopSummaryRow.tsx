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
            <Icon name={expanded ? "ChevronDown" : "ChevronRight"} size={16} />
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
  )
}
