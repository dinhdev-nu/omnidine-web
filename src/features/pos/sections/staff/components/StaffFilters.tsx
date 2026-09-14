import type { StaffPosition, StaffStatus } from "@/types/domain/staff"

import Button from "../../../ui/Button"
import Select from "../../../ui/Select"

interface StaffFiltersProps {
  filterRole: StaffPosition | ""
  filterStatus: StaffStatus | ""
  viewMode: "cards" | "table"
  onRoleChange: (role: StaffPosition | "") => void
  onStatusChange: (status: StaffStatus | "") => void
  onViewModeChange: (mode: "cards" | "table") => void
}

const roleOptions = [
  { value: "", label: "Tất cả vai trò" },
  { value: "manager", label: "Quản lý" },
  { value: "cashier", label: "Thu ngân" },
  { value: "kitchen", label: "Nhân viên bếp" },
  { value: "waiter", label: "Phục vụ" },
  { value: "delivery", label: "Giao hàng" },
]

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang làm việc" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "on_leave", label: "Đang nghỉ" },
  { value: "terminated", label: "Đã nghỉ việc" },
]

const StaffFilters = ({
  filterRole,
  filterStatus,
  viewMode,
  onRoleChange,
  onStatusChange,
  onViewModeChange,
}: StaffFiltersProps) => (
  <section
    aria-label="Bộ lọc và kiểu hiển thị nhân viên"
    className="mb-6 rounded-lg border border-border bg-card p-4 sm:p-6"
  >
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          name="staff_role_filter"
          label="Vai trò"
          options={roleOptions}
          value={filterRole}
          onChange={(event) =>
            onRoleChange(event.target.value as StaffPosition | "")
          }
          wrapperClassName="min-w-0 sm:w-48"
        />

        <Select
          name="staff_status_filter"
          label="Trạng thái"
          options={statusOptions}
          value={filterStatus}
          onChange={(event) =>
            onStatusChange(event.target.value as StaffStatus | "")
          }
          wrapperClassName="min-w-0 sm:w-48"
        />
      </div>

      <fieldset className="min-w-0">
        <legend className="mb-2 text-sm font-medium text-foreground">
          Kiểu hiển thị
        </legend>
        <div className="grid grid-cols-2 gap-2" role="group">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            iconName="Grid3X3"
            iconPosition="left"
            aria-pressed={viewMode === "cards"}
            onClick={() => onViewModeChange("cards")}
            className="w-full lg:w-auto"
          >
            Thẻ
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            iconName="List"
            iconPosition="left"
            aria-pressed={viewMode === "table"}
            onClick={() => onViewModeChange("table")}
            className="w-full lg:w-auto"
          >
            Bảng
          </Button>
        </div>
      </fieldset>
    </div>
  </section>
)

export default StaffFilters
