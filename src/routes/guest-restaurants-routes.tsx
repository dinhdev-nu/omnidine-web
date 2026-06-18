import { Route } from "react-router-dom"

import GuestRestaurantsPage from "@/pages/guest/restaurants/GuestRestaurantsPage"

export const GUEST_RESTAURANTS_ROUTE_PATH = "/public/restaurants"

export function GuestRestaurantsRoute() {
    return <Route path={GUEST_RESTAURANTS_ROUTE_PATH} element={<GuestRestaurantsPage />} />
}
