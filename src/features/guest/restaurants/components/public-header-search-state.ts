import type { PublicRestaurantSearchItem } from "@/types/domain/restaurant"

import type { SearchFilters } from "./PublicHeaderSearchContent.tsx"

export type { SearchFilters }

const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  city: "",
  cuisine_type: "",
  price_range: [],
  accepts_online: null,
  radius_km: "5",
  sort: "name",
  lat: null,
  lng: null,
}

export type PublicHeaderSearchState = {
  searchQuery: string
  searchResults: PublicRestaurantSearchItem[]
  isSearchLoading: boolean
  searchError: string | null
  isLocating: boolean
  searchFilters: SearchFilters
}

export type PublicHeaderSearchAction =
  | { type: "setQuery"; query: string }
  | { type: "closeReset" }
  | { type: "searchStarted" }
  | { type: "searchSucceeded"; results: PublicRestaurantSearchItem[] }
  | { type: "searchFailed"; message: string }
  | { type: "restaurantSelected" }
  | { type: "updateFilters"; filters: Partial<SearchFilters> }
  | { type: "locationStarted" }
  | { type: "locationSucceeded"; lat: number; lng: number }
  | { type: "locationFailed"; message: string }
  | { type: "clearLocation" }

export const publicHeaderSearchInitialState: PublicHeaderSearchState = {
  searchQuery: "",
  searchResults: [],
  isSearchLoading: false,
  searchError: null,
  isLocating: false,
  searchFilters: DEFAULT_SEARCH_FILTERS,
}

export function publicHeaderSearchReducer(
  state: PublicHeaderSearchState,
  action: PublicHeaderSearchAction
): PublicHeaderSearchState {
  switch (action.type) {
    case "setQuery":
      return { ...state, searchQuery: action.query }
    case "closeReset":
      return {
        ...state,
        searchResults: [],
        searchError: null,
        isSearchLoading: false,
      }
    case "searchStarted":
      return { ...state, isSearchLoading: true, searchError: null }
    case "searchSucceeded":
      return {
        ...state,
        searchResults: action.results,
        isSearchLoading: false,
      }
    case "searchFailed":
      return {
        ...state,
        searchResults: [],
        searchError: action.message,
        isSearchLoading: false,
      }
    case "restaurantSelected":
      return { ...state, searchQuery: "", searchResults: [] }
    case "updateFilters":
      return {
        ...state,
        searchFilters: { ...state.searchFilters, ...action.filters },
      }
    case "locationStarted":
      return { ...state, isLocating: true }
    case "locationSucceeded":
      return {
        ...state,
        isLocating: false,
        searchFilters: {
          ...state.searchFilters,
          lat: action.lat,
          lng: action.lng,
          sort: "distance",
        },
      }
    case "locationFailed":
      return {
        ...state,
        isLocating: false,
        searchError: action.message,
      }
    case "clearLocation":
      return {
        ...state,
        searchFilters: {
          ...state.searchFilters,
          lat: null,
          lng: null,
        },
      }
    default:
      return state
  }
}
