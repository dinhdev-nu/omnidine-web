import { useCallback, useEffect, useMemo, useReducer, useRef } from "react"
import { useNavigate } from "react-router-dom"

import type {
  FeedFilter,
  FeedLocationSelection,
  FeedPost,
} from "@/features/guest/restaurants"
import { MOCK_PROVINCES } from "@/features/restaurant-onboarding/constants"
import { logout as logoutApi } from "@/services/auth"
import { toAppError } from "@/services/core/error"
import { searchPublicRestaurants } from "@/services/restaurants"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"
import type { PublicRestaurantSearchItem } from "@/types/domain/restaurant"

const PUBLIC_RESTAURANT_PAGE = 1
const PUBLIC_RESTAURANT_LIMIT = 5
const INITIAL_DISPLAY_COUNT = PUBLIC_RESTAURANT_LIMIT
const LOAD_MORE_STEP = PUBLIC_RESTAURANT_LIMIT
const LOAD_MORE_DELAY_MS = 300
const ATTENTION_MODAL_DELAY_MS = 3000
const ATTENTION_MODAL_STORAGE_KEY = "hasSeenAttentionModal"
const FAB_SCROLL_THRESHOLD = 200
const DEFAULT_PROVINCE = MOCK_PROVINCES[0] ?? { code: 1, name: "Hà Nội" }

const FEED_TYPES: Exclude<FeedFilter, "all">[] = [
  "promotion",
  "new_menu",
  "feedback",
  "event",
  "experience",
]
const FEED_TIMESTAMPS = [
  "1 giờ trước",
  "3 giờ trước",
  "5 giờ trước",
  "8 giờ trước",
  "12 giờ trước",
]
const FALLBACK_RESTAURANT_IMAGE = "/assets/home/restaurant-placeholder.png"

export const TRENDING_TOPICS = [
  { tag: "#BuffetNướng", posts: "2.4K bài viết" },
  { tag: "#KhuyếnMãi30", posts: "1.8K bài viết" },
  { tag: "#CàPhêĐàLạt", posts: "1.2K bài viết" },
  { tag: "#LẩuThái", posts: "956 bài viết" },
  { tag: "#PhởHàNội", posts: "784 bài viết" },
]

