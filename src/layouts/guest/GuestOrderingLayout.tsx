import type { ReactNode } from "react"

interface GuestOrderingLayoutProps {
  header: ReactNode
  menuPanel: ReactNode
  cartPanel: ReactNode
  mobileCartButton: ReactNode
}

export function GuestOrderingLayout({
  header,
  menuPanel,
  cartPanel,
  mobileCartButton,
}: GuestOrderingLayoutProps) {
  return (
    <div className="pos min-h-screen bg-background">
      {header}

      <main className="ease-smooth pt-16 transition-all duration-300 md:pt-16">
        <div className="flex h-[calc(100vh-4rem)] flex-col md:h-[calc(100vh-4rem)] lg:flex-row">
          {menuPanel}
          {cartPanel}
        </div>

        {mobileCartButton}
      </main>
    </div>
  )
}
