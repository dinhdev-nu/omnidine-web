import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import type { RefObject } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type {
  StaffDetail,
  StaffPosition,
  StaffStatus,
  StaffSummary,
} from "@/types/domain/staff"
import Button from "../../../ui/Button"
import { Spinner } from "../../../ui/Spinner"

interface StaffDetailsModalProps {
  isOpen: boolean
  staff: StaffSummary | null
  detail?: StaffDetail | null
  isLoading?: boolean
  onClose: () => void
  onEdit: (staff: StaffSummary, detail?: StaffDetail | null) => void
  returnFocusRef?: RefObject<HTMLElement | null>
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

const StaffDetailsModal = ({
  isOpen,
  staff,
  detail,
  isLoading = false,
  onClose,
  onEdit,
  returnFocusRef,
}: StaffDetailsModalProps) => {
  const infoRows = staff
    ? [
        {
          icon: "Badge",
          label: "Mã nhân viên",
          value: detail?.employee_code ?? staff.employee_code ?? "---",
        },
        {
          icon: "User",
          label: "User ID",
          value: detail?.user_id ?? staff.user_id ?? "---",
        },
        {
          icon: "Phone",
          label: "Số điện thoại",
          value: detail?.phone ?? staff.phone ?? "---",
        },
        {
          icon: "Mail",
          label: "Email",
          value: detail?.email ?? staff.email ?? "---",
        },
        {
          icon: "Calendar",
          label: "Ngày vào làm",
          value: detail?.hire_date
            ? new Date(detail.hire_date).toLocaleDateString("vi-VN")
            : staff.hire_date
              ? new Date(staff.hire_date).toLocaleDateString("vi-VN")
              : "---",
        },
        {
          icon: "Clock",
          label: "Cập nhật lần cuối",
          value: detail?.updated_at
            ? new Date(detail.updated_at).toLocaleString("vi-VN")
            : "---",
        },
      ]
    : []

  const permissionRows = detail?.permissions
    ? [
        {
          key: "can_discount",
          label: "Giảm giá",
          value: detail.permissions.can_discount,
        },
        {
          key: "can_cancel_order",
          label: "Hủy đơn",
          value: detail.permissions.can_cancel_order,
        },
        {
          key: "can_process_payment",
          label: "Thanh toán",
          value: detail.permissions.can_process_payment,
        },
        {
          key: "can_refund",
          label: "Hoàn tiền",
          value: detail.permissions.can_refund,
        },
        {
          key: "can_view_reports",
          label: "Xem báo cáo",
          value: detail.permissions.can_view_reports,
        },
        {
          key: "can_manage_tables",
          label: "Quản lý bàn",
          value: detail.permissions.can_manage_tables,
        },
        {
          key: "can_manage_menu",
          label: "Quản lý menu",
          value: detail.permissions.can_manage_menu,
        },
      ]
    : []

  return (
    <Dialog
      open={isOpen && Boolean(staff)}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      {staff && (
        <DialogContent
          showCloseButton={false}
          aria-busy={isLoading}
          className="grid max-h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-lg p-0 sm:max-h-[calc(100dvh-2rem)] sm:max-w-3xl"
          onCloseAutoFocus={(event) => {
            const trigger = returnFocusRef?.current
            if (trigger?.isConnected) {
              event.preventDefault()
              trigger.focus()
            }
          }}
        >
          <DialogHeader className="border-b border-border p-4 pr-16 text-left sm:p-6 sm:pr-20">
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
                <DialogTitle className="text-lg leading-snug font-semibold break-words text-card-foreground sm:text-xl">
                  {staff.full_name}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Thông tin hồ sơ và quyền truy cập trong hệ thống POS.
                </DialogDescription>
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

            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Đóng chi tiết nhân viên"
                className="absolute top-2 right-2 sm:top-4 sm:right-4"
              >
                <Icon name="X" size={20} aria-hidden="true" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="flex min-h-0 flex-col gap-6 overflow-y-auto overscroll-contain p-4 sm:p-6">
            {isLoading && (
              <div
                role="status"
                aria-live="polite"
                className="flex min-h-11 items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 text-sm text-muted-foreground"
              >
                <Spinner className="size-4" aria-hidden="true" />
                Đang tải dữ liệu chi tiết…
              </div>
            )}

            <section aria-labelledby="staff-detail-profile-title" className="flex flex-col gap-4">
              <h3
                id="staff-detail-profile-title"
                className="flex items-center gap-2 text-lg font-medium text-card-foreground"
              >
                <Icon name="User" size={18} aria-hidden="true" />
                <span>Thông tin nhân viên</span>
              </h3>
              <dl className="grid grid-cols-1 gap-4 rounded-lg bg-muted/20 p-4 sm:grid-cols-2">
                {infoRows.map((row) => (
                  <div key={row.label} className="flex min-w-0 items-start gap-3">
                    <Icon
                      name={row.icon}
                      size={16}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <dt className="text-sm text-muted-foreground">{row.label}</dt>
                      <dd className="font-medium break-words text-card-foreground [overflow-wrap:anywhere]">
                        {row.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="staff-detail-permissions-title" className="flex flex-col gap-4">
              <h3
                id="staff-detail-permissions-title"
                className="flex items-center gap-2 text-lg font-medium text-card-foreground"
              >
                <Icon name="Shield" size={18} aria-hidden="true" />
                <span>Quyền truy cập</span>
              </h3>
              {permissionRows.length > 0 ? (
                <ul className="grid grid-cols-1 gap-2 rounded-lg bg-muted/20 p-3 sm:grid-cols-2 sm:p-4">
                  {permissionRows.map((item) => (
                    <li
                      key={item.key}
                      className={cn(
                        "flex min-h-11 items-center gap-2 rounded-md px-2 text-sm",
                        item.value ? "text-success" : "text-error"
                      )}
                    >
                      <Icon
                        name={item.value ? "Check" : "X"}
                        size={16}
                        aria-hidden="true"
                      />
                      <span className="sr-only">
                        {item.value ? "Được cấp quyền" : "Không được cấp quyền"}:{" "}
                      </span>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
                  Quyền truy cập đang bị ẩn theo quyền hiện tại hoặc chưa có dữ liệu.
                </p>
              )}
            </section>
          </div>

          <DialogFooter className="mx-0 mb-0 rounded-none px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            <DialogClose asChild>
              <Button variant="default" className="w-full sm:w-auto">
                Đóng
              </Button>
            </DialogClose>
            <Button
              variant="outline"
              iconName="Edit"
              iconPosition="left"
              disabled={isLoading}
              className="w-full sm:w-auto"
              onClick={() => onEdit(staff, detail ?? null)}
            >
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default StaffDetailsModal
