import Button from "../../../ui/Button"
import Icon from "@/components/AppIcon"
import type { PosCartItem } from "../main-pos.state"

export function MobileCartFab({
  cartItems,
  totalItems,
  onOpen,
}: {
  cartItems: PosCartItem[]
  totalItems: number
  onOpen: () => void
}) {
  return (
    <div className="absolute right-4 bottom-4 z-20 lg:hidden">
      <Button
        variant="default"
        size="lg"
        onClick={onOpen}
        className="shadow-modal hover-scale relative rounded-full"
      >
        <Icon name="ShoppingCart" size={24} className="mr-2" />
        <span>Giỏ hàng ({totalItems})</span>
        {cartItems.length > 0 && (
          <span className="bg-error text-error-foreground absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs">
            {totalItems}
          </span>
        )}
      </Button>
    </div>
  )
}
