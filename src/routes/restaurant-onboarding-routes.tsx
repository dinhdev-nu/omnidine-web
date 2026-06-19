import { lazy } from "react"
import { Route } from "react-router-dom"
import { RESTAURANT_ONBOARDING_ROUTE_PATH } from "@/routes/restaurant-onboarding-route-config"

const RestaurantOnboardingPage = lazy(
  () => import("@/pages/restaurant-onboarding/RestaurantOnboardingPage")
)

export function RestaurantOnboardingRoute() {
  return (
    <Route
      path={RESTAURANT_ONBOARDING_ROUTE_PATH}
      element={<RestaurantOnboardingPage />}
    />
  )
}
