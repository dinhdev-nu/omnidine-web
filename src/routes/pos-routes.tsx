import { Route } from "react-router-dom"

import PosPage from "@/pages/pos/PosPage"
import { POS_ROUTE_PATH } from "@/routes/pos-route-config"

export function PosRoute() {
    return <Route path={`${POS_ROUTE_PATH}/*`} element={<PosPage />} />
}
