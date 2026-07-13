import Button from "@/features/pos/ui/Button"

export interface RestaurantBrandButtonProps {
  displayStoreName: string
  restaurantLogo: string
  originalRestaurantLogo: string
  onNavigate: () => void
  onRestaurantLogoError: (logo: string) => void
}

export function RestaurantBrandButton({
  displayStoreName,
  restaurantLogo,
  originalRestaurantLogo,
  onNavigate,
  onRestaurantLogoError,
}: RestaurantBrandButtonProps) {
  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-4">
      <button
        type="button"
        onClick={onNavigate}
        className="flex min-h-11 min-w-0 touch-manipulation items-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none sm:gap-3"
        aria-label={`Mở trang chi tiết ${displayStoreName}`}
      >
        <img
          src={restaurantLogo}
          alt={displayStoreName}
          width={40}
          height={40}
          className="size-8 shrink-0 rounded-lg border border-border/30 object-cover sm:size-10"
          onError={(event) => {
            event.currentTarget.onerror = null
            onRestaurantLogoError(originalRestaurantLogo)
          }}
        />

        <div className="min-w-0">
          <span className="block max-w-[100px] truncate text-sm font-semibold text-foreground sm:max-w-[200px] sm:text-base lg:max-w-none lg:text-lg">
            {displayStoreName}
          </span>
        </div>
      </button>
    </div>
  )
}

export function OperationalStatusButton({
  isOperational,
}: {
  isOperational: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-muted-foreground xl:inline">
        Trạng thái:
      </span>
      <Button
        variant={isOperational ? "success" : "secondary"}
        size="sm"
        iconName={isOperational ? "Play" : "Pause"}
        iconPosition="left"
        className="hover-scale min-h-11"
        disabled
      >
        <span className="hidden sm:inline">
          {isOperational ? "Mở cửa" : "Đóng cửa"}
        </span>
        <span className="sm:hidden">{isOperational ? "Mở" : "Đóng"}</span>
      </Button>
    </div>
  )
}
