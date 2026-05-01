import { Route } from "react-router-dom"

import PublicMenuPage from "@/pages/public/ordering/PublicMenuPage"
import TableOrderingPage from "@/pages/public/ordering/TableOrderingPage"

export function PublicOrderingRoute() {
    return (
        <>
            <Route path="/public/restaurants/:slug/menu" element={<PublicMenuPage />} />
            <Route path="/public/tables/:qrCode" element={<TableOrderingPage />} />
        </>
    )
}
