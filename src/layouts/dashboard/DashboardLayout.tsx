import type { PropsWithChildren, ReactNode } from "react"

interface DashboardLayoutProps extends PropsWithChildren {
  theme: "light" | "dark"
  sidebar: ReactNode
  header: ReactNode
  sidebarCollapsed: boolean
}

export function DashboardLayout({
  theme,
  sidebar,
  header,
  sidebarCollapsed,
  children,
}: DashboardLayoutProps) {
  return (
    <div
      className={`analysis-reporting ${theme} h-dvh min-h-screen overflow-hidden bg-background`}
    >
      <a
        href="#dashboard-main-content"
        className="fixed -top-16 left-4 z-[70] flex min-h-11 touch-manipulation items-center rounded-lg bg-accent px-4 font-medium text-accent-foreground transition-[top] focus-visible:top-4 motion-reduce:transition-none"
      >
        Chuyển đến nội dung chính
      </a>
      {sidebar}
      <div
        className={`dashboard-main-shell flex h-dvh min-w-0 flex-col ${
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        }`}
      >
        {header}
        <main
          id="dashboard-main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 overflow-auto p-4 [padding-right:max(1rem,env(safe-area-inset-right))] [padding-bottom:max(1rem,env(safe-area-inset-bottom))] [padding-left:max(1rem,env(safe-area-inset-left))] sm:p-6 sm:[padding-right:max(1.5rem,env(safe-area-inset-right))] sm:[padding-bottom:max(1.5rem,env(safe-area-inset-bottom))] sm:[padding-left:max(1.5rem,env(safe-area-inset-left))]"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
