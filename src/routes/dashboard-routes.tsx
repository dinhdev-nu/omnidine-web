import { lazy } from "react"
import { Route } from "react-router-dom"

const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"))

const DASHBOARD_BY_ID_ROUTE_PATH = "/dashboard/:id"

export function DashboardRoute() {
  return <Route path={DASHBOARD_BY_ID_ROUTE_PATH} element={<DashboardPage />} />
}
