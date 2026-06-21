import { GuestRestaurantsView } from "@/features/guest/restaurants/components/GuestRestaurantsView"
import { useGuestRestaurantsPageController } from "@/features/guest/restaurants/hooks/useGuestRestaurantsPageController"

export default function GuestRestaurantsPage() {
  const controller = useGuestRestaurantsPageController()

  return <GuestRestaurantsView controller={controller} />
}
