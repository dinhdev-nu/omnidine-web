import React from "react"
import { cn } from "@/lib/utils"
import Button, { type ButtonProps } from "../../../ui/Button"
import type { TableListItem, TableStatus } from "@/types/domain/table"

interface QuickAction {
  label: string
  icon: string
  variant: ButtonProps["variant"]
  action: () => void
}

interface QuickActionBarProps {
  selectedTable?: TableListItem | null
  selectedTableCurrentOccupancy?: number
  isUpdatingStatus?: boolean
  detailsButtonRef?: React.RefObject<HTMLButtonElement | null>
  onQuickStatusChange: (id: string, status: TableStatus) => void
  onOpenDetails: () => void
}

const STATUS_LABEL: Record<TableStatus, string> = {
  available: "Trống",
  occupied: "Có khách",
  reserved: "Đã đặt",
  cleaning: "Dọn dẹp",
  inactive: "Ngừng hoạt động",
}

const STATUS_CLASS: Record<TableStatus, string> = {
  available: "bg-success/10 text-success",
  occupied: "bg-warning/10 text-warning",
  reserved: "bg-error/10 text-error",
  cleaning: "bg-primary/10 text-primary",
  inactive: "bg-muted text-muted-foreground",
}

const QuickActionBar: React.FC<QuickActionBarProps> = ({
  selectedTable,
  selectedTableCurrentOccupancy = 0,
  isUpdatingStatus = false,
  detailsButtonRef,
  onQuickStatusChange,
  onOpenDetails,
}) => {
  const barClassName =
    "min-h-16 shrink-0 border-t border-border bg-surface px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-4"

  if (!selectedTable) {
    return (
      <div className={cn(barClassName, "flex items-center justify-center")}>
        <p className="text-center text-sm text-muted-foreground">
          Chọn một bàn để hiển thị thao tác nhanh
        </p>
      </div>
    )
  }

  const getActions = (): QuickAction[] => {
    const id = selectedTable._id
    switch (selectedTable.status) {
      case "available":
        return [
          {
            label: "Đón khách",
            icon: "UserPlus",
            variant: "default",
            action: () => onQuickStatusChange(id, "occupied"),
          },
          {
            label: "Đặt trước",
            icon: "Clock",
            variant: "outline",
            action: () => onQuickStatusChange(id, "reserved"),
          },
        ]
      case "occupied":
        return [
          {
            label: "Hoàn thành",
            icon: "CheckCircle",
            variant: "success",
            action: () => onQuickStatusChange(id, "cleaning"),
          },
        ]
      case "reserved":
        return [
          {
            label: "Nhận khách",
            icon: "Check",
            variant: "default",
            action: () => onQuickStatusChange(id, "occupied"),
          },
          {
            label: "Hủy đặt",
            icon: "X",
            variant: "outline",
            action: () => onQuickStatusChange(id, "available"),
          },
        ]
      case "cleaning":
        return [
          {
            label: "Dọn xong",
            icon: "CheckCircle",
            variant: "success",
            action: () => onQuickStatusChange(id, "available"),
          },
        ]
      case "inactive":
        return []
    }

    return []
  }

  const actions = getActions()

  return (
    <div className={barClassName} aria-busy={isUpdatingStatus}>
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <div
            className="flex size-10 max-w-20 shrink-0 items-center justify-center rounded-md bg-primary px-1 text-primary-foreground"
            aria-hidden="true"
          >
            <span className="truncate text-xs font-bold sm:text-sm">
              {selectedTable.table_number}
            </span>
          </div>

          <div className="hidden min-w-0 md:block">
            <p className="max-w-56 truncate text-sm font-medium text-foreground">
              Bàn {selectedTable.table_number}
            </p>
            <p className="max-w-56 truncate text-xs text-muted-foreground">
              {selectedTableCurrentOccupancy}/{selectedTable.capacity} khách
            </p>
          </div>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
            STATUS_CLASS[selectedTable.status]
          )}
        >
          {STATUS_LABEL[selectedTable.status]}
        </span>

        <div className="ml-auto flex min-w-0 items-center gap-2 overflow-x-auto pb-1">
          <Button
            ref={detailsButtonRef}
            variant="outline"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            onClick={onOpenDetails}
            className="shrink-0 whitespace-nowrap lg:hidden"
            aria-label={`Mở chi tiết bàn ${selectedTable.table_number}`}
          >
            Chi tiết
          </Button>

          {actions.map((action) => (
            <Button
              key={`${action.label}-${action.icon}`}
              variant={action.variant}
              size="sm"
              iconName={action.icon}
              iconPosition="left"
              onClick={action.action}
              disabled={isUpdatingStatus || selectedTable.is_active === false}
              className="shrink-0 whitespace-nowrap"
            >
              {action.label}
            </Button>
          ))}

          {isUpdatingStatus && (
            <span className="shrink-0 text-xs text-muted-foreground" role="status">
              Đang cập nhật...
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuickActionBar
