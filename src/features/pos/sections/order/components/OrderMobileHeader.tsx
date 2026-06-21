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
            <Icon name={expanded ? "ChevronDown" : "ChevronRight"} size={16} />
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
  )
}
