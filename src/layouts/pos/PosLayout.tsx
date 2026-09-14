import {
  memo,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Outlet } from "react-router-dom"

import { useRequiredPosData } from "@/features/pos/contexts/usePosContext"

import PosHeader, { type HeaderProps } from "./PosHeader"
import PosSidebar, { type SidebarProps } from "./PosSidebar"
import "./pos.css"

type LayoutHeaderProps = Pick<
  HeaderProps,
  | "notifications"
  | "isOperational"
  | "onToggleOperational"
  | "getRelativeTime"
>

type LayoutSidebarProps = Omit<
  SidebarProps,
  | "isCollapsed"
  | "onToggleCollapse"
  | "isMobileOpen"
  | "onCloseMobile"
  | "mobileMenuButtonRef"
  | "userRole"
>

interface LayoutProps extends LayoutHeaderProps, LayoutSidebarProps {
  children?: ReactNode
}

const PosLayout = memo<LayoutProps>(
  ({
    children,
    notifications,
    isOperational,
    onToggleOperational,
    getRelativeTime,
    activeSection = "main-pos",
    onSectionChange,
  }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
    const posData = useRequiredPosData()

    const restaurant = posData.restaurant
    const storeName = posData.restaurant.name ?? "POS Manager"
    const userRole: SidebarProps["userRole"] = posData.business_role

    const handleToggleSidebar = useCallback(() => {
      setSidebarCollapsed((previous) => !previous)
    }, [])

    const handleOpenMobileSidebar = useCallback(() => {
      setMobileSidebarOpen(true)
    }, [])

    const handleCloseMobileSidebar = useCallback(() => {
      setMobileSidebarOpen(false)
    }, [])

    return (
      <div className="pos flex h-dvh min-h-0 w-full flex-col bg-background pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]">
        <a
          href="#pos-main-content"
          className="fixed top-[calc(0.5rem+env(safe-area-inset-top))] left-[calc(0.5rem+env(safe-area-inset-left))] z-[1400] -translate-y-[calc(100%+1rem)] rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-transform focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
        >
          Bỏ qua điều hướng POS
        </a>

        <PosHeader
          storeName={storeName}
          restaurant={restaurant}
          notifications={notifications}
          isOperational={isOperational}
          onToggleOperational={onToggleOperational}
          onToggleSidebar={handleOpenMobileSidebar}
          menuButtonRef={mobileMenuButtonRef}
          getRelativeTime={getRelativeTime}
        />

        <div className="flex min-h-0 min-w-0 flex-1">
          <PosSidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
            isMobileOpen={mobileSidebarOpen}
            onCloseMobile={handleCloseMobileSidebar}
            mobileMenuButtonRef={mobileMenuButtonRef}
            userRole={userRole}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />

          <main
            id="pos-main-content"
            tabIndex={-1}
            className="pos min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:outline-none"
          >
            <Outlet />
            {children}
          </main>
        </div>
      </div>
    )
  }
)

PosLayout.displayName = "PosLayout"

export default PosLayout
