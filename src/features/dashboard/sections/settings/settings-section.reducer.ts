import type { RestaurantDTO } from "@/features/restaurant-onboarding/constants"
import type {
  Restaurant,
  RestaurantStaffDetail,
} from "@/types/domain/restaurant"
import type {
  SettingsUiAction,
  SettingsUiState,
} from "./settings-section.types"

export const initialSettingsUiState: SettingsUiState = {
  activeTab: "profile",
  deleteRestaurantConfirmText: "",
  isPublishing: false,
  isTogglingOnlineOrders: false,
  restaurantStatusOverrides: {},
}

export function settingsUiReducer(
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

export function getRestaurantInitialFormData(
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

export function getRestaurantInitialImagePreviews(
  restaurantDetail?: Restaurant | RestaurantStaffDetail | null
) {
  return {
    logoUrl: restaurantDetail?.logo_url,
    coverUrl: restaurantDetail?.cover_image_url,
    galleryUrls: restaurantDetail?.gallery_urls,
  }
}
