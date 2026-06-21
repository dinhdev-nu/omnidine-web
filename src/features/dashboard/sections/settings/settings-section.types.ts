import type { LucideIcon } from "lucide-react"
import type {
  Restaurant,
  RestaurantStaffDetail,
} from "@/types/domain/restaurant"

export interface Integration {
  id: string
  name: string
  description: string
  connected: boolean
  lastSync: string | null
}

export interface Tab {
  id: string
  label: string
  icon: LucideIcon
}

export interface RestaurantStatusOverride {
  isPublished?: boolean
  acceptsOnlineOrders?: boolean
}

export interface SettingsUiState {
  activeTab: string
  deleteRestaurantConfirmText: string
  isPublishing: boolean
  isTogglingOnlineOrders: boolean
  restaurantStatusOverrides: Record<string, RestaurantStatusOverride>
}

export type SettingsUiAction =
  | { type: "setActiveTab"; activeTab: string }
  | { type: "setDeleteRestaurantConfirmText"; text: string }
  | { type: "setIsPublishing"; isPublishing: boolean }
  | {
      type: "setIsTogglingOnlineOrders"
      isTogglingOnlineOrders: boolean
    }
  | {
      type: "setRestaurantStatusOverride"
      id: string
      override: RestaurantStatusOverride
    }

export interface SettingsSectionProps {
  restaurantDetail?: Restaurant | RestaurantStaffDetail | null
}

export interface SettingsTabsProps {
  activeTab: string
  onActiveTabChange: (activeTab: string) => void
}

export interface ProfileSettingsTabProps {
  restaurantDetail?: Restaurant | RestaurantStaffDetail | null
}

export interface NotificationSettingsTabProps {
  restaurantId?: string
  publishEnabled: boolean
  onlineOrdersEnabled: boolean
  isPublishing: boolean
  isTogglingOnlineOrders: boolean
  onPublishChange: (checked: boolean) => void
  onOnlineOrdersChange: (checked: boolean) => void
}

export interface SecuritySettingsTabProps {
  confirmText: string
  deleteRestaurantConfirmText: string
  isDeleteRestaurantEnabled: boolean
  onConfirmTextChange: (text: string) => void
  onDeleteRestaurant: () => void
}
