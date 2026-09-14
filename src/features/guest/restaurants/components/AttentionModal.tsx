import type { LucideIcon } from "lucide-react"
import { ArrowRight, BarChart3, Star, Users, X } from "lucide-react"
import { useRef } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

interface AttentionModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenCreatePage: () => void
}

interface FeatureItem {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: FeatureItem[] = [
  {
    icon: BarChart3,
    title: "Quản lý thông minh",
    description: "Theo dõi doanh thu, đơn hàng và khách hàng một cách dễ dàng",
  },
  {
    icon: Users,
    title: "Tiếp cận khách hàng",
    description: "Kết nối với hàng nghìn khách hàng tiềm năng trong khu vực",
  },
  {
    icon: Star,
    title: "Nâng cao uy tín",
    description: "Xây dựng thương hiệu và nhận đánh giá từ khách hàng",
  },
]

export default function AttentionModal({
  isOpen,
  onClose,
  onOpenCreatePage,
}: AttentionModalProps) {
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const handleCreateRestaurant = () => {
    onClose()
    onOpenCreatePage()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={() => {
          const activeElement = document.activeElement
          returnFocusRef.current =
            activeElement instanceof HTMLElement ? activeElement : null
        }}
        onCloseAutoFocus={(event) => {
          const returnFocusElement = returnFocusRef.current
          returnFocusRef.current = null

          if (
            !returnFocusElement ||
            returnFocusElement === document.body ||
            !document.contains(returnFocusElement)
          ) {
            return
          }

          event.preventDefault()
          returnFocusElement.focus()
        }}
        className="w-full max-w-md overflow-hidden overscroll-contain rounded-xl border border-border bg-card p-0 shadow-xl"
      >
        <div className="relative border-b border-border bg-card px-4 py-5 sm:px-6 sm:py-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="absolute top-2 right-2 flex size-11 touch-manipulation items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none sm:top-3 sm:right-3"
          >
            <X aria-hidden="true" className="size-4" />
          </button>

          <div className="px-6 text-center">
            <DialogTitle className="mb-2 text-lg font-semibold text-balance text-foreground">
              Bạn có nhà hàng riêng?
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-pretty text-muted-foreground">
              Tham gia hệ thống quản lý hiện đại và kết nối với hàng nghìn khách
              hàng
            </DialogDescription>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Icon
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="border-t border-border bg-muted/40 px-4 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-2 min-[360px]:flex-row min-[360px]:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 flex-1 touch-manipulation rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              Để sau
            </button>
            <button
              type="button"
              onClick={handleCreateRestaurant}
              className="flex min-h-11 flex-1 touch-manipulation items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span>Đăng ký ngay</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
