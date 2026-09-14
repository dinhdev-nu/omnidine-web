import type { RefObject } from "react"

import Icon from "@/components/AppIcon"

import Button from "../../../ui/Button"
import type { PosCartItem } from "../main-pos.state"

export function MobileCartFab({
  cartItems,
  totalItems,
  onOpen,
  triggerRef,
}: {
  cartItems: PosCartItem[]
  totalItems: number
  onOpen: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
}) {
  return (
    <div className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 lg:hidden">
      <Button
        ref={triggerRef}
        variant="default"
        size="lg"
        onClick={onOpen}
        aria-label={`Mở giỏ hàng, ${totalItems} món`}
        className="relative rounded-full shadow-modal hover-scale"
      >
        <Icon name="ShoppingCart" size={24} aria-hidden="true" className="mr-2" />
        <span>Giỏ hàng ({totalItems})</span>
        {cartItems.length > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-error text-xs text-error-foreground"
          >
            {totalItems}
          </span>
        )}
      </Button>
    </div>
  )
}
