import { useEffect, useMemo, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"

import { ACCOUNT_NAV_ITEMS, findActiveAccountNavItem } from "@/features/settings/account"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"

import { SettingsHeader } from "./SettingsHeader"
import { SettingsSidebar } from "./SettingsSidebar"

export function SettingsLayout() {
    const [isDark, setIsDark] = useState(false)
    const { pathname } = useLocation()
    const accessToken = useAuthStore((state) => state.accessToken)
    const fetchProfile = useUserStore((state) => state.fetchProfile)

    const activeItem = useMemo(() => findActiveAccountNavItem(pathname), [pathname])
    const isRestaurantsSection = pathname.startsWith("/settings/manage/restaurants")
    const sectionGroup = isRestaurantsSection ? "Quản lý" : "Tài khoản"
    const sectionTitle = isRestaurantsSection ? "Nhà hàng" : activeItem?.label ?? "Cài đặt"
    const sectionDescription = isRestaurantsSection
        ? "Quản lý danh sách nhà hàng và trạng thái vận hành."
        : "Quản lý hồ sơ tài khoản, thông báo và thiết lập bảo mật."

    useEffect(() => {
        const html = document.documentElement

        if (isDark) html.classList.add("dark")
        else html.classList.remove("dark")

        return () => html.classList.remove("dark")
    }, [isDark])

    useEffect(() => {
        if (!accessToken) return

        void fetchProfile()
    }, [accessToken, fetchProfile])

    return (
        <div className={`settings-page${isDark ? " dark" : ""} flex min-h-dvh flex-col bg-background pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]`}>
            <a
                href="#settings-main"
                className="fixed -top-16 left-4 z-50 flex min-h-11 touch-manipulation items-center rounded-md bg-background px-4 text-sm font-medium text-foreground shadow-lg transition-[top] motion-reduce:transition-none focus:top-4 focus:outline-none focus:ring-3 focus:ring-ring/50"
            >
                Bỏ qua đến nội dung chính
            </a>
            <SettingsHeader isDark={isDark} onToggle={() => setIsDark((value) => !value)} />

            <div className="mx-auto flex-1 w-full max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <aside className="order-first lg:order-none">
                        <SettingsSidebar items={ACCOUNT_NAV_ITEMS} />
                    </aside>

                    <main id="settings-main" tabIndex={-1} className="mx-auto w-full max-w-5xl outline-none lg:max-w-none">
                        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-4 sm:px-6">
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    {`Cài đặt / ${sectionGroup}`}
                                </p>
                                <h1 className="text-xl font-semibold text-foreground">
                                    {sectionTitle}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {sectionDescription}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-card/40 p-3 min-[375px]:p-4 sm:p-6">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
