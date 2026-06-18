import { useEffect, useMemo, useState, type ReactNode } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import "@/layouts/dashboard/analysis-reporting.css"
import { Header } from "@/features/dashboard/components/Header"
import { Sidebar } from "@/features/dashboard/components/Sidebar"
import { CustomersSection } from "@/features/dashboard/sections/CustomersSection"
import { DealsSection } from "@/features/dashboard/sections/DealsSection"
import { ForecastingSection } from "@/features/dashboard/sections/ForecastingSection"
import { OverviewSection } from "@/features/dashboard/sections/OverviewSection"
import { PipelineSection } from "@/features/dashboard/sections/PipelineSection"
import { ReportsSection } from "@/features/dashboard/sections/ReportsSection"
import { SettingsSection } from "@/features/dashboard/sections/SettingsSection"
import { TeamSection } from "@/features/dashboard/sections/TeamSection"
import { DashboardLayout } from "../../layouts/dashboard/DashboardLayout"
import { useFetch } from "@/hooks/useFetch"
import { getRestaurantDetail } from "@/services/restaurants"
import { toAppError } from "@/services/core/error"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"

type DashboardRestaurantState = {
  restaurant?: {
    _id: string
    name: string
    logo_url?: string | null
  }
}

type SectionId =
  | "overview"
  | "pipeline"
  | "deals"
  | "customers"
  | "team"
  | "forecasting"
  | "reports"
  | "settings"

type ThemeMode = "light" | "dark"

const sectionMap: Record<SectionId, ReactNode> = {
  overview: <OverviewSection />,
  pipeline: <PipelineSection />,
  deals: <DealsSection />,
  customers: <CustomersSection />,
  team: <TeamSection />,
  forecasting: <ForecastingSection />,
  reports: <ReportsSection />,
  settings: <SettingsSection />,
}

export default function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id: restaurantId } = useParams<{ id: string }>()
  const restaurantFetchArgs = useMemo<[string]>(
    () => [restaurantId ?? ""],
    [restaurantId]
  )
  const stateRestaurant =
    (location.state as DashboardRestaurantState | undefined)?.restaurant ?? null
  const accessToken = useAuthStore((state) => state.accessToken)
  const fetchProfile = useUserStore((state) => state.fetchProfile)
  const [activeSection, setActiveSection] = useState<SectionId>("settings")
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("dashboard-theme")
    return stored === "dark" || stored === "light" ? stored : "light"
  })

  useEffect(() => {
    localStorage.setItem("dashboard-theme", theme)
  }, [theme])

  useEffect(() => {
    if (!accessToken) return

    void fetchProfile()
  }, [accessToken, fetchProfile])

  const {
    data: restaurantDetail,
    error: restaurantError,
    isLoading: isRestaurantLoading,
  } = useFetch(getRestaurantDetail, restaurantFetchArgs, {
    enabled: Boolean(restaurantId),
  })

  useEffect(() => {
    if (!restaurantError) return

    const appError = toAppError(
      restaurantError,
      "Không thể tải thông tin nhà hàng"
    )
    const isForbidden =
      appError.status === 403 || appError.errorCode === "ForbiddenException"

    if (isForbidden) {
      navigate("/settings/manage/restaurants", { replace: true })
    }
  }, [navigate, restaurantError])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const sidebarRestaurant =
    stateRestaurant ??
    (restaurantDetail
      ? {
          _id: restaurantDetail._id,
          name: restaurantDetail.name,
          logo_url: restaurantDetail.logo_url,
        }
      : null)

  const shouldShowLoadingState =
    Boolean(restaurantId) && !stateRestaurant && isRestaurantLoading

  return (
    <DashboardLayout
      theme={theme}
      sidebar={
        <Sidebar
          restaurant={sidebarRestaurant}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      }
      header={
        <Header
          activeSection={activeSection}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
    >
      {shouldShowLoadingState ? (
        <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted-foreground">
          Đang tải thông tin nhà hàng...
        </div>
      ) : null}
      {!shouldShowLoadingState ? (
        <div
          key={activeSection}
          className="animate-in duration-500 fade-in slide-in-from-bottom-4"
        >
          {activeSection === "settings" ? (
            <SettingsSection restaurantDetail={restaurantDetail} />
          ) : (
            sectionMap[activeSection]
          )}
        </div>
      ) : null}
    </DashboardLayout>
  )
}
