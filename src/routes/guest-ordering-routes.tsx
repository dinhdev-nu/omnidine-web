import { lazy } from "react"
import { Route } from "react-router-dom"

const GuestMenuPage = lazy(() => import("@/pages/guest/ordering/GuestMenuPage"))
const GuestTableOrderingPage = lazy(
  () => import("@/pages/guest/ordering/GuestTableOrderingPage")
)

export function GuestOrderingRoute() {
  return (
    <>
      <Route
        path="/public/restaurants/:slug/menu"
        element={<GuestMenuPage />}
      />
      <Route
        path="/public/tables/:qrCode"
        element={<GuestTableOrderingPage />}
      />
    </>
  )
}
