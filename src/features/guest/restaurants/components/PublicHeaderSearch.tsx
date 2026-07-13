import { useEffect, useEffectEvent, useReducer, useRef, useState } from "react"
import { searchPublicRestaurants } from "@/services/restaurants"
import { toAppError } from "@/services/core/error"
import { DesktopPublicHeaderSearch } from "./DesktopPublicHeaderSearch"
import { MobilePublicHeaderSearch } from "./MobilePublicHeaderSearch"
import {
  PUBLIC_RESTAURANT_LIMIT,
  PUBLIC_RESTAURANT_PAGE,
  SEARCH_DEBOUNCE_MS,
} from "./public-header-search.config"
import {
  publicHeaderSearchInitialState,
  publicHeaderSearchReducer,
} from "../public-header-search-state"
import type { SearchFilters } from "./public-header-search-types"
import type { PublicHeaderSearchProps } from "./public-header-search.view-types"

const DESKTOP_SEARCH_MEDIA_QUERY = "(min-width: 1024px)"

export default function PublicHeaderSearch({
  isOpen,
  onOpenChange,
  returnFocusRef,
}: PublicHeaderSearchProps) {
  const desktopSearchInputRef = useRef<HTMLInputElement | null>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null)
  const desktopSearchAreaRef = useRef<HTMLDivElement | null>(null)
  const mobileSearchAreaRef = useRef<HTMLDivElement | null>(null)
  const isSelectOpenRef = useRef(false)
  const searchTimeoutRef = useRef<number | null>(null)
  const locationRequestIdRef = useRef(0)
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => {
    return (
      typeof window !== "undefined" &&
      window.matchMedia(DESKTOP_SEARCH_MEDIA_QUERY).matches
    )
  })
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
  const handleCloseSearch = () => {
    dispatchSearch({ type: "closeReset" })
    onOpenChange(false)
  }
  const closeSearchEffect = useEffectEvent(handleCloseSearch)

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_SEARCH_MEDIA_QUERY)
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsDesktopViewport(event.matches)
    }

    mediaQuery.addEventListener("change", handleViewportChange)

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange)
    }
  }, [])

  useEffect(() => {
    if (!isOpen || !isDesktopViewport) return
    desktopSearchInputRef.current?.focus()
  }, [isDesktopViewport, isOpen])

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

      closeSearchEffect()
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

  const handleRestaurantSelect = () => {
    onOpenChange(false)
    dispatchSearch({ type: "restaurantSelected" })
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
        isOpen={isDesktopViewport && isOpen}
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
        isOpen={!isDesktopViewport && isOpen}
        returnFocusRef={returnFocusRef}
        searchAreaRef={mobileSearchAreaRef}
        searchInputRef={mobileSearchInputRef}
        searchQuery={searchQuery}
        searchFilters={searchFilters}
        isSearchLoading={isSearchLoading}
        searchError={searchError}
        searchResults={searchResults}
        isLocating={isLocating}
        onClose={handleCloseSearch}
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
