import { useReducer } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { RestaurantProfileRegistrationForm } from "@/features/dashboard/components/RestaurantProfileRegistrationForm"
import {
  updateRestaurantOnlineOrders,
  updateRestaurantPublishStatus,
} from "@/services/restaurants"
import { toAppError } from "@/services/core/error"
import {
  CreateRestaurantProvider,
  useCreateRestaurantActions,
  useCreateRestaurantMeta,
} from "@/features/restaurant-onboarding/FormProvider"
import type { RestaurantDTO } from "@/features/restaurant-onboarding/constants"
import type {
  Restaurant,
  RestaurantStaffDetail,
} from "@/types/domain/restaurant"
import { toast } from "sonner"
import {
  User,
  Bell,
  Shield,
  Link2,
  ExternalLink,
  Zap,
  Loader2,
  type LucideIcon,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  connected: boolean
  lastSync: string | null
}

interface Tab {
  id: string
  label: string
  icon: LucideIcon
}

interface RestaurantStatusOverride {
  isPublished?: boolean
  acceptsOnlineOrders?: boolean
}

interface SettingsUiState {
  activeTab: string
  deleteRestaurantConfirmText: string
  isPublishing: boolean
  isTogglingOnlineOrders: boolean
  restaurantStatusOverrides: Record<string, RestaurantStatusOverride>
}

type SettingsUiAction =
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

const initialSettingsUiState: SettingsUiState = {
  activeTab: "profile",
  deleteRestaurantConfirmText: "",
  isPublishing: false,
  isTogglingOnlineOrders: false,
  restaurantStatusOverrides: {},
}

function settingsUiReducer(
  state: SettingsUiState,
  action: SettingsUiAction
): SettingsUiState {
  switch (action.type) {
    case "setActiveTab":
      return { ...state, activeTab: action.activeTab }
    case "setDeleteRestaurantConfirmText":
      return { ...state, deleteRestaurantConfirmText: action.text }
    case "setIsPublishing":
      return { ...state, isPublishing: action.isPublishing }
    case "setIsTogglingOnlineOrders":
      return {
        ...state,
        isTogglingOnlineOrders: action.isTogglingOnlineOrders,
      }
    case "setRestaurantStatusOverride":
      return {
        ...state,
        restaurantStatusOverrides: {
          ...state.restaurantStatusOverrides,
          [action.id]: {
            ...state.restaurantStatusOverrides[action.id],
            ...action.override,
          },
        },
      }
  }
}

const integrations: Integration[] = [
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

const tabs: Tab[] = [
  { id: "profile", label: "Hồ sơ", icon: User },
  { id: "notifications", label: "Trạng thái", icon: Bell },
  { id: "integrations", label: "Tích hợp", icon: Link2 },
  { id: "security", label: "Bảo mật", icon: Shield },
]

function getRestaurantInitialFormData(
  restaurantDetail?: Restaurant | RestaurantStaffDetail | null
): Partial<RestaurantDTO> | undefined {
  if (!restaurantDetail) return undefined

  return {
    name: restaurantDetail.name || "",
    slug: restaurantDetail.slug || "",
    description: restaurantDetail.description || "",
    logo_url: restaurantDetail.logo_url || "",
    cover_image_url: restaurantDetail.cover_image_url || "",
    website: restaurantDetail.website || "",
    cuisine_type: restaurantDetail.cuisine_type || "",
    price_range: restaurantDetail.price_range ?? undefined,
    address: restaurantDetail.address || "",
    city: restaurantDetail.city || "",
    district: restaurantDetail.district || "",
    ward: restaurantDetail.ward || "",
    latitude: restaurantDetail.latitude ?? undefined,
    longitude: restaurantDetail.longitude ?? undefined,
    phone: restaurantDetail.phone || "",
    email: restaurantDetail.email || "",
    timezone: restaurantDetail.timezone || "Asia/Ho_Chi_Minh",
    operating_hours: restaurantDetail.operating_hours ?? undefined,
    gallery_urls: restaurantDetail.gallery_urls ?? [],
  }
}

function getRestaurantInitialImagePreviews(
  restaurantDetail?: Restaurant | RestaurantStaffDetail | null
) {
  return {
    logoUrl: restaurantDetail?.logo_url,
    coverUrl: restaurantDetail?.cover_image_url,
    galleryUrls: restaurantDetail?.gallery_urls,
  }
}

function RestaurantProfileMainContent() {
  const { submitForm } = useCreateRestaurantActions()
  const { isSubmitting, isUploadingAssets } = useCreateRestaurantMeta()

  return (
    <form onSubmit={submitForm} className="space-y-6">
      <RestaurantProfileRegistrationForm />

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-accent text-white hover:bg-accent/90"
          disabled={isSubmitting || isUploadingAssets}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu thông tin nhà hàng"
          )}
        </Button>
      </div>
    </form>
  )
}

