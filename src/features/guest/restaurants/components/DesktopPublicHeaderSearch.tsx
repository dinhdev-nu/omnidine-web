import { Search, X } from "lucide-react"
import PublicHeaderSearchContent from "./PublicHeaderSearchContent.tsx"
import type { DesktopSearchProps } from "./public-header-search.view-types"

export function DesktopPublicHeaderSearch({
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
