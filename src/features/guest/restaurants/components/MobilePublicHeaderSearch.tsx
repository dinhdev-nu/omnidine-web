import { Search, X } from "lucide-react"
import { useRef } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

import PublicHeaderSearchContent from "./PublicHeaderSearchContent.tsx"
import type { MobileSearchProps } from "./public-header-search.view-types"

export function MobilePublicHeaderSearch({
  isOpen,
  returnFocusRef,
  searchAreaRef,
  searchInputRef,
  searchQuery,
  searchFilters,
  isSearchLoading,
  searchError,
  searchResults,
  isLocating,
  onClose,
  onOpen,
  onQueryChange,
  onSelectRestaurant,
  onUseCurrentLocation,
  onClearLocation,
  onFilterChange,
  onSelectOpenChange,
}: MobileSearchProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  return (
    <div className="lg:hidden">
      <Dialog
        open={isOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) onClose()
        }}
      >
        <DialogContent
          ref={searchAreaRef}
          id="mobile-public-search"
          showCloseButton={false}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            closeButtonRef.current?.focus()
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            returnFocusRef.current?.focus()
          }}
          className="inset-0 flex h-[100dvh] max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden overscroll-contain rounded-none border-0 p-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">Tìm kiếm nhà hàng</DialogTitle>
          <DialogDescription className="sr-only">
            Tìm kiếm và lọc nhà hàng theo vị trí, loại món ăn và mức giá.
          </DialogDescription>

          <div className="shrink-0 border-b border-border bg-background pt-[calc(0.75rem+env(safe-area-inset-top))] pr-[calc(0.75rem+env(safe-area-inset-right))] pb-3 pl-[calc(0.75rem+env(safe-area-inset-left))] sm:pr-[calc(1.5rem+env(safe-area-inset-right))] sm:pb-4 sm:pl-[calc(1.5rem+env(safe-area-inset-left))]">
            <div className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  ref={searchInputRef}
                  aria-label="Tìm nhà hàng"
                  name="mobile-feed-search"
                  type="search"
                  inputMode="search"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(event) => {
                    onQueryChange(event.target.value)
                    onOpen()
                  }}
                  placeholder="Tìm kiếm nhà hàng, món ăn…"
                  className="min-h-11 w-full rounded-2xl border border-border bg-secondary py-2.5 pr-10 pl-12 text-base text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none sm:text-sm"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    aria-label="Xóa tìm kiếm"
                    onClick={() => {
                      onQueryChange("")
                      searchInputRef.current?.focus()
                    }}
                    className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                ) : null}
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Đóng tìm kiếm"
                onClick={onClose}
                className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-popover pb-[env(safe-area-inset-bottom)]">
            <PublicHeaderSearchContent
              layout="fullscreen"
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
        </DialogContent>
      </Dialog>
    </div>
  )
}
