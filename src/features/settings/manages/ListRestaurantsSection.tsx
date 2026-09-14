import { useEffect, useReducer } from "react"
import { useNavigate } from "react-router-dom"
import { getOwnerRestaurants } from "@/services/restaurants"
import {
  initialRestaurantListState,
  restaurantListReducer,
} from "./list-restaurants.state"
import { RestaurantCard } from "./components/list-restaurants/RestaurantCard"
import { RestaurantSkeletonGrid } from "./components/list-restaurants/RestaurantSkeletonGrid"
import { ShareRestaurantDialog } from "./components/list-restaurants/ShareRestaurantDialog"

export function ListRestaurantsSection() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(
    restaurantListReducer,
    initialRestaurantListState
  )
  const { restaurants, isLoading, error, shareTarget, shareMode } = state

  const sharePublicUrl = shareTarget
    ? `${window.location.origin}/public/restaurants/${shareTarget.slug}/menu`
    : ""

  const sharePosUrl = shareTarget
    ? `${window.location.origin}/pos/${shareTarget.slug}`
    : ""

  useEffect(() => {
    let isActive = true

    async function loadRestaurants() {
      try {
        dispatch({ type: "loadStarted" })

        const response = await getOwnerRestaurants({ page: 1, limit: 10 })
        if (!isActive) return

        dispatch({ type: "loadSucceeded", restaurants: response.data })
      } catch {
        if (!isActive) return

        dispatch({
          type: "loadFailed",
          message: "Không thể tải danh sách nhà hàng.",
        })
      }
    }

    loadRestaurants()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div>
      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4 xl:gap-5">
        {isLoading && <RestaurantSkeletonGrid />}

        {!isLoading &&
          restaurants.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
              index={index}
              onOpenPos={(slug) => navigate(`/pos/${slug}`)}
              onOpenDashboard={(targetRestaurant) =>
                navigate(`/dashboard/${targetRestaurant._id}`, {
                  state: {
                    restaurant: {
                      _id: targetRestaurant._id,
                      name: targetRestaurant.name,
                      logo_url: targetRestaurant.logo_url,
                    },
                  },
                })
              }
              onShare={(targetRestaurant) =>
                dispatch({ type: "openShare", restaurant: targetRestaurant })
              }
            />
          ))}

        {!isLoading && restaurants.length === 0 && !error && (
          <div className="col-span-full rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            Chưa có nhà hàng nào.
          </div>
        )}
      </div>

      <ShareRestaurantDialog
        shareTarget={shareTarget}
        shareMode={shareMode}
        sharePublicUrl={sharePublicUrl}
        sharePosUrl={sharePosUrl}
        onShareModeChange={(mode) => dispatch({ type: "setShareMode", mode })}
        onClose={() => dispatch({ type: "closeShare" })}
      />
    </div>
  )
}
