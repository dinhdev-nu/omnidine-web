import { Button } from "@/components/ui/button"
import { RestaurantProfileRegistrationForm } from "@/features/dashboard/components/RestaurantProfileRegistrationForm"
import {
  useCreateRestaurantActions,
  useCreateRestaurantMeta,
} from "@/features/restaurant-onboarding/FormProvider"
import { Loader2 } from "lucide-react"

export function RestaurantProfileMainContent() {
  const { submitForm } = useCreateRestaurantActions()
  const { isSubmitting, isUploadingAssets } = useCreateRestaurantMeta()

  return (
    <form
      onSubmit={submitForm}
      aria-busy={isSubmitting || isUploadingAssets}
      className="min-w-0 space-y-6"
    >
      <RestaurantProfileRegistrationForm />

      <div className="flex justify-end">
        <Button
          type="submit"
          className="w-full bg-accent text-white hover:bg-accent/90 sm:w-auto"
          disabled={isSubmitting || isUploadingAssets}
        >
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" />
              Đang lưu…
            </>
          ) : (
            "Lưu thông tin nhà hàng"
          )}
        </Button>
      </div>
    </form>
  )
}
