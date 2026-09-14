import { ArrowRight } from "lucide-react"

interface CreateRestaurantBannerProps {
  onOpenCreatePage: () => void
}

export default function CreateRestaurantBanner({
  onOpenCreatePage,
}: CreateRestaurantBannerProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-colors duration-200 hover:bg-accent/30">
      <div className="mb-3">
        <h3 className="font-semibold text-foreground">Bạn là chủ nhà hàng?</h3>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
        Tham gia POS Manager để quản lý nhà hàng chuyên nghiệp và tiếp cận hàng
        nghìn khách hàng
      </p>

      <div>
        <button
          type="button"
          onClick={onOpenCreatePage}
          className="group flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span>Tạo nhà hàng</span>
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </button>
      </div>
    </div>
  )
}
