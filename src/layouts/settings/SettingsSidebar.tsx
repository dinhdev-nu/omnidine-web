import { ChevronRight, CirclePlus, Store, type LucideIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"

interface SidebarNavItem {
    id: string
    label: string
    icon: LucideIcon
    href: string
}

const MANAGEMENT_NAV_ITEMS: SidebarNavItem[] = [
    { id: "restaurants", label: "Nhà hàng", icon: Store, href: "/settings/manage/restaurants" },
    { id: "add-restaurant", label: "Thêm nhà hàng", icon: CirclePlus, href: "/restaurants/new" },
]

interface SettingsSidebarProps {
    items: SidebarNavItem[]
}

function SettingsSidebarItem({ item }: { item: SidebarNavItem }) {
    const Icon = item.icon

    return (
        <NavLink
            key={item.id}
            to={item.href}
            className="group relative block shrink-0 rounded-xl touch-manipulation focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
            {({ isActive }) => (
                <div
                    className={cn(
                        "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition-colors motion-reduce:transition-none sm:min-h-11 sm:flex-row sm:justify-start sm:gap-2.5 sm:px-4 sm:text-sm",
                        isActive
                            ? "bg-primary/10 text-foreground"
                            : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                    )}
                >
                    <Icon
                        className={cn(
                            "h-4 w-4 shrink-0 transition-colors motion-reduce:transition-none",
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}
                    />
                    <span className="min-w-0 text-center leading-tight sm:flex-1 sm:text-left sm:whitespace-nowrap">{item.label}</span>
                    <ChevronRight
                        className={cn(
                            "ml-auto hidden h-4 w-4 transition-[opacity,transform] motion-reduce:transition-none lg:block",
                            isActive
                                ? "translate-x-0 text-primary/80"
                                : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        )}
                    />
                </div>
            )}
        </NavLink>
    )
}

export function SettingsSidebar({ items }: SettingsSidebarProps) {
    return (
        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            <nav aria-label="Điều hướng cài đặt" className="overflow-hidden rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
                <div className="flex flex-col gap-3 lg:gap-4">
                    <p className="px-3 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground lg:border-b lg:border-border/80 lg:pb-2">
                        Tài khoản
                    </p>

                    <div className="grid grid-cols-3 gap-1 sm:flex sm:overflow-x-auto sm:pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                        {items.map((item) => (
                            <SettingsSidebarItem key={item.id} item={item} />
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 border-t border-border/80 pt-3 lg:border-0 lg:pt-0">
                        <p className="px-3 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground lg:border-b lg:border-border/80 lg:pb-2">
                            Quản lý
                        </p>

                        <div className="grid grid-cols-2 gap-1 sm:flex sm:overflow-x-auto sm:pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                            {MANAGEMENT_NAV_ITEMS.map((item) => (
                                <SettingsSidebarItem key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
