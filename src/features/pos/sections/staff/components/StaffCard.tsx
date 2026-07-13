import { memo } from "react"

import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import { cn } from "@/lib/utils"
import type {
  StaffPosition,
  StaffStatus,
  StaffSummary,
} from "@/types/domain/staff"

import Button from "../../../ui/Button"

export type StaffListItem = StaffSummary

const ROLE_LABEL: Record<StaffPosition, string> = {
  manager: "Quản lý",
  cashier: "Thu ngân",
  waiter: "Phục vụ",
  kitchen: "Nhân viên bếp",
  delivery: "Giao hàng",
}

const STATUS_LABEL: Record<StaffStatus, string> = {
  active: "Đang làm việc",
  inactive: "Không hoạt động",
  on_leave: "Đang nghỉ",
  terminated: "Đã nghỉ việc",
}

interface StaffCardProps {
  staff: StaffListItem
  isBusy?: boolean
  onEdit: (staff: StaffListItem) => void
  onToggleStatus: (staff: StaffListItem) => void
  onViewDetails: (staff: StaffListItem) => void
  onDelete: (staff: StaffListItem) => void
}

const STATUS_COLOR: Record<StaffStatus, string> = {
  active: "text-success",
  inactive: "text-muted-foreground",
  on_leave: "text-warning",
  terminated: "text-error",
}

const STATUS_BG: Record<StaffStatus, string> = {
  active: "bg-success/10",
  inactive: "bg-muted",
  on_leave: "bg-warning/10",
  terminated: "bg-error/10",
}

const STATUS_DOT: Record<StaffStatus, string> = {
  active: "bg-success",
  inactive: "bg-muted-foreground",
  on_leave: "bg-warning",
  terminated: "bg-error",
}

const ROLE_COLOR: Record<StaffPosition, string> = {
  manager: "bg-accent text-accent-foreground",
  cashier: "bg-secondary text-secondary-foreground",
  waiter: "bg-warning text-warning-foreground",
  kitchen: "bg-success text-success-foreground",
  delivery: "bg-primary text-primary-foreground",
}

const StaffCard = memo<StaffCardProps>(
  ({
    staff,
    isBusy = false,
    onEdit,
    onToggleStatus,
    onViewDetails,
    onDelete,
  }) => (
    <article
      aria-label={`Nhân viên ${staff.full_name}`}
      aria-busy={isBusy}
      className="rounded-lg border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-interactive motion-reduce:transition-none sm:p-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <div className="size-14 overflow-hidden rounded-full bg-muted sm:size-16">
              <Image
                src={staff.avatar_url ?? ""}
                alt=""
                className="size-full object-cover"
              />
            </div>
            <span
              aria-hidden="true"
              className={cn(
                "absolute -right-1 -bottom-1 size-5 rounded-full border-2 border-card",
                STATUS_DOT[staff.status]
              )}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg leading-snug font-semibold break-words text-card-foreground">
              {staff.full_name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-medium",
                  ROLE_COLOR[staff.position]
                )}
              >
                {ROLE_LABEL[staff.position]}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-medium",
                  STATUS_BG[staff.status],
                  STATUS_COLOR[staff.status]
                )}
              >
                {STATUS_LABEL[staff.status]}
              </span>
            </div>
          </div>
        </div>

        <div
          role="group"
          aria-label={`Thao tác nhanh cho ${staff.full_name}`}
          className="grid grid-cols-3 gap-2"
        >
          <Button
            variant="ghost"
            size="icon"
            disabled={isBusy}
            onClick={() => onEdit(staff)}
            aria-label={`Chỉnh sửa ${staff.full_name}`}
            className="w-full"
          >
            <Icon name="Edit" size={18} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={isBusy}
            onClick={() => onViewDetails(staff)}
            aria-label={`Xem chi tiết ${staff.full_name}`}
            className="w-full"
          >
            <Icon name="Eye" size={18} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={isBusy}
            onClick={() => onDelete(staff)}
            aria-label={`Xóa ${staff.full_name}`}
            className="w-full text-error hover:text-error"
          >
            <Icon name="Trash2" size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>

      <dl className="mt-4 flex flex-col gap-2">
        <div className="flex min-w-0 items-start gap-2 text-sm text-muted-foreground">
          <Icon name="Phone" size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Số điện thoại</dt>
          <dd className="min-w-0 break-words [overflow-wrap:anywhere]">
            {staff.phone ?? "---"}
          </dd>
        </div>
        <div className="flex min-w-0 items-start gap-2 text-sm text-muted-foreground">
          <Icon name="Mail" size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Email</dt>
          <dd className="min-w-0 break-words [overflow-wrap:anywhere]">
            {staff.email ?? "---"}
          </dd>
        </div>
        <div className="flex min-w-0 items-start gap-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Ngày vào làm</dt>
          <dd className="min-w-0 break-words">
            Ngày vào làm:{" "}
            {staff.hire_date
              ? new Date(staff.hire_date).toLocaleDateString("vi-VN")
              : "---"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isBusy}
          onClick={() => onToggleStatus(staff)}
          iconName={staff.status === "active" ? "Pause" : "Play"}
          iconPosition="left"
          className="w-full"
        >
          {staff.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
        </Button>
        <Button
          variant="default"
          size="sm"
          disabled={isBusy}
          onClick={() => onEdit(staff)}
          iconName="Settings"
          iconPosition="left"
          className="w-full"
        >
          Chỉnh sửa
        </Button>
      </div>
    </article>
  )
)

StaffCard.displayName = "StaffCard"

export default StaffCard
