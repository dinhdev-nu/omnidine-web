import React from "react"
import Icon from "@/components/AppIcon"
import { cn } from "@/lib/utils"
import type { TableListItem, TableStatus } from "@/types/domain/table"

interface TableCardProps {
  table: TableListItem
  currentOccupancy: number
  isDragging?: boolean
}

const STATUS_COLOR: Record<TableStatus, string> = {
  available: "bg-success text-success-foreground",
  occupied: "bg-warning text-warning-foreground",
  reserved: "bg-error text-error-foreground",
  cleaning: "bg-primary text-primary-foreground",
  inactive: "bg-muted text-muted-foreground",
}

const STATUS_ICON: Record<TableStatus, string> = {
  available: "CheckCircle",
  occupied: "Users",
  reserved: "Clock",
  cleaning: "Sparkles",
  inactive: "PowerOff",
}

const TableCard: React.FC<TableCardProps> = ({
  table,
  currentOccupancy,
  isDragging = false,
}) => {
  const visualStatus: TableStatus =
    table.is_active === false ? "inactive" : table.status

  return (
    <div
      className={cn(
        "relative flex min-h-32 w-36 flex-col items-center justify-center rounded-lg border-2 border-border bg-surface p-2 pt-3 transition-[box-shadow,opacity,transform] duration-200 motion-reduce:transition-none",
        isDragging ? "scale-95 opacity-50" : "group-hover:shadow-interactive"
      )}
    >
      <span className="line-clamp-2 max-w-full break-all text-center text-lg font-bold leading-tight text-foreground">
        {table.table_number}
      </span>

      <span className="mt-1 line-clamp-2 max-w-full break-words px-1 text-center text-xs font-medium leading-snug text-muted-foreground">
        {table.name || "Chưa đặt tên"}
      </span>

      <span
        className={cn(
          "absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full",
          STATUS_COLOR[visualStatus]
        )}
        aria-hidden="true"
      >
        <Icon name={STATUS_ICON[visualStatus]} size={12} />
      </span>

      <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <Icon name="Users" size={12} aria-hidden="true" />
        <span>
          {currentOccupancy}/{table.capacity} khách
        </span>
      </span>
    </div>
  )
}

export default TableCard
