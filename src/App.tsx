import { lazy, Suspense, useEffect } from "react"
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom"
import { AUTH_ROUTE_PATHS } from "@/features/auth/constants"
import { RestaurantOnboardingRoute } from "@/routes/restaurant-onboarding-routes"
import { GuestOrderingRoute } from "@/routes/guest-ordering-routes"
import { POS_BASE_PATH } from "@/routes/pos-route-config"
import { PosRoute } from "@/routes/pos-routes"
import { GuestRestaurantsRoute } from "@/routes/guest-restaurants-routes"
import { DashboardRoute } from "@/routes/dashboard-routes"
import { Toaster } from "@/components/ui/sonner"
import { Spinner } from "@/components/ui/spinner"
import RejectToPreviousPage from "@/components/navigation/RejectToPreviousPage"
import { HomeRoutes } from "@/routes/home-routes"
import { SETTINGS_DEFAULT_PATH } from "@/routes/settings-route-config"
import { SettingRoutes } from "@/routes/settings-routes"
import { AuthRoutes } from "@/routes/auth-routes"
import { AUTH_SESSION_EXPIRED_EVENT } from "@/services/core/client"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"

const NotFoundPage = lazy(() => import("@/pages/not-found/NotFoundPage"))
const OAuthCallbackPage = lazy(
  () => import("@/pages/oauth-callback/OauthCallback")
)
const GuestRestaurantDetailsPage = lazy(
  () => import("@/pages/guest/restaurants/GuestRestaurantDetailsPage")
)

function RouteLoadingFallback() {
  return (
    <output
      aria-label="Đang tải trang"
      className="flex min-h-screen items-center justify-center bg-background text-muted-foreground"
    >
      <Spinner className="size-5" />
    </output>
  )
}

function AuthSessionExpiredHandler() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const clearUser = useUserStore((state) => state.clear)

  useEffect(() => {
    const handleSessionExpired = () => {
      clearAuth()
      clearUser()

      if (!pathname.startsWith("/auth")) {
        navigate(AUTH_ROUTE_PATHS.login, { replace: true })
      }
    }

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () =>
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        handleSessionExpired
      )
  }, [clearAuth, clearUser, navigate, pathname])

  return null
}

export function App() {
  return (
    <BrowserRouter>
      <AuthSessionExpiredHandler />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          {HomeRoutes()}
          {AuthRoutes()}
          {SettingRoutes()}
          <Route
            path="/profile/*"
            element={<Navigate to={SETTINGS_DEFAULT_PATH} replace />}
          />
          {DashboardRoute()}
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path={POS_BASE_PATH} element={<RejectToPreviousPage />} />
          {PosRoute()}
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          {RestaurantOnboardingRoute()}
          <Route
            path="/restaurants"
            element={<Navigate to="/settings/manage/restaurants" replace />}
          />
          <Route
            path="/public/restaurants/:slug"
            element={<GuestRestaurantDetailsPage />}
          />
          {GuestRestaurantsRoute()}
          {GuestOrderingRoute()}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App
