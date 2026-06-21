import type { OwnerRestaurantListItem } from "@/types/domain/restaurant"

export type RestaurantTier = "Công khai" | "Bản nháp"

export type RestaurantListState = {
  restaurants: OwnerRestaurantListItem[]
  isLoading: boolean
  error: string | null
  shareTarget: OwnerRestaurantListItem | null
  shareMode: "public" | "pos"
}

export type RestaurantListAction =
  | { type: "loadStarted" }
  | { type: "loadSucceeded"; restaurants: OwnerRestaurantListItem[] }
  | { type: "loadFailed"; message: string }
  | { type: "openShare"; restaurant: OwnerRestaurantListItem }
  | { type: "closeShare" }
  | { type: "setShareMode"; mode: "public" | "pos" }

export const initialRestaurantListState: RestaurantListState = {
  restaurants: [],
  isLoading: true,
  error: null,
  shareTarget: null,
  shareMode: "public",
}

export function restaurantListReducer(
  state: RestaurantListState,
  action: RestaurantListAction
): RestaurantListState {
  switch (action.type) {
    case "loadStarted":
      return { ...state, isLoading: true, error: null }
    case "loadSucceeded":
      return { ...state, restaurants: action.restaurants, isLoading: false }
    case "loadFailed":
      return {
        ...state,
        restaurants: [],
        error: action.message,
        isLoading: false,
      }
    case "openShare":
      return {
        ...state,
        shareTarget: action.restaurant,
        shareMode: "public",
      }
    case "closeShare":
      return { ...state, shareTarget: null }
    case "setShareMode":
      return { ...state, shareMode: action.mode }
    default:
      return state
  }
}