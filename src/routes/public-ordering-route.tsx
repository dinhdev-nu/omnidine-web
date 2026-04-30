import { Route } from "react-router-dom"

import PublicOrderingPage from "@/pages/public/ordering/PublicOrderingPage"

export const PUBLIC_ORDERING_ROUTE_PATH = "/public/ordering/*"

export function PublicOrderingRoute() {
    return (
        <>
            <Route path={PUBLIC_ORDERING_ROUTE_PATH} element={<PublicOrderingPage />} />
            <Route path="/public/restaurants/:slug/menu" element={<PublicOrderingPage />} />
            <Route path="/public/tables/:qrCode" element={<PublicOrderingPage />} />
        </>
    )
}
