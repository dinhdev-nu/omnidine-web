import { lazy, Suspense, useEffect, useState, type ReactNode } from "react"
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
const AUTHENTICATED_ROUTE_PREFIXES = [
  "/dashboard",
  "/settings",
  "/profile",
  "/restaurants",
  POS_BASE_PATH,
] as const

function requiresAuthenticatedSession(pathname: string): boolean {
  return AUTHENTICATED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

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

function SessionUnavailableFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <main
      role="alert"
      className="flex min-h-screen items-center justify-center bg-background px-4 text-center"
    >
      <div className="max-w-md space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-foreground">
          Không thể xác minh phiên đăng nhập
        </h1>
        <p className="text-sm text-muted-foreground">
          Máy chủ đang tạm thời không phản hồi. Vui lòng thử lại để tiếp tục.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Thử lại
        </button>
      </div>
    </main>
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

function AuthSessionBootstrap({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken)
  const sessionStatus = useAuthStore((state) => state.sessionStatus)
  const bootstrapSession = useAuthStore((state) => state.bootstrapSession)
  const clearUser = useUserStore((state) => state.clear)
  const fetchProfile = useUserStore((state) => state.fetchProfile)
  const [bootstrapAttempt, setBootstrapAttempt] = useState(0)

  useEffect(() => {
    let isActive = true

    void bootstrapSession().then((status) => {
      if (!isActive) return

      if (status === "anonymous") clearUser()
    })

    return () => {
      isActive = false
    }
  }, [bootstrapAttempt, bootstrapSession, clearUser])

  useEffect(() => {
    if (!accessToken) return

    void fetchProfile().catch(() => {
      // The user store exposes the profile request error to interested UI.
    })
  }, [accessToken, fetchProfile])

  const requiresSession = requiresAuthenticatedSession(pathname)

  if (sessionStatus === "initializing" && requiresSession) {
    return <RouteLoadingFallback />
  }

  if (sessionStatus === "unavailable" && requiresSession) {
    return (
      <SessionUnavailableFallback
        onRetry={() => setBootstrapAttempt((attempt) => attempt + 1)}
      />
    )
  }

  return children
}

export function App() {
  return (
    <BrowserRouter>
      <AuthSessionExpiredHandler />
      <AuthSessionBootstrap>
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
      </AuthSessionBootstrap>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App
