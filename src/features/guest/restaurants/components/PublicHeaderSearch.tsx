import { Search, X } from "lucide-react"
import {
  useEffect,
  useEffectEvent,
  useReducer,
  useRef,
  type RefObject,
} from "react"
import { useNavigate } from "react-router-dom"

import { searchPublicRestaurants } from "@/services/restaurants"
import { toAppError } from "@/services/core/error"
import type { PublicRestaurantSearchItem } from "@/types/domain/restaurant"
import PublicHeaderSearchContent from "./PublicHeaderSearchContent.tsx"
import {
  publicHeaderSearchInitialState,
  publicHeaderSearchReducer,
  type SearchFilters,
} from "./public-header-search-state"

const PUBLIC_RESTAURANT_PAGE = 1
const PUBLIC_RESTAURANT_LIMIT = 5
const SEARCH_DEBOUNCE_MS = 250

type PublicHeaderSearchProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

type SearchContentProps = {
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

type DesktopSearchProps = SearchContentProps & {
  isOpen: boolean
  searchAreaRef: RefObject<HTMLDivElement | null>
  searchInputRef: RefObject<HTMLInputElement | null>
  onOpen: () => void
  onQueryChange: (query: string) => void
}

function DesktopPublicHeaderSearch({
  isOpen,
  searchAreaRef,
  searchInputRef,
  searchQuery,
  searchFilters,
  isSearchLoading,
  searchError,
  searchResults,
  isLocating,
  onOpen,
  onQueryChange,
  onSelectRestaurant,
  onUseCurrentLocation,
  onClearLocation,
  onFilterChange,
  onSelectOpenChange,
}: DesktopSearchProps) {
  return (
    <div
      ref={searchAreaRef}
      className="relative mx-8 hidden max-w-2xl flex-1 lg:block"
    >
      <div className="relative w-full">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={searchInputRef}
          aria-label="TÃ¬m nhÃ  hÃ ng"
          name="feed-search"
          type="text"
          value={searchQuery}
          onChange={(event) => {
            onQueryChange(event.target.value)
            onOpen()
          }}
          onFocus={onOpen}
          placeholder="Tìm kiếm nhà hàng, món ăn..."
          className="w-full rounded-full border border-border bg-secondary py-2.5 pr-10 pl-12 text-sm text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="Xóa tìm kiếm"
            onClick={() => {
              onQueryChange("")
              onOpen()
              searchInputRef.current?.focus()
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          <PublicHeaderSearchContent
            searchQuery={searchQuery}
            searchFilters={searchFilters}
            isSearchLoading={isSearchLoading}
            searchError={searchError}
            searchResults={searchResults}
            isLocating={isLocating}
            onSelectRestaurant={onSelectRestaurant}
            onUseCurrentLocation={onUseCurrentLocation}
            onClearLocation={onClearLocation}
            onFilterChange={onFilterChange}
            onSelectOpenChange={onSelectOpenChange}
          />
        </div>
      )}
    </div>
  )
}

type MobileSearchProps = SearchContentProps & {
  isOpen: boolean
  searchAreaRef: RefObject<HTMLDivElement | null>
  searchInputRef: RefObject<HTMLInputElement | null>
  onOpen: () => void
  onQueryChange: (query: string) => void
}

function MobilePublicHeaderSearch({
  isOpen,
  searchAreaRef,
  searchInputRef,
  searchQuery,
  searchFilters,
  isSearchLoading,
  searchError,
  searchResults,
  isLocating,
  onOpen,
  onQueryChange,
  onSelectRestaurant,
  onUseCurrentLocation,
  onClearLocation,
  onFilterChange,
  onSelectOpenChange,
}: MobileSearchProps) {
  return (
    <div className="lg:hidden">
      {isOpen && (
        <div ref={searchAreaRef} className="relative mt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              aria-label="TÃ¬m nhÃ  hÃ ng"
              type="text"
              value={searchQuery}
              onChange={(event) => {
                onQueryChange(event.target.value)
                onOpen()
              }}
              placeholder="Tìm kiếm nhà hàng, món ăn..."
              className="w-full rounded-2xl border border-border bg-secondary py-3 pr-10 pl-12 text-sm text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Xóa tìm kiếm"
                onClick={() => onQueryChange("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
            <PublicHeaderSearchContent
              searchQuery={searchQuery}
              searchFilters={searchFilters}
              isSearchLoading={isSearchLoading}
              searchError={searchError}
              searchResults={searchResults}
              isLocating={isLocating}
              onSelectRestaurant={onSelectRestaurant}
              onUseCurrentLocation={onUseCurrentLocation}
              onClearLocation={onClearLocation}
              onFilterChange={onFilterChange}
              onSelectOpenChange={onSelectOpenChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function PublicHeaderSearch({
  isOpen,
  onOpenChange,
}: PublicHeaderSearchProps) {
  const navigate = useNavigate()
  const desktopSearchInputRef = useRef<HTMLInputElement | null>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null)
  const desktopSearchAreaRef = useRef<HTMLDivElement | null>(null)
  const mobileSearchAreaRef = useRef<HTMLDivElement | null>(null)
  const isSelectOpenRef = useRef(false)
  const searchTimeoutRef = useRef<number | null>(null)
  const locationRequestIdRef = useRef(0)
  const [searchState, dispatchSearch] = useReducer(
    publicHeaderSearchReducer,
    publicHeaderSearchInitialState
  )
  const {
    searchQuery,
    searchResults,
    isSearchLoading,
    searchError,
    isLocating,
    searchFilters,
  } = searchState
  const closeSearch = useEffectEvent(() => {
    dispatchSearch({ type: "closeReset" })
    onOpenChange(false)
  })

  useEffect(() => {
    if (!isOpen) return

    const activeInput =
      window.innerWidth >= 1024
        ? desktopSearchInputRef.current
        : mobileSearchInputRef.current
    activeInput?.focus()
  }, [isOpen])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!isOpen) return

      const target = event.target
      if (!(target instanceof Element)) return

      const insideDesktop =
        desktopSearchAreaRef.current?.contains(target) ?? false
      const insideMobile =
        mobileSearchAreaRef.current?.contains(target) ?? false
      const insideSelectOverlay = Boolean(
        target.closest("[data-slot='select-content']") ||
        target.closest("[data-slot='select-item']") ||
        target.closest("[data-slot='select-trigger']")
      )

      if (
        insideDesktop ||
        insideMobile ||
        insideSelectOverlay ||
        isSelectOpenRef.current
      )
        return

      closeSearch()
    }

    document.addEventListener("pointerdown", handlePointerDown, true)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      if (searchTimeoutRef.current !== null) {
        window.clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = null
      }
      return
    }

    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
    }

    searchTimeoutRef.current = window.setTimeout(async () => {
      const trimmedQuery = searchQuery.trim()
      const priceRangeValues = searchFilters.price_range.length
        ? (searchFilters.price_range.map(Number) as Array<1 | 2 | 3 | 4>)
        : undefined
      const radiusValue = searchFilters.radius_km
        ? Number(searchFilters.radius_km)
        : undefined
      const acceptsOnlineValue =
        searchFilters.accepts_online === null
          ? undefined
          : searchFilters.accepts_online

      try {
        dispatchSearch({ type: "searchStarted" })

        const response = await searchPublicRestaurants({
          page: PUBLIC_RESTAURANT_PAGE,
          limit: PUBLIC_RESTAURANT_LIMIT,
          city: searchFilters.city.trim() || undefined,
          cuisine_type: searchFilters.cuisine_type.trim() || undefined,
          price_range: priceRangeValues,
          accepts_online: acceptsOnlineValue,
          lat: searchFilters.lat ?? undefined,
          lng: searchFilters.lng ?? undefined,
          radius_km:
            searchFilters.lat !== null && searchFilters.lng !== null
              ? radiusValue
              : undefined,
          q: trimmedQuery || undefined,
          sort:
            searchFilters.lat !== null && searchFilters.lng !== null
              ? "distance"
              : searchFilters.sort,
        })

        console.log("Search results:", response)

        dispatchSearch({ type: "searchSucceeded", results: response.data })
      } catch (caughtError) {
        const appError = toAppError(
          caughtError,
          "Không thể tải danh sách nhà hàng."
        )
        dispatchSearch({ type: "searchFailed", message: appError.message })
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      const timeoutId = searchTimeoutRef.current
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [isOpen, searchFilters, searchQuery])

  const handleRestaurantSelect = (restaurant: PublicRestaurantSearchItem) => {
    onOpenChange(false)
    dispatchSearch({ type: "restaurantSelected" })
    navigate(`/public/restaurants/${restaurant.slug}`)
  }

  const handleOpenSearch = () => {
    onOpenChange(true)
  }

  const handleQueryChange = (query: string) => {
    dispatchSearch({ type: "setQuery", query })
  }

  const setFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    dispatchSearch({
      type: "updateFilters",
      filters: { [key]: value } as Partial<SearchFilters>,
    })
    onOpenChange(true)
  }

  const handleSelectOpenChange = (open: boolean) => {
    isSelectOpenRef.current = open

    if (open) {
      onOpenChange(true)
    }
  }

  const clearLocationFilter = () => {
    dispatchSearch({ type: "clearLocation" })
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      dispatchSearch({
        type: "locationFailed",
        message: "Trình duyệt không hỗ trợ định vị.",
      })
      return
    }

    const requestId = ++locationRequestIdRef.current
    dispatchSearch({ type: "locationStarted" })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (requestId !== locationRequestIdRef.current) return

        dispatchSearch({
          type: "locationSucceeded",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        onOpenChange(true)
      },
      (error) => {
        if (requestId !== locationRequestIdRef.current) return

        dispatchSearch({
          type: "locationFailed",
          message: error.message || "Không thể lấy vị trí hiện tại.",
        })
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    )
  }

  return (
    <>
      <DesktopPublicHeaderSearch
        isOpen={isOpen}
        searchAreaRef={desktopSearchAreaRef}
        searchInputRef={desktopSearchInputRef}
        searchQuery={searchQuery}
        searchFilters={searchFilters}
        isSearchLoading={isSearchLoading}
        searchError={searchError}
        searchResults={searchResults}
        isLocating={isLocating}
        onOpen={handleOpenSearch}
        onQueryChange={handleQueryChange}
        onSelectRestaurant={handleRestaurantSelect}
        onUseCurrentLocation={handleUseCurrentLocation}
        onClearLocation={clearLocationFilter}
        onFilterChange={setFilter}
        onSelectOpenChange={handleSelectOpenChange}
      />

      <MobilePublicHeaderSearch
        isOpen={isOpen}
        searchAreaRef={mobileSearchAreaRef}
        searchInputRef={mobileSearchInputRef}
        searchQuery={searchQuery}
        searchFilters={searchFilters}
        isSearchLoading={isSearchLoading}
        searchError={searchError}
        searchResults={searchResults}
        isLocating={isLocating}
        onOpen={handleOpenSearch}
        onQueryChange={handleQueryChange}
        onSelectRestaurant={handleRestaurantSelect}
        onUseCurrentLocation={handleUseCurrentLocation}
        onClearLocation={clearLocationFilter}
        onFilterChange={setFilter}
        onSelectOpenChange={handleSelectOpenChange}
      />
    </>
  )
}
