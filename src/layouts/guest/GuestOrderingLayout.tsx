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
    <div className="pos min-h-dvh bg-background">
      {header}

      <main className="pt-[calc(4rem+env(safe-area-inset-top))] transition-[padding] duration-300 motion-reduce:transition-none">
        <div className="flex h-[calc(100dvh-4rem-env(safe-area-inset-top))] flex-col lg:flex-row">
          {menuPanel}
          {cartPanel}
        </div>

        {mobileCartButton}
      </main>
    </div>
  )
}
