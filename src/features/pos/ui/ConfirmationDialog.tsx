import { useRef, type ReactNode, type RefObject } from "react"

import Icon from "@/components/AppIcon"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import Button from "./Button"
import { Spinner } from "./Spinner"

export interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "danger" | "warning" | "success"
  icon?: string
  isLoading?: boolean
  children?: ReactNode
  returnFocusRef?: RefObject<HTMLElement | null>
}

const variantStyles = {
  success: {
    iconWrapper: "bg-success text-success-foreground",
    confirmButton: "success" as const,
  },
  danger: {
    iconWrapper: "bg-error text-error-foreground",
    confirmButton: "error" as const,
  },
  warning: {
    iconWrapper: "bg-warning text-warning-foreground",
    confirmButton: "warning" as const,
  },
  default: {
    iconWrapper: "bg-primary text-primary-foreground",
    confirmButton: "default" as const,
  },
}

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "default",
  icon = "AlertCircle",
  isLoading = false,
  children,
  returnFocusRef,
}: ConfirmationDialogProps) => {
  const styles = variantStyles[variant]
  const fallbackReturnFocusRef = useRef<HTMLElement | null>(null)
  const handleClose = () => {
    if (!isLoading) onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[1300] bg-black/50 backdrop-blur-sm"
        className="z-[1301] w-[calc(100%-2rem)] max-w-md gap-0 overflow-hidden p-0 sm:max-w-md"
        onOpenAutoFocus={() => {
          fallbackReturnFocusRef.current =
            document.activeElement as HTMLElement | null
        }}
        onCloseAutoFocus={(event) => {
          const trigger = returnFocusRef?.current ?? fallbackReturnFocusRef.current
          if (trigger?.isConnected) {
            event.preventDefault()
            trigger.focus()
          }
        }}
      >
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div
              aria-hidden="true"
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg",
                styles.iconWrapper
              )}
            >
              <Icon name={icon} size={20} aria-hidden="true" />
            </div>
            <DialogTitle className="min-w-0 text-xl text-pretty text-foreground">
              {title}
            </DialogTitle>
          </div>

          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Đóng hộp thoại"
              disabled={isLoading}
              className="shrink-0 hover-scale"
            >
              <Icon name="X" size={20} aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="max-h-[calc(100dvh-15rem)] overflow-y-auto overscroll-contain p-4 sm:p-6">
          <DialogDescription className="leading-relaxed break-words">
            {message}
          </DialogDescription>
          {children}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border bg-card p-4 sm:flex-row sm:justify-end sm:p-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            variant={styles.confirmButton}
            onClick={onConfirm}
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-4" />
                Đang xử lý…
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
