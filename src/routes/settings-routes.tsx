import { lazy } from "react"
import { Navigate, Route } from "react-router-dom"

import {
  ACCOUNT_SECTION_RELATIVE_PATHS,
  ACCOUNT_SECTION_ROUTE_PATHS,
  SETTINGS_BASE_PATH,
} from "@/features/settings/account"

const SettingsLayout = lazy(async () => {
  const module = await import("@/layouts/settings/SettingsLayout")
  return { default: module.SettingsLayout }
})
const AccountPage = lazy(() => import("@/pages/settings/AccountPage"))
const ProfileSection = lazy(async () => {
  const module = await import("@/features/settings/account/ProfileSection")
  return { default: module.ProfileSection }
})
const NotificationSection = lazy(async () => {
  const module = await import("@/features/settings/account/NotificationSection")
  return { default: module.NotificationSection }
})
const SecuritySection = lazy(async () => {
  const module = await import("@/features/settings/account/SecuritySection")
  return { default: module.SecuritySection }
})
const ListRestaurantsSection = lazy(async () => {
  const module =
    await import("@/features/settings/manages/ListRestaurantsSection")
  return { default: module.ListRestaurantsSection }
})

export function SettingRoutes() {
  return (
    <Route path={SETTINGS_BASE_PATH} element={<SettingsLayout />}>
      <Route
        index
        element={<Navigate to={ACCOUNT_SECTION_ROUTE_PATHS.profile} replace />}
      />

      <Route path="account" element={<AccountPage />}>
        <Route
          index
          element={
            <Navigate to={ACCOUNT_SECTION_RELATIVE_PATHS.profile} replace />
          }
        />
        <Route
          path={ACCOUNT_SECTION_RELATIVE_PATHS.profile}
          element={<ProfileSection />}
        />
        <Route
          path={ACCOUNT_SECTION_RELATIVE_PATHS.notifications}
          element={<NotificationSection />}
        />
        <Route
          path={ACCOUNT_SECTION_RELATIVE_PATHS.security}
          element={<SecuritySection />}
        />
        <Route
          path="*"
          element={
            <Navigate to={ACCOUNT_SECTION_RELATIVE_PATHS.profile} replace />
          }
        />
      </Route>

      <Route path="manage/restaurants" element={<ListRestaurantsSection />} />

      <Route
        path="*"
        element={<Navigate to={ACCOUNT_SECTION_ROUTE_PATHS.profile} replace />}
      />
    </Route>
  )
}
