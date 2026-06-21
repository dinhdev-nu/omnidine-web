import React from "react"
import Icon from "@/components/AppIcon"
import type { OrderPaymentStatus } from "@/types/domain/order"

const PAYMENT_STATUS_TABLE_CONFIG: Record<
  OrderPaymentStatus,
  { color: string; label: string; icon: string }
> = {
  unpaid: {
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    label: "Chưa thanh toán",
    icon: "AlertCircle",
  },
  partial: {
    color:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    label: "Thanh toán một phần",
    icon: "AlertCircle",
  },
  paid: {
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    label: "Đã thanh toán",
    icon: "CheckCircle",
  },
  partially_refunded: {
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    label: "Hoàn tiền một phần",
    icon: "RotateCcw",
  },
  refunded: {
    color: "bg-secondary text-secondary-foreground",
    label: "Đã hoàn tiền",
    icon: "RotateCcw",
  },
}

export const TablePaymentStatusBadge: React.FC<{
  status: OrderPaymentStatus
}> = ({ status }) => {
  const config =
    PAYMENT_STATUS_TABLE_CONFIG[status] ?? PAYMENT_STATUS_TABLE_CONFIG.unpaid
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${config.color}`}
    >
      <Icon name={config.icon} size={12} />
      {config.label}
    </span>
  )
}
