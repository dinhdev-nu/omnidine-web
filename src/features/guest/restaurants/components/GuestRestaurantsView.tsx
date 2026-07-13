import { BadgeCheck, Flame, MapPin, Search, Star } from "lucide-react"
import { Link } from "react-router-dom"

import AppImage from "@/components/AppImage"
import { Spinner } from "@/components/ui/spinner"
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
        <h1 className="sr-only">Khám phá nhà hàng</h1>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <aside className="hidden xl:col-span-3 xl:block">
            <div className="sticky top-[calc(5.5rem+env(safe-area-inset-top))] flex flex-col gap-6">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold text-foreground">
                    <MapPin
                      aria-hidden="true"
                      className="size-5 text-red-500"
                    />
                    <span>Gần bạn</span>
                  </h3>
                  <button
                    type="button"
                    disabled
                    title="Danh sách đầy đủ chưa khả dụng"
                    className="min-h-11 touch-manipulation rounded-md px-2 text-xs font-medium text-muted-foreground opacity-50 disabled:cursor-not-allowed"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {isRestaurantsLoading && nearbyRestaurants.length === 0 && (
                    <div className="flex flex-col gap-3">
                      <div className="h-16 animate-pulse rounded-xl bg-muted/40 motion-reduce:animate-none" />
                      <div className="h-16 animate-pulse rounded-xl bg-muted/40 motion-reduce:animate-none" />
                      <div className="h-16 animate-pulse rounded-xl bg-muted/40 motion-reduce:animate-none" />
                    </div>
                  )}
                  {!isRestaurantsLoading &&
                    nearbyRestaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary motion-reduce:transition-none"
                      >
                        <Link
                          to={`/public/restaurants/${restaurant.slug}`}
                          className="relative shrink-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:outline-none"
                          aria-label={`Mở chi tiết ${restaurant.name}`}
                        >
                          <AppImage
                            src={restaurant.image}
                            alt={restaurant.name}
                            width={48}
                            height={48}
                            className="size-12 rounded-xl object-cover"
                            loading="lazy"
                          />
                          {restaurant.verified && (
                            <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600">
                              <BadgeCheck
                                aria-hidden="true"
                                className="size-2.5 text-white"
                              />
                            </div>
                          )}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/public/restaurants/${restaurant.slug}`}
                            className="-my-2.5 flex min-h-11 w-full touch-manipulation items-center rounded-sm py-2.5 text-left focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                            aria-label={`Mở chi tiết ${restaurant.name}`}
                          >
                            <p className="truncate text-sm font-medium text-foreground">
                              {restaurant.name}
                            </p>
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Star
                                aria-hidden="true"
                                className="mr-0.5 size-3 fill-yellow-500 text-yellow-500"
                              />
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
                <Link
                  to="/restaurants"
                  className="flex min-h-11 w-full touch-manipulation items-center justify-center rounded-2xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none"
                >
                  Khám phá ngay
                </Link>
              </div>
            </div>
          </aside>

          <section
            aria-label="Bảng tin nhà hàng"
            className="mx-auto w-full max-w-3xl min-w-0 xl:col-span-6 xl:max-w-none"
          >
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />

            {restaurantsError && (
              <div
                role="alert"
                className="mb-4 flex flex-col gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
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

            {isRestaurantsLoading &&
              displayedPosts.length === 0 &&
              !restaurantsError && (
                <output
                  aria-label="Đang tải nhà hàng"
                  className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card text-sm text-muted-foreground"
                >
                  <Spinner className="size-5" />
                  <span>Đang tải nhà hàng…</span>
                </output>
              )}

            <div className="flex flex-col gap-4 sm:gap-6">
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
                  <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-secondary">
                    <Search
                      aria-hidden="true"
                      className="size-12 text-muted-foreground"
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    Không có nhà hàng
                  </h3>
                  <p className="text-pretty text-muted-foreground">
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
                  className="min-h-11 touch-manipulation rounded-2xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center gap-2">
                      <svg
                        aria-hidden="true"
                        className="size-4 animate-spin motion-reduce:animate-none"
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
                      <span>Đang tải…</span>
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
          </section>

          <aside className="hidden xl:col-span-3 xl:block">
            <div className="sticky top-[calc(5.5rem+env(safe-area-inset-top))] flex flex-col gap-6">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <Flame
                    aria-hidden="true"
                    className="size-5 text-orange-500"
                  />
                  <span>Đang hot</span>
                </h3>
                <div className="flex flex-col gap-1">
                  {TRENDING_TOPICS.map((item) => (
                    <button
                      type="button"
                      key={item.tag}
                      disabled
                      title="Bộ lọc chủ đề chưa khả dụng"
                      className="min-h-11 w-full touch-manipulation rounded-xl p-2 text-left opacity-50 disabled:cursor-not-allowed"
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
