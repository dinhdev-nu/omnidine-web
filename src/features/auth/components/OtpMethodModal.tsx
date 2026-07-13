import { useRef } from "react"
import { ChevronRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface OtpMethod {
  id: string
  label: string
  icon: string
  description?: string
}

interface OtpMethodModalProps {
  methods: OtpMethod[]
  isSendingOtp: boolean
  onSelect: (methodId: string) => void
  onClose: () => void
}

export function OtpMethodModal({
  methods,
  isSendingOtp,
  onSelect,
  onClose,
}: OtpMethodModalProps) {
  const returnFocusRef = useRef<HTMLElement | null>(null)

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSendingOtp) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-sm"
        onOpenAutoFocus={() => {
          returnFocusRef.current = document.activeElement as HTMLElement | null
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          returnFocusRef.current?.focus()
        }}
        onEscapeKeyDown={(event) => {
          if (isSendingOtp) event.preventDefault()
        }}
        onPointerDownOutside={(event) => {
          if (isSendingOtp) event.preventDefault()
        }}
      >
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-lg">Gửi mã xác minh</DialogTitle>
          <DialogDescription>
            Chọn cách bạn muốn nhận mã của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {methods.map((method) => (
            <Button
              key={method.id}
              type="button"
              variant="outline"
              onClick={() => onSelect(method.id)}
              disabled={isSendingOtp}
              className={cn(
                "h-auto min-h-11 w-full justify-start gap-3 rounded-xl p-4 text-left whitespace-normal",
                isSendingOtp && "cursor-not-allowed opacity-60"
              )}
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {method.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">
                  {method.label}
                </span>
                {method.description && (
                  <span className="block text-xs text-muted-foreground">
                    {method.description}
                  </span>
                )}
              </span>
              {isSendingOtp ? (
                <Loader2 className="animate-spin text-muted-foreground motion-reduce:animate-none" />
              ) : (
                <ChevronRight className="text-muted-foreground" />
              )}
            </Button>
          ))}
        </div>

        <div className="mt-1">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSendingOtp}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Hủy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
