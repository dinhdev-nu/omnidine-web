import { Bell, Link2, Shield, User } from "lucide-react"
import type { Integration, Tab } from "./settings-section.types"

export const integrations: Integration[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Đồng bộ liên hệ và cơ hội",
    connected: false,
    lastSync: null,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Tự động hóa marketing và CRM",
    connected: false,
    lastSync: null,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Thông báo và cảnh báo nhóm",
    connected: false,
    lastSync: null,
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Theo dõi và đồng bộ email",
    connected: false,
    lastSync: null,
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description: "Lịch hẹn",
    connected: false,
    lastSync: null,
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Tích hợp hội nghị trực tuyến",
    connected: false,
    lastSync: null,
  },
]

export const tabs: Tab[] = [
  { id: "profile", label: "Hồ sơ", icon: User },
  { id: "notifications", label: "Trạng thái", icon: Bell },
  { id: "integrations", label: "Tích hợp", icon: Link2 },
  { id: "security", label: "Bảo mật", icon: Shield },
]

export const DELETE_RESTAURANT_CONFIRM_TEXT = "XOA NHA HANG"
