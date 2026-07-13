import { memo } from "react"

import Icon from "@/components/AppIcon"
import Image from "@/components/AppImage"
import { cn } from "@/lib/utils"
import type { StaffPosition, StaffStatus } from "@/types/domain/staff"

import Button from "../../../ui/Button"
import type { StaffListItem } from "./StaffCard"

interface StaffTableProps {
  staff: StaffListItem[]
  isStaffBusy?: (staffId: string) => boolean
  onEdit: (staff: StaffListItem) => void
  onToggleStatus: (staff: StaffListItem) => void
  onViewDetails: (staff: StaffListItem) => void
  onDelete: (staff: StaffListItem) => void
}

interface StaffActionsProps extends Omit<StaffTableProps, "staff" | "isStaffBusy"> {
  member: StaffListItem
  isBusy: boolean
  isMobile?: boolean
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

const StaffActions = ({
  member,
  isBusy,
  isMobile = false,
  onEdit,
  onToggleStatus,
  onViewDetails,
  onDelete,
}: StaffActionsProps) => (
  <div
    role="group"
    aria-label={`Thao tác cho ${member.full_name}`}
    className={isMobile ? "grid grid-cols-4 gap-2" : "flex items-center gap-1"}
  >
    <Button
      variant="ghost"
      size="icon"
      disabled={isBusy}
      onClick={() => onViewDetails(member)}
      aria-label={`Xem chi tiết ${member.full_name}`}
      className={isMobile ? "w-full" : undefined}
    >
      <Icon name="Eye" size={18} aria-hidden="true" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      disabled={isBusy}
      onClick={() => onEdit(member)}
      aria-label={`Chỉnh sửa ${member.full_name}`}
      className={isMobile ? "w-full" : undefined}
    >
      <Icon name="Edit" size={18} aria-hidden="true" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      disabled={isBusy}
      onClick={() => onToggleStatus(member)}
      aria-label={`${member.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"} ${member.full_name}`}
      className={isMobile ? "w-full" : undefined}
    >
      <Icon
        name={member.status === "active" ? "Pause" : "Play"}
        size={18}
        aria-hidden="true"
      />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      disabled={isBusy}
      onClick={() => onDelete(member)}
      aria-label={`Xóa ${member.full_name}`}
      className={cn(isMobile && "w-full", "text-error hover:text-error")}
    >
      <Icon name="Trash2" size={18} aria-hidden="true" />
    </Button>
  </div>
)

const StaffTable = memo<StaffTableProps>(
  ({
    staff,
    isStaffBusy = () => false,
    onEdit,
    onToggleStatus,
    onViewDetails,
    onDelete,
  }) => (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-3 p-3 md:hidden">
        {staff.map((member) => {
          const isBusy = isStaffBusy(member.id)

          return (
            <article
              key={member.id}
              aria-label={`Nhân viên ${member.full_name}`}
              aria-busy={isBusy}
              className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-background p-4"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="relative shrink-0">
                  <div className="size-12 overflow-hidden rounded-full bg-muted">
                    <Image
                      src={member.avatar_url ?? ""}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -right-0.5 -bottom-0.5 size-3 rounded-full border border-card",
                      STATUS_DOT[member.status]
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium break-words text-card-foreground">
                    {member.full_name}
                  </h3>
                  <p className="text-sm break-words text-muted-foreground [overflow-wrap:anywhere]">
                    {member.employee_code}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        ROLE_COLOR[member.position]
                      )}
                    >
                      {ROLE_LABEL[member.position]}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        STATUS_BG[member.status],
                        STATUS_COLOR[member.status]
                      )}
                    >
                      {STATUS_LABEL[member.status]}
                    </span>
                  </div>
                </div>
              </div>

              <dl className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex min-w-0 gap-2">
                  <dt className="shrink-0 font-medium text-foreground">Liên hệ:</dt>
                  <dd className="min-w-0 break-words [overflow-wrap:anywhere]">
                    {member.phone ?? member.email ?? "---"}
                  </dd>
                </div>
                <div className="flex min-w-0 gap-2">
                  <dt className="shrink-0 font-medium text-foreground">Ngày vào làm:</dt>
                  <dd>
                    {member.hire_date
                      ? new Date(member.hire_date).toLocaleDateString("vi-VN")
                      : "---"}
                  </dd>
                </div>
              </dl>

              <StaffActions
                member={member}
                isBusy={isBusy}
                isMobile
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onViewDetails={onViewDetails}
                onDelete={onDelete}
              />
            </article>
          )
        })}
      </div>

      <div
        tabIndex={0}
        role="region"
        aria-label="Bảng nhân viên. Có thể cuộn ngang để xem thêm cột."
        className="hidden overflow-x-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:block"
      >
        <table className="w-full min-w-[900px]">
          <caption className="sr-only">
            Danh sách nhân viên, vai trò, trạng thái, liên hệ và thao tác
          </caption>
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th scope="col" className="p-4 text-left font-medium text-muted-foreground">
                Nhân viên
              </th>
              <th scope="col" className="p-4 text-left font-medium text-muted-foreground">
                Vai trò
              </th>
              <th scope="col" className="p-4 text-left font-medium text-muted-foreground">
                Trạng thái
              </th>
              <th scope="col" className="p-4 text-left font-medium text-muted-foreground">
                Liên hệ
              </th>
              <th scope="col" className="p-4 text-left font-medium text-muted-foreground">
                Ngày vào làm
              </th>
              <th scope="col" className="p-4 text-left font-medium text-muted-foreground">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member, index) => {
              const isBusy = isStaffBusy(member.id)

              return (
                <tr
                  key={member.id}
                  aria-busy={isBusy}
                  className={cn(
                    "border-b border-border transition-colors duration-200 hover:bg-muted/20 motion-reduce:transition-none",
                    index % 2 === 0 ? "bg-background" : "bg-muted/5"
                  )}
                >
                  <td className="p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="size-10 overflow-hidden rounded-full bg-muted">
                          <Image
                            src={member.avatar_url ?? ""}
                            alt=""
                            className="size-full object-cover"
                          />
                        </div>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute -right-0.5 -bottom-0.5 size-3 rounded-full border border-card",
                            STATUS_DOT[member.status]
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium break-words text-card-foreground">
                          {member.full_name}
                        </p>
                        <p className="text-sm break-words text-muted-foreground [overflow-wrap:anywhere]">
                          {member.employee_code}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        ROLE_COLOR[member.position]
                      )}
                    >
                      {ROLE_LABEL[member.position]}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        STATUS_BG[member.status],
                        STATUS_COLOR[member.status]
                      )}
                    >
                      {STATUS_LABEL[member.status]}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex max-w-44 flex-col gap-1">
                      <div className="flex min-w-0 items-start gap-1 text-sm text-muted-foreground">
                        <Icon name="Phone" size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                          {member.phone ?? "---"}
                        </span>
                      </div>
                      <div className="flex min-w-0 items-start gap-1 text-sm text-muted-foreground">
                        <Icon name="Mail" size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                          {member.email ?? "---"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm font-medium text-card-foreground">
                    {member.hire_date
                      ? new Date(member.hire_date).toLocaleDateString("vi-VN")
                      : "---"}
                  </td>

                  <td className="p-4">
                    <StaffActions
                      member={member}
                      isBusy={isBusy}
                      onEdit={onEdit}
                      onToggleStatus={onToggleStatus}
                      onViewDetails={onViewDetails}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
)

StaffTable.displayName = "StaffTable"

export default StaffTable
