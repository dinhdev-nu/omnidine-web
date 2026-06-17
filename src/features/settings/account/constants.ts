import { LogIn, Shield, Lock, ShieldAlert, Unlock } from "lucide-react"

export const AUDIT_LOG = [
  {
    id: "1",
    type: "login",
    icon: LogIn,
    label: "Đăng nhập thành công",
    detail: "Chrome · Windows",
    ip: "192.168.1.1",
    at: "2026-03-23T09:12:00Z",
  },
  {
    id: "2",
    type: "2fa",
    icon: Shield,
    label: "Bật xác thực 2 lớp",
    detail: "Ứng dụng xác thực",
    ip: "192.168.1.1",
    at: "2026-03-22T14:00:00Z",
  },
  {
    id: "3",
    type: "password",
    icon: Lock,
    label: "Đổi mật khẩu",
    detail: "",
    ip: "192.168.1.2",
    at: "2026-03-21T08:30:00Z",
  },
  {
    id: "4",
    type: "login",
    icon: LogIn,
    label: "Đăng nhập thành công",
    detail: "Safari · macOS",
    ip: "10.0.0.5",
    at: "2026-03-20T19:45:00Z",
  },
  {
    id: "5",
    type: "2fa",
    icon: Unlock,
    label: "Tắt xác thực 2 lớp",
    detail: "Ứng dụng xác thực",
    ip: "10.0.0.5",
    at: "2026-03-19T11:00:00Z",
  },
  {
    id: "6",
    type: "login",
    icon: ShieldAlert,
    label: "Đăng nhập thất bại",
    detail: "Sai mật khẩu",
    ip: "203.0.113.10",
    at: "2026-03-18T03:22:00Z",
  },
] as const

export const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  active: { label: "Đang hoạt động", className: "bg-success/20 text-success border-success/30" },
  inactive: { label: "Không hoạt động", className: "bg-muted text-muted-foreground border-border" },
  banned: { label: "Đã khóa", className: "bg-destructive/20 text-destructive border-destructive/30" },
  pending: { label: "Đang chờ", className: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30" },
}

export const ROLE_LABEL: Record<string, string> = { admin: "Quản trị viên", user: "Thành viên" }

export function getInitials(fullName: string | undefined | null): string {
  if (!fullName?.trim()) return "?"

  const parts = fullName.trim().split(/\s+/)

  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
}



export const integrations = [
  { id: "salesforce", name: "Salesforce",       description: "Đồng bộ liên hệ và cơ hội",             connected: true,  lastSync: "2 giờ trước" },
  { id: "hubspot",    name: "HubSpot",           description: "Tự động hóa marketing và CRM",          connected: true,  lastSync: "5 phút trước" },
  { id: "slack",      name: "Slack",             description: "Thông báo và cảnh báo cho đội nhóm",   connected: true,  lastSync: "Theo thời gian thực" },
  { id: "gmail",      name: "Gmail",             description: "Theo dõi và đồng bộ email",            connected: false, lastSync: null },
  { id: "calendar",   name: "Google Calendar",   description: "Lên lịch cuộc họp",                    connected: false, lastSync: null },
  { id: "zoom",       name: "Zoom",              description: "Tích hợp họp video",                  connected: true,  lastSync: "1 giờ trước" },
];


export const MOCK_TOKENS = [
  { id: "t1", name: "Khóa API môi trường thật",   prefix: "omnidine_pk_", masked: "••••••••••••••••3f8a", createdAt: "2026-01-15", lastUsed: "2 giờ trước" },
  { id: "t2", name: "Khóa API môi trường phát triển",  prefix: "omnidine_sk_", masked: "••••••••••••••••9b2c", createdAt: "2026-02-01", lastUsed: "5 ngày trước"  },
];

