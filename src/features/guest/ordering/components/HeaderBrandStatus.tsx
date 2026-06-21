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
    <div className="flex items-center space-x-2 sm:space-x-4">
      <button
        type="button"
        onClick={onNavigate}
        className="flex cursor-pointer items-center space-x-2 sm:space-x-3"
        aria-label={`Mở trang chi tiết ${displayStoreName}`}
      >
        <img
          src={restaurantLogo}
          alt={displayStoreName}
          className="h-8 w-8 flex-shrink-0 rounded-lg border border-border/30 object-cover sm:h-10 sm:w-10"
          onError={(event) => {
            event.currentTarget.onerror = null
            onRestaurantLogoError(originalRestaurantLogo)
          }}
        />

        <div>
          <h1 className="max-w-[100px] truncate text-sm font-semibold text-foreground sm:max-w-[200px] sm:text-base lg:max-w-none lg:text-lg">
            {displayStoreName}
          </h1>
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
    <div className="flex items-center space-x-2">
      <span className="hidden text-sm text-muted-foreground xl:inline">
        Trạng thái:
      </span>
      <Button
        variant={isOperational ? "success" : "secondary"}
        size="sm"
        iconName={isOperational ? "Play" : "Pause"}
        iconPosition="left"
        className="hover-scale"
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
