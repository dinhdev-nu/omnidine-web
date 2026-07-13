import { useReducer } from "react"
import {
  updateRestaurantOnlineOrders,
  updateRestaurantPublishStatus,
} from "@/services/restaurants"
import { toAppError } from "@/services/core/error"
import { toast } from "sonner"
import { IntegrationsSettingsTab } from "./settings/IntegrationsSettingsTab"
import { NotificationSettingsTab } from "./settings/NotificationSettingsTab"
import { ProfileSettingsTab } from "./settings/ProfileSettingsTab"
import { SecuritySettingsTab } from "./settings/SecuritySettingsTab"
import { SettingsSectionHeader } from "./settings/SettingsSectionHeader"
import { SettingsTabs } from "./settings/SettingsTabs"
import { DELETE_RESTAURANT_CONFIRM_TEXT } from "./settings/settings-section.data"
import {
  initialSettingsUiState,
  settingsUiReducer,
} from "./settings/settings-section.reducer"
import type {
  RestaurantStatusOverride,
  SettingsSectionProps,
} from "./settings/settings-section.types"

export function SettingsSection({ restaurantDetail }: SettingsSectionProps) {
  const [uiState, dispatchUi] = useReducer(
    settingsUiReducer,
    initialSettingsUiState
  )
  const {
    activeTab,
    deleteRestaurantConfirmText,
    isPublishing,
    isTogglingOnlineOrders,
    restaurantStatusOverrides,
  } = uiState
  const restaurantId = restaurantDetail?._id
  const restaurantStatusOverride = restaurantId
    ? restaurantStatusOverrides[restaurantId]
    : undefined
  const publishEnabled =
    restaurantStatusOverride?.isPublished ??
    Boolean(restaurantDetail?.is_published)
  const onlineOrdersEnabled =
    restaurantStatusOverride?.acceptsOnlineOrders ??
    Boolean(restaurantDetail?.accepts_online_orders)

  const setRestaurantStatusOverride = (
    id: string,
    override: RestaurantStatusOverride
  ) => {
    dispatchUi({ type: "setRestaurantStatusOverride", id, override })
  }

  const handlePublishChange = async (checked: boolean) => {
    if (!restaurantId) return

    const previous = publishEnabled
    setRestaurantStatusOverride(restaurantId, { isPublished: checked })
    dispatchUi({ type: "setIsPublishing", isPublishing: true })

    try {
      await updateRestaurantPublishStatus(restaurantId, {
        is_published: checked,
      })
      toast.success(
        checked ? "Nhà hàng đã được xuất bản" : "Nhà hàng đã được ẩn"
      )
    } catch (error) {
      setRestaurantStatusOverride(restaurantId, { isPublished: previous })
      const appError = toAppError(
        error,
        "Không thể cập nhật trạng thái xuất bản"
      )
      toast.error(appError.message)
    } finally {
      dispatchUi({ type: "setIsPublishing", isPublishing: false })
    }
  }

  const handleOnlineOrdersChange = async (checked: boolean) => {
    if (!restaurantId) return

    const previous = onlineOrdersEnabled
    setRestaurantStatusOverride(restaurantId, { acceptsOnlineOrders: checked })
    dispatchUi({
      type: "setIsTogglingOnlineOrders",
      isTogglingOnlineOrders: true,
    })

    try {
      await updateRestaurantOnlineOrders(restaurantId, {
        accepts_online_orders: checked,
      })
      toast.success(
        checked ? "Đã bật nhận đơn online" : "Đã tắt nhận đơn online"
      )
    } catch (error) {
      setRestaurantStatusOverride(restaurantId, {
        acceptsOnlineOrders: previous,
      })
      const appError = toAppError(
        error,
        "Không thể cập nhật trạng thái nhận đơn online"
      )
      toast.error(appError.message)
    } finally {
      dispatchUi({
        type: "setIsTogglingOnlineOrders",
        isTogglingOnlineOrders: false,
      })
    }
  }

  const handleDeleteRestaurant = () => {
    if (
      deleteRestaurantConfirmText.trim().toUpperCase() !==
      DELETE_RESTAURANT_CONFIRM_TEXT
    ) {
      return
    }

    // TODO: Wire API call to permanently delete current restaurant.
  }

  const isDeleteRestaurantEnabled =
    deleteRestaurantConfirmText.trim().toUpperCase() ===
    DELETE_RESTAURANT_CONFIRM_TEXT

  return (
    <div className="min-w-0 space-y-6">
      <SettingsSectionHeader />
      <SettingsTabs
        activeTab={activeTab}
        onActiveTabChange={(nextActiveTab) =>
          dispatchUi({ type: "setActiveTab", activeTab: nextActiveTab })
        }
      />

      {activeTab === "profile" && (
        <div
          id="settings-panel-profile"
          role="tabpanel"
          aria-labelledby="settings-tab-profile"
          className="min-w-0"
        >
          <ProfileSettingsTab restaurantDetail={restaurantDetail} />
        </div>
      )}

      {activeTab === "notifications" && (
        <div
          id="settings-panel-notifications"
          role="tabpanel"
          aria-labelledby="settings-tab-notifications"
          className="min-w-0"
        >
          <NotificationSettingsTab
            restaurantId={restaurantId}
            publishEnabled={publishEnabled}
            onlineOrdersEnabled={onlineOrdersEnabled}
            isPublishing={isPublishing}
            isTogglingOnlineOrders={isTogglingOnlineOrders}
            onPublishChange={handlePublishChange}
            onOnlineOrdersChange={handleOnlineOrdersChange}
          />
        </div>
      )}

      {activeTab === "integrations" && (
        <div
          id="settings-panel-integrations"
          role="tabpanel"
          aria-labelledby="settings-tab-integrations"
          className="min-w-0"
        >
          <IntegrationsSettingsTab />
        </div>
      )}

      {activeTab === "security" && (
        <div
          id="settings-panel-security"
          role="tabpanel"
          aria-labelledby="settings-tab-security"
          className="min-w-0"
        >
          <SecuritySettingsTab
            confirmText={DELETE_RESTAURANT_CONFIRM_TEXT}
            deleteRestaurantConfirmText={deleteRestaurantConfirmText}
            isDeleteRestaurantEnabled={isDeleteRestaurantEnabled}
            onConfirmTextChange={(text) =>
              dispatchUi({ type: "setDeleteRestaurantConfirmText", text })
            }
            onDeleteRestaurant={handleDeleteRestaurant}
          />
        </div>
      )}
    </div>
  )
}
