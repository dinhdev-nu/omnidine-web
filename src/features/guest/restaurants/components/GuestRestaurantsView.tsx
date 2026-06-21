import { BadgeCheck, Flame, MapPin, Search, Star } from "lucide-react"

import AppImage from "@/components/AppImage"
import { GuestRestaurantsLayout } from "@/layouts/guest/GuestRestaurantsLayout"

import AttentionModal from "./AttentionModal"
import CreateRestaurantBanner from "./CreateRestaurantBanner"
import FilterTabs from "./FilterTabs"
import PostCard from "./PostCard"

import {
  TRENDING_TOPICS,
  type GuestRestaurantsController,
} from "../hooks/useGuestRestaurantsPageController"

export function GuestRestaurantsView({
  controller,
}: {
  controller: GuestRestaurantsController
}) {
  const {
    activeFilter,
    closeAttentionModal,
    displayedPosts,
    handleBookmark,
    handleFilterChange,
    handleLike,
    handleLoadMore,
    handleLocationChange,
    handleLogout,
    hasMorePosts,
    isAttentionModalOpen,
    isLoadingMore,
    isRestaurantsLoading,
    loadMoreRef,
    nearbyRestaurants,
    openAttentionModal,
    openCreatePage,
    openPublicRestaurant,
    openRestaurantsPage,
    profile,
    remainingPostsCount,
    restaurantsError,
    restaurantsErrorMeta,
    showFAB,
  } = controller
  return (
    <>
      <GuestRestaurantsLayout
        user={profile}
        onLocationChange={handleLocationChange}
        onLogout={handleLogout}
        showCreateFab={showFAB}
        onOpenAttentionModal={openAttentionModal}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center space-x-2 font-semibold text-foreground">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <span>Gần bạn</span>
                  </h3>
                  <button
                    type="button"
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-3">
                  {isRestaurantsLoading && nearbyRestaurants.length === 0 && (
                    <div className="space-y-3">
                      <div className="h-16 animate-pulse rounded-xl bg-muted/40" />
                      <div className="h-16 animate-pulse rounded-xl bg-muted/40" />
                      <div className="h-16 animate-pulse rounded-xl bg-muted/40" />
                    </div>
                  )}
                  {!isRestaurantsLoading &&
                    nearbyRestaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className="flex items-center space-x-3 rounded-xl p-2 transition-colors hover:bg-secondary"
                      >
                        <button
                          type="button"
                          onClick={() => openPublicRestaurant(restaurant.slug)}
                          className="relative shrink-0"
                          aria-label={`Mở chi tiết ${restaurant.name}`}
                        >
                          <AppImage
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="h-12 w-12 rounded-xl object-cover"
                            loading="lazy"
                          />
                          {restaurant.verified && (
                            <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600">
                              <BadgeCheck className="h-2.5 w-2.5 text-white" />
                            </div>
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() =>
                              openPublicRestaurant(restaurant.slug)
                            }
                            className="block w-full text-left"
                            aria-label={`Mở chi tiết ${restaurant.name}`}
                          >
                            <p className="truncate text-sm font-medium text-foreground">
                              {restaurant.name}
                            </p>
                          </button>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Star className="mr-0.5 h-3 w-3 fill-yellow-500 text-yellow-500" />
                              {restaurant.rating}
                            </span>
                            <span>•</span>
                            <span>{restaurant.distance}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  {!isRestaurantsLoading && nearbyRestaurants.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Không tìm thấy nhà hàng phù hợp.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-3 font-semibold text-foreground">
                  Nhà hàng của bạn
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Quản lý và phát triển nhà hàng của bạn với công cụ chuyên
                  nghiệp!
                </p>
                <button
                  type="button"
                  onClick={openRestaurantsPage}
                  className="w-full rounded-2xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
                >
                  Khám phá ngay
                </button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-6">
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />

            {restaurantsError && (
              <div className="mb-4 space-y-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <div className="font-medium">{restaurantsError}</div>
                {restaurantsErrorMeta &&
                  (restaurantsErrorMeta.status ||
                    restaurantsErrorMeta.code) && (
                    <div className="text-xs text-destructive/80">
                      {restaurantsErrorMeta.status
                        ? `HTTP ${restaurantsErrorMeta.status}`
                        : ""}
                      {restaurantsErrorMeta.status && restaurantsErrorMeta.code
                        ? " • "
                        : ""}
                      {restaurantsErrorMeta.code ?? ""}
                    </div>
                  )}
              </div>
            )}

            <div className="space-y-6">
              {displayedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>

            {!isRestaurantsLoading &&
              displayedPosts.length === 0 &&
              !restaurantsError && (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    Không có nhà hàng
                  </h3>
                  <p className="text-muted-foreground">
                    Chưa tìm thấy nhà hàng nào phù hợp với bộ lọc hiện tại
                  </p>
                </div>
              )}

            {hasMorePosts && (
              <div ref={loadMoreRef} className="py-8 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="rounded-2xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center space-x-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Đang tải...</span>
                    </span>
                  ) : (
                    `Xem thêm bài viết (${remainingPostsCount} còn lại)`
                  )}
                </button>
              </div>
            )}

            {displayedPosts.length > 0 && !hasMorePosts && (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  🎉 Bạn đã xem hết tất cả nhà hàng trong danh sách này
                </p>
              </div>
            )}
          </main>

          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 flex items-center space-x-2 font-semibold text-foreground">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span>Đang hot</span>
                </h3>
                <div className="space-y-1">
                  {TRENDING_TOPICS.map((item) => (
                    <button
                      type="button"
                      key={item.tag}
                      className="w-full rounded-xl p-2 text-left transition-colors hover:bg-secondary"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {item.tag}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.posts}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <CreateRestaurantBanner onOpenCreatePage={openCreatePage} />
            </div>
          </aside>
        </div>
      </GuestRestaurantsLayout>

      <AttentionModal
        isOpen={isAttentionModalOpen}
        onClose={closeAttentionModal}
        onOpenCreatePage={openCreatePage}
      />
    </>
  )
}
