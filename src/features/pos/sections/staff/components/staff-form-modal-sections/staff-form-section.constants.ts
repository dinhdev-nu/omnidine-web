import type { StaffPosition, StaffStatus } from "@/types/domain/staff"

export const PERMISSIONS_CONFIG = [
  { key: "can_discount", label: "Giảm giá" },
  { key: "can_cancel_order", label: "Hủy đơn" },
  { key: "can_process_payment", label: "Thanh toán" },
  { key: "can_refund", label: "Hoàn tiền" },
  { key: "can_view_reports", label: "Xem báo cáo" },
  { key: "can_manage_tables", label: "Quản lý bàn" },
  { key: "can_manage_menu", label: "Quản lý menu" },
] as const

// ── Static options ────────────────────────────────────────────────────────────

export const ROLE_OPTIONS = [
  { value: "manager" as StaffPosition, label: "Quản lý" },
  { value: "cashier" as StaffPosition, label: "Thu ngân" },
  { value: "kitchen" as StaffPosition, label: "Nhân viên bếp" },
  { value: "waiter" as StaffPosition, label: "Phục vụ" },
  { value: "delivery" as StaffPosition, label: "Giao hàng" },
]

export const STATUS_OPTIONS = [
  { value: "active" as StaffStatus, label: "Đang làm việc" },
  { value: "inactive" as StaffStatus, label: "Không hoạt động" },
  { value: "on_leave" as StaffStatus, label: "Đang nghỉ" },
  { value: "terminated" as StaffStatus, label: "Đã nghỉ việc" },
]
