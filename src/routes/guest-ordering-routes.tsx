import { Route } from "react-router-dom"

import GuestMenuPage from "@/pages/guest/ordering/GuestMenuPage"
import GuestTableOrderingPage from "@/pages/guest/ordering/GuestTableOrderingPage"

export function GuestOrderingRoute() {
    return (
        <>
            <Route path="/public/restaurants/:slug/menu" element={<GuestMenuPage />} />
            <Route path="/public/tables/:qrCode" element={<GuestTableOrderingPage />} />
        </>
    )
}
