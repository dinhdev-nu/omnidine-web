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
      className="relative mx-4 hidden max-w-2xl min-w-0 flex-1 lg:block xl:mx-8"
    >
      <div className="relative w-full">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={searchInputRef}
          aria-label="Tìm nhà hàng"
          name="feed-search"
          type="search"
          autoComplete="off"
          value={searchQuery}
          onChange={(event) => {
            onQueryChange(event.target.value)
            onOpen()
          }}
          onFocus={onOpen}
          placeholder="Tìm kiếm nhà hàng, món ăn…"
          className="h-11 w-full rounded-full border border-border bg-secondary py-2.5 pr-12 pl-12 text-sm text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none motion-reduce:transition-none"
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
            className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-[calc(100dvh-5rem-env(safe-area-inset-top))] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-popover shadow-xl">
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
