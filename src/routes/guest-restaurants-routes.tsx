import { lazy } from "react"
import { Route } from "react-router-dom"

const GuestRestaurantsPage = lazy(
  () => import("@/pages/guest/restaurants/GuestRestaurantsPage")
)

export const GUEST_RESTAURANTS_ROUTE_PATH = "/public/restaurants"

export function GuestRestaurantsRoute() {
  return (
    <Route
      path={GUEST_RESTAURANTS_ROUTE_PATH}
      element={<GuestRestaurantsPage />}
    />
  )
}
