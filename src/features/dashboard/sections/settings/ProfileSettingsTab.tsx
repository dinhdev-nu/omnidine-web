import { CreateRestaurantProvider } from "@/features/restaurant-onboarding/FormProvider"
import { RestaurantProfileMainContent } from "./RestaurantProfileMainContent"
import {
  getRestaurantInitialFormData,
  getRestaurantInitialImagePreviews,
} from "./settings-section.reducer"
import type { ProfileSettingsTabProps } from "./settings-section.types"

export function ProfileSettingsTab({
  restaurantDetail,
}: ProfileSettingsTabProps) {
  return (
    <CreateRestaurantProvider
      key={restaurantDetail?.id ?? "restaurant-profile"}
      isEditing={true}
      restaurantId={restaurantDetail?.id}
      initialFormData={getRestaurantInitialFormData(restaurantDetail)}
      initialImagePreviews={getRestaurantInitialImagePreviews(restaurantDetail)}
    >
      <RestaurantProfileMainContent />
    </CreateRestaurantProvider>
  )
}
