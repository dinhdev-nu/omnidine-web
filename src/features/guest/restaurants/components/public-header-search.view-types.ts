import type { RefObject } from "react"
import type { PublicRestaurantSearchItem } from "@/types/domain/restaurant"
import type { SearchFilters } from "./public-header-search-types"

export type PublicHeaderSearchProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export type SearchContentProps = {
  searchQuery: string
  searchFilters: SearchFilters
  isSearchLoading: boolean
  searchError: string | null
  searchResults: PublicRestaurantSearchItem[]
  isLocating: boolean
  onSelectRestaurant: (restaurant: PublicRestaurantSearchItem) => void
  onUseCurrentLocation: () => void
  onClearLocation: () => void
  onFilterChange: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => void
  onSelectOpenChange: (open: boolean) => void
}

export type DesktopSearchProps = SearchContentProps & {
  isOpen: boolean
  searchAreaRef: RefObject<HTMLDivElement | null>
  searchInputRef: RefObject<HTMLInputElement | null>
  onOpen: () => void
  onQueryChange: (query: string) => void
}

export type MobileSearchProps = SearchContentProps & {
  isOpen: boolean
  searchAreaRef: RefObject<HTMLDivElement | null>
  searchInputRef: RefObject<HTMLInputElement | null>
  onOpen: () => void
  onQueryChange: (query: string) => void
}
