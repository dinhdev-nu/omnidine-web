import { lazy } from "react"
import { Route } from "react-router-dom"

import { POS_ROUTE_PATH } from "@/routes/pos-route-config"

const PosPage = lazy(() => import("@/pages/pos/PosPage"))

export function PosRoute() {
  return <Route path={`${POS_ROUTE_PATH}/*`} element={<PosPage />} />
}
