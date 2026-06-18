import React from "react"
import type { OrderStatus } from "@/types/domain/order"

/**
 * Re-export API types for use in components
 * (avoid circular imports by importing directly from order-type.ts)
 */
export type {
  OrderStatus,
  OrderPaymentStatus,
  OrderItemStatus,
} from "@/types/domain/order"
export { TablePaymentStatusBadge } from "./TablePaymentStatusBadge"
export { TableOrderItemStatusBadge } from "./TableOrderItemStatusBadge"

const ORDER_STATUS_TABLE_CONFIG: Record<
  OrderStatus,
  { color: string; label: string }
> = {
  pending: {
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    label: "Chờ xử lý",
  },
  confirmed: {
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    label: "Đã xác nhận",
  },
  preparing: {
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    label: "Đang chuẩn bị",
  },
  ready: {
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    label: "Sẵn sàng",
  },
  delivering: {
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    label: "Đang giao",
  },
  completed: {
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    label: "Hoàn thành",
  },
  cancelled: { color: "bg-destructive/15 text-destructive", label: "Đã hủy" },
  refunded: {
    color: "bg-secondary text-secondary-foreground",
    label: "Đã hoàn tiền",
  },
}

export const TableOrderStatusBadge: React.FC<{ status: OrderStatus }> = ({
  status,
}) => {
  const config =
    ORDER_STATUS_TABLE_CONFIG[status] ?? ORDER_STATUS_TABLE_CONFIG.completed
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${config.color}`}
    >
      {config.label}
    </span>
  )
}