function formatDistance(distanceKm?: number | null) {
  if (distanceKm === null || distanceKm === undefined) return "Đang cập nhật"
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`
  return `${distanceKm.toFixed(1)} km`
}

function buildFeedContent(
  restaurant: PublicRestaurantSearchItem,
  type: Exclude<FeedFilter, "all">
) {
  const cuisine = restaurant.cuisine_type ?? "món đặc trưng"
  const location =
    [restaurant.district, restaurant.city].filter(Boolean).join(", ") ||
    restaurant.city

  switch (type) {
    case "promotion":
      return `Khám phá ưu đãi nổi bật tại ${restaurant.name} với ${cuisine}. Đặt bàn sớm để giữ chỗ đẹp và nhận ưu đãi tốt hơn.`
    case "new_menu":
      return `${restaurant.name} vừa cập nhật thực đơn mới với các món ${cuisine}. Thử ngay lựa chọn phù hợp cho bữa trưa hoặc buổi tối.`
    case "feedback":
      return `Khách hàng tại ${location} đang đánh giá cao ${restaurant.name} vì chất lượng món ăn và không gian phục vụ ổn định.`
    case "event":
      return `Sự kiện ẩm thực tại ${restaurant.name} đang thu hút nhiều lượt quan tâm. Đây là điểm dừng chân đáng thử cho cuối tuần.`
    case "experience":
      return `Một địa điểm đáng lưu lại ở ${location}: ${restaurant.name} phù hợp cho trải nghiệm ăn uống nhanh, gọn và dễ đặt online.`
  }
}

function mapRestaurantToPost(
  restaurant: PublicRestaurantSearchItem,
  index: number,
  provinceCode: number,
  districtCode: number | null
): FeedPost {
  const type = FEED_TYPES[index % FEED_TYPES.length]
  const image =
    restaurant.cover_image_url ??
    restaurant.logo_url ??
    FALLBACK_RESTAURANT_IMAGE
  const tags = [
    restaurant.cuisine_type,
    restaurant.accepts_online_orders ? "dat-online" : "tai-quan",
    restaurant.price_range ? `hang-${restaurant.price_range}` : null,
  ].filter((tag): tag is string => Boolean(tag))

  return {
    id: restaurant._id,
    type,
    restaurant: {
      slug: restaurant.slug,
      name: restaurant.name,
      avatar: image,
      verified: Boolean(restaurant.logo_url || restaurant.cover_image_url),
      location:
        [restaurant.district, restaurant.city].filter(Boolean).join(", ") ||
        restaurant.city,
      provinceCode,
      districtCode: districtCode ?? undefined,
    },
    timestamp: FEED_TIMESTAMPS[index % FEED_TIMESTAMPS.length],
    content: buildFeedContent(restaurant, type),
    tags,
    images: restaurant.cover_image_url
      ? [restaurant.cover_image_url]
      : restaurant.logo_url
        ? [restaurant.logo_url]
        : undefined,
    liked: false,
    bookmarked: false,
    likes: 400 + index * 87,
    comments: 24 + index * 5,
    shares: 9 + index * 3,
  }
}

function mapRestaurantToNearby(
  restaurant: PublicRestaurantSearchItem,
  index: number,
  provinceCode: number,
  districtCode: number | null
) {
  return {
    id: restaurant._id,
    slug: restaurant.slug,
    name: restaurant.name,
    image:
      restaurant.logo_url ??
      restaurant.cover_image_url ??
      FALLBACK_RESTAURANT_IMAGE,
    rating: Number((4.4 + ((index + 1) % 5) * 0.1).toFixed(1)),
    distance: formatDistance(restaurant.distance_km),
    verified: Boolean(restaurant.logo_url || restaurant.cover_image_url),
    provinceCode,
    districtCode: districtCode ?? undefined,
  }
}

type RestaurantsErrorMeta = {
  code?: string
  status?: number
}

type GuestRestaurantsState = {
  activeFilter: FeedFilter
  selectedLocation: FeedLocationSelection | null
  restaurants: PublicRestaurantSearchItem[]
  posts: FeedPost[]
  displayCount: number
  isLoadingMore: boolean
  showFAB: boolean
  isAttentionModalOpen: boolean
  isRestaurantsLoading: boolean
  restaurantsError: string | null
  restaurantsErrorMeta: RestaurantsErrorMeta | null
}

type GuestRestaurantsAction =
  | { type: "locationChanged"; location: FeedLocationSelection }
  | { type: "filterChanged"; filter: FeedFilter }
  | { type: "setAttentionModalOpen"; isOpen: boolean }
  | { type: "restaurantsLoadStarted" }
  | {
      type: "restaurantsLoadSucceeded"
      restaurants: PublicRestaurantSearchItem[]
      posts: FeedPost[]
    }
  | {
      type: "restaurantsLoadFailed"
      message: string
      meta: RestaurantsErrorMeta
    }
  | { type: "restaurantsLoadFinished" }
  | { type: "setShowFAB"; show: boolean }
  | { type: "toggleLike"; postId: string }
  | { type: "toggleBookmark"; postId: string }
  | { type: "loadMoreStarted" }
  | { type: "loadMoreCompleted"; displayCount: number }

function createInitialGuestRestaurantsState(): GuestRestaurantsState {
  return {
    activeFilter: "all",
    selectedLocation: null,
    restaurants: [],
    posts: [],
    displayCount: INITIAL_DISPLAY_COUNT,
    isLoadingMore: false,
    showFAB: window.scrollY > FAB_SCROLL_THRESHOLD,
    isAttentionModalOpen: false,
    isRestaurantsLoading: true,
    restaurantsError: null,
    restaurantsErrorMeta: null,
  }
}

function guestRestaurantsReducer(
  state: GuestRestaurantsState,
  action: GuestRestaurantsAction
): GuestRestaurantsState {
  switch (action.type) {
    case "locationChanged":
      return {
        ...state,
        selectedLocation: action.location,
        displayCount: INITIAL_DISPLAY_COUNT,
      }
    case "filterChanged":
      return {
        ...state,
        activeFilter: action.filter,
        displayCount: INITIAL_DISPLAY_COUNT,
      }
    case "setAttentionModalOpen":
      return { ...state, isAttentionModalOpen: action.isOpen }
    case "restaurantsLoadStarted":
      return {
        ...state,
        isRestaurantsLoading: true,
        restaurantsError: null,
        restaurantsErrorMeta: null,
      }
    case "restaurantsLoadSucceeded":
      return {
        ...state,
        restaurants: action.restaurants,
        posts: action.posts,
      }
    case "restaurantsLoadFailed":
      return {
        ...state,
        restaurants: [],
        posts: [],
        restaurantsError: action.message,
        restaurantsErrorMeta: action.meta,
      }
    case "restaurantsLoadFinished":
      return { ...state, isRestaurantsLoading: false }
    case "setShowFAB":
      return state.showFAB === action.show
        ? state
        : { ...state, showFAB: action.show }
    case "toggleLike":
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id !== action.postId) return post

          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
        }),
      }
    case "toggleBookmark":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.postId
            ? { ...post, bookmarked: !post.bookmarked }
            : post
        ),
      }
    case "loadMoreStarted":
      return { ...state, isLoadingMore: true }
    case "loadMoreCompleted":
      return {
        ...state,
        displayCount: action.displayCount,
        isLoadingMore: false,
      }
    default:
      return state
  }
}

export function useGuestRestaurantsPageController() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const clearUser = useUserStore((state) => state.clear)
  const profile = useUserStore((state) => state.profile)

  const [feedState, dispatchFeed] = useReducer(
    guestRestaurantsReducer,
    undefined,
    createInitialGuestRestaurantsState
  )
  const {
    activeFilter,
    selectedLocation,
    restaurants,
    posts,
    displayCount,
    isLoadingMore,
    showFAB,
    isAttentionModalOpen,
    isRestaurantsLoading,
    restaurantsError,
    restaurantsErrorMeta,
  } = feedState

  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const loadMoreTimeoutRef = useRef<number | null>(null)

  const clearLoadMoreTimeout = useCallback(() => {
    const timeoutId = loadMoreTimeoutRef.current
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId)
      loadMoreTimeoutRef.current = null
    }
  }, [])

  const handleLocationChange = useCallback(
    (location: FeedLocationSelection) => {
      dispatchFeed({ type: "locationChanged", location })
    },
    []
  )

  const handleFilterChange = useCallback((filter: FeedFilter) => {
    dispatchFeed({ type: "filterChanged", filter })
  }, [])

  useEffect(() => {
    const attentionTimer = window.setTimeout(() => {
      const hasSeenAttention = localStorage.getItem(ATTENTION_MODAL_STORAGE_KEY)
      if (!hasSeenAttention) {
        dispatchFeed({ type: "setAttentionModalOpen", isOpen: true })
        localStorage.setItem(ATTENTION_MODAL_STORAGE_KEY, "true")
      }
    }, ATTENTION_MODAL_DELAY_MS)

    return () => {
      window.clearTimeout(attentionTimer)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    const loadRestaurants = async () => {
      try {
        dispatchFeed({ type: "restaurantsLoadStarted" })

        const response = await searchPublicRestaurants({
          page: PUBLIC_RESTAURANT_PAGE,
          limit: PUBLIC_RESTAURANT_LIMIT,
        })

        if (!isActive) return

        const provinceCode = DEFAULT_PROVINCE.code
        const districtCode = null

        dispatchFeed({
          type: "restaurantsLoadSucceeded",
          restaurants: response.data,
          posts: response.data.map((restaurant, index) =>
            mapRestaurantToPost(restaurant, index, provinceCode, districtCode)
          ),
        })
      } catch (caughtError) {
        if (!isActive) return

        const appError = toAppError(
          caughtError,
          "Không thể tải nhà hàng công khai."
        )
        dispatchFeed({
          type: "restaurantsLoadFailed",
          message: appError.message,
          meta: {
            code: appError.errorCode,
            status: appError.status,
          },
        })
      } finally {
        if (isActive) {
          dispatchFeed({ type: "restaurantsLoadFinished" })
        }
      }
    }

    loadRestaurants()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > FAB_SCROLL_THRESHOLD
      dispatchFeed({ type: "setShowFAB", show: shouldShow })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLike = useCallback((postId: string) => {
    dispatchFeed({ type: "toggleLike", postId })
  }, [])

  const handleBookmark = useCallback((postId: string) => {
    dispatchFeed({ type: "toggleBookmark", postId })
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      // Local session cleanup still completes when the remote logout endpoint is unavailable.
    } finally {
      clearAuth()
      clearUser()
      navigate("/auth", { replace: true })
    }
  }, [clearAuth, clearUser, navigate])

  const filteredByLocationPosts = useMemo(() => {
    return posts
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") return filteredByLocationPosts
    return filteredByLocationPosts.filter((post) => post.type === activeFilter)
  }, [activeFilter, filteredByLocationPosts])

  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, displayCount)
  }, [displayCount, filteredPosts])

  const nearbyRestaurants = useMemo(() => {
    if (!restaurants.length) return []

    const provinceCode =
      selectedLocation?.province.code ?? DEFAULT_PROVINCE.code
    const districtCode = selectedLocation?.district?.code ?? null

    return restaurants
      .slice(0, 4)
      .map((restaurant, index) =>
        mapRestaurantToNearby(restaurant, index, provinceCode, districtCode)
      )
  }, [restaurants, selectedLocation])

  const remainingPostsCount = filteredPosts.length - displayedPosts.length
  const hasMorePosts = remainingPostsCount > 0

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMorePosts) return

    dispatchFeed({ type: "loadMoreStarted" })

    clearLoadMoreTimeout()

    loadMoreTimeoutRef.current = window.setTimeout(() => {
      dispatchFeed({
        type: "loadMoreCompleted",
        displayCount: Math.min(
          displayCount + LOAD_MORE_STEP,
          filteredPosts.length
        ),
      })
      loadMoreTimeoutRef.current = null
    }, LOAD_MORE_DELAY_MS)
  }, [
    clearLoadMoreTimeout,
    displayCount,
    filteredPosts.length,
    hasMorePosts,
    isLoadingMore,
  ])

  useEffect(() => {
    return clearLoadMoreTimeout
  }, [clearLoadMoreTimeout])

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target || !hasMorePosts || isLoadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore()
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [handleLoadMore, hasMorePosts, isLoadingMore])

  const openAttentionModal = useCallback(() => {
    dispatchFeed({ type: "setAttentionModalOpen", isOpen: true })
  }, [])

  const closeAttentionModal = useCallback(() => {
    dispatchFeed({ type: "setAttentionModalOpen", isOpen: false })
  }, [])

  const openCreatePage = useCallback(() => {
    navigate("/restaurants/new")
  }, [navigate])

  const openRestaurantsPage = useCallback(() => {
    navigate("/restaurants")
  }, [navigate])

  const openPublicRestaurant = useCallback(
    (slug: string) => {
      navigate(`/public/restaurants/${slug}`)
    },
    [navigate]
  )

  return {
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
  }
}

export type GuestRestaurantsController = ReturnType<
  typeof useGuestRestaurantsPageController
>
