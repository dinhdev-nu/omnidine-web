import { Card, CardContent } from "@/components/ui/card"

export function RestaurantSkeletonGrid() {
  return (
    <div role="status" aria-live="polite" aria-label="Đang tải danh sách nhà hàng" className="contents">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={`restaurant-skeleton-${index}`}
          className="h-full animate-pulse border-border bg-card motion-reduce:animate-none"
        >
          <CardContent className="flex h-full flex-col p-5">
            <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="min-w-0 space-y-2">
                  <div className="h-4 w-28 rounded bg-muted" />
                  <div className="h-3 w-20 rounded bg-muted" />
                </div>
              </div>
              <div className="h-6 w-20 rounded-full bg-muted" />
            </div>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-3 w-32 rounded bg-muted" />
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
              </div>
            </div>
            <div className="mt-auto space-y-4 border-t border-border pt-4">
              <div className="flex items-center justify-between gap-3">
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_44px]">
                <div className="h-11 rounded border border-border bg-muted/40" />
                <div className="h-11 rounded border border-border bg-muted/40" />
                <div className="h-11 rounded bg-muted/40" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
