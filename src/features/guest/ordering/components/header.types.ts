import type { OrderingNotification, OrderingUser } from "../types"

export interface HeaderProps {
  isOperational?: boolean
  notifications?: OrderingNotification[]
  user?: OrderingUser | null
  restaurantName?: string | null
  restaurantLogo?: string | null
  restaurantSlug?: string | null
}
