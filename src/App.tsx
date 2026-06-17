import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { AUTH_ROUTE_PATHS } from "@/features/auth/constants"
import NotFoundPage from "@/pages/not-found/NotFoundPage"
import OAuthCallbackPage from "@/pages/oauth-callback/OauthCallback"
import { NewRestaurantRoute } from "@/routes/new-restaurant-route"
import { PublicOrderingRoute } from "@/routes/public-ordering-route"
import { POS_BASE_PATH, PosRoute } from "@/routes/pos-route"
import { PublicRestaurantsRoute } from "@/routes/public-restaurants-route"
import { DashboardRoute } from "@/routes/dashboard-route"
import { Toaster } from "@/components/ui/sonner"
import RejectToPreviousPage from "@/components/navigation/RejectToPreviousPage"
import { HomeRoutes } from "@/routes/home-routes"
import { SETTINGS_DEFAULT_PATH } from "@/routes/setting-route-config"
import { SettingRoutes } from "@/routes/setting-routes"
import { AuthRoutes } from "@/routes/auth-routes"
import { AUTH_SESSION_EXPIRED_EVENT } from "@/services/client"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"
import PublicRestaurantDetailsPage from "./pages/public/restaurants/PublicRestaurantDetailsPage"

function AuthSessionExpiredHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const clearUser = useUserStore((state) => state.clear)

  useEffect(() => {
    const handleSessionExpired = () => {
      clearAuth()
      clearUser()

      if (!location.pathname.startsWith("/auth")) {
        navigate(AUTH_ROUTE_PATHS.login, { replace: true })
      }
    }

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [clearAuth, clearUser, location.pathname, navigate])

  return null
}

export function App() {
  return (
    <BrowserRouter>
      <AuthSessionExpiredHandler />
      <Routes>
        {HomeRoutes()}
        {AuthRoutes()}
        {SettingRoutes()}
        <Route path="/profile/*" element={<Navigate to={SETTINGS_DEFAULT_PATH} replace />} />
        {DashboardRoute()}
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path={POS_BASE_PATH} element={<RejectToPreviousPage />} />
        {PosRoute()}
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        {NewRestaurantRoute()}
        <Route path="/restaurants" element={<Navigate to="/settings/manage/restaurants" replace />} />
        <Route path="/public/restaurants/:slug" element={<PublicRestaurantDetailsPage />} />
        {PublicRestaurantsRoute()}
        {PublicOrderingRoute()}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App