interface SettingsSectionProps {
  restaurantDetail?: Restaurant | RestaurantStaffDetail | null
}

function SettingsSectionHeader() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">Cài đặt</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Quản lý hồ sơ nhà hàng, thông báo, tích hợp và bảo mật.
      </p>
    </div>
  )
}

interface SettingsTabsProps {
  activeTab: string
  onActiveTabChange: (activeTab: string) => void
}

function SettingsTabs({ activeTab, onActiveTabChange }: SettingsTabsProps) {
  return (
    <div className="flex w-fit gap-2 rounded-lg border border-border bg-secondary p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => onActiveTabChange(tab.id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              tab.id === activeTab
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

interface ProfileSettingsTabProps {
  restaurantDetail?: Restaurant | RestaurantStaffDetail | null
}

function ProfileSettingsTab({ restaurantDetail }: ProfileSettingsTabProps) {
  return (
    <CreateRestaurantProvider
      key={restaurantDetail?._id ?? "restaurant-profile"}
      isEditing={true}
      restaurantId={restaurantDetail?._id}
      initialFormData={getRestaurantInitialFormData(restaurantDetail)}
      initialImagePreviews={getRestaurantInitialImagePreviews(restaurantDetail)}
    >
      <RestaurantProfileMainContent />
    </CreateRestaurantProvider>
  )
}

interface NotificationSettingsTabProps {
  restaurantId?: string
  publishEnabled: boolean
  onlineOrdersEnabled: boolean
  isPublishing: boolean
  isTogglingOnlineOrders: boolean
  onPublishChange: (checked: boolean) => void
  onOnlineOrdersChange: (checked: boolean) => void
}

function NotificationSettingsTab({
  restaurantId,
  publishEnabled,
  onlineOrdersEnabled,
  isPublishing,
  isTogglingOnlineOrders,
  onPublishChange,
  onOnlineOrdersChange,
}: NotificationSettingsTabProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Trạng thái hoạt động
        </CardTitle>
        <CardDescription>
          Điều khiển trạng thái xuất bản và nhận đơn online của nhà hàng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary/20 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">Xuất bản nhà hàng</p>
                <Badge
                  className={
                    publishEnabled
                      ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-600"
                      : "border-border bg-muted text-muted-foreground"
                  }
                >
                  {publishEnabled ? "Đang hiển thị" : "Đang ẩn"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Bật để nhà hàng xuất hiện trên các trang công khai.
              </p>
            </div>
            <Switch
              checked={publishEnabled}
              onCheckedChange={onPublishChange}
              disabled={!restaurantId || isPublishing}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary/20 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">Nhận đơn online</p>
                <Badge
                  className={
                    onlineOrdersEnabled
                      ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-600"
                      : "border-border bg-muted text-muted-foreground"
                  }
                >
                  {onlineOrdersEnabled ? "Đang bật" : "Đang tắt"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Cho phép khách đặt món trực tuyến cho nhà hàng này.
              </p>
            </div>
            <Switch
              checked={onlineOrdersEnabled}
              onCheckedChange={onOnlineOrdersChange}
              disabled={!restaurantId || isTogglingOnlineOrders}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function IntegrationsSettingsTab() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Dịch vụ đã kết nối
        </CardTitle>
        <CardDescription>Quản lý các tích hợp bên thứ ba</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {integrations.map((integration, index) => (
            <div
              key={integration.id}
              className="animate-in rounded-lg border border-border bg-secondary/20 p-4 transition-all duration-300 fade-in slide-in-from-bottom-2 hover:border-muted-foreground/30"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Zap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {integration.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <Badge className="border-border bg-muted text-muted-foreground">
                  Chưa kết nối
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Chưa cấu hình
                </span>
                <Button
                  size="sm"
                  className="h-8 bg-accent text-white hover:bg-accent/90"
                >
                  Kết nối
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface SecuritySettingsTabProps {
  confirmText: string
  deleteRestaurantConfirmText: string
  isDeleteRestaurantEnabled: boolean
  onConfirmTextChange: (text: string) => void
  onDeleteRestaurant: () => void
}

function SecuritySettingsTab({
  confirmText,
  deleteRestaurantConfirmText,
  isDeleteRestaurantEnabled,
  onConfirmTextChange,
  onDeleteRestaurant,
}: SecuritySettingsTabProps) {
  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-medium text-destructive">
            Xóa nhà hàng
          </CardTitle>
          <CardDescription>
            Hành động này sẽ xóa vĩnh viễn dữ liệu nhà hàng và không thể hoàn
            tác
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-muted-foreground">
              Khi xóa nhà hàng, toàn bộ thông tin hồ sơ, menu, đơn hàng và dữ
              liệu liên quan sẽ bị gỡ bỏ khỏi hệ thống.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Nhập <span className="text-destructive">{confirmText}</span> để
              xác nhận xóa.
            </p>
            <Input
              value={deleteRestaurantConfirmText}
              onChange={(event) => onConfirmTextChange(event.target.value)}
              placeholder={confirmText}
              className="max-w-md border-border bg-background focus-visible:ring-destructive/20"
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={onDeleteRestaurant}
              disabled={!isDeleteRestaurantEnabled}
            >
              Xóa nhà hàng
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

const DELETE_RESTAURANT_CONFIRM_TEXT = "XOA NHA HANG"

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
    <div className="space-y-6">
      <SettingsSectionHeader />
      <SettingsTabs
        activeTab={activeTab}
        onActiveTabChange={(nextActiveTab) =>
          dispatchUi({ type: "setActiveTab", activeTab: nextActiveTab })
        }
      />

      {activeTab === "profile" && (
        <ProfileSettingsTab restaurantDetail={restaurantDetail} />
      )}

      {activeTab === "notifications" && (
        <NotificationSettingsTab
          restaurantId={restaurantId}
          publishEnabled={publishEnabled}
          onlineOrdersEnabled={onlineOrdersEnabled}
          isPublishing={isPublishing}
          isTogglingOnlineOrders={isTogglingOnlineOrders}
          onPublishChange={handlePublishChange}
          onOnlineOrdersChange={handleOnlineOrdersChange}
        />
      )}

      {activeTab === "integrations" && <IntegrationsSettingsTab />}

      {activeTab === "security" && (
        <SecuritySettingsTab
          confirmText={DELETE_RESTAURANT_CONFIRM_TEXT}
          deleteRestaurantConfirmText={deleteRestaurantConfirmText}
          isDeleteRestaurantEnabled={isDeleteRestaurantEnabled}
          onConfirmTextChange={(text) =>
            dispatchUi({ type: "setDeleteRestaurantConfirmText", text })
          }
          onDeleteRestaurant={handleDeleteRestaurant}
        />
      )}
    </div>
  )
}
