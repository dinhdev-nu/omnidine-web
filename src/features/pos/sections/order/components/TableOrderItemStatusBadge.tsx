import React from "react"
import type { OrderItemStatus } from "@/types/domain/order"

const ORDER_ITEM_STATUS_CONFIG: Record<
  OrderItemStatus,
  { color: string; label: string }
> = {
  pending: {
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    label: "Chờ xử lý",
  },
  preparing: {
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    label: "Đang làm",
  },
  ready: {
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    label: "Xong",
  },
  served: {
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    label: "Đã lên",
  },
  cancelled: { color: "bg-destructive/15 text-destructive", label: "Đã hủy" },
}

export const TableOrderItemStatusBadge: React.FC<{
  status: OrderItemStatus
}> = ({ status }) => {
  const config =
    ORDER_ITEM_STATUS_CONFIG[status] ?? ORDER_ITEM_STATUS_CONFIG.pending
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${config.color}`}
    >
      {config.label}
    </span>
  )
}
