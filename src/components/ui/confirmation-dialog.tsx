import React from "react"

import Icon from "@/components/AppIcon"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

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
  children?: React.ReactNode
}

const variantStyles = {
  success: {
    iconWrapper: "bg-success/10",
    iconColor: "text-success",
    confirmButton: "default" as const,
  },
  danger: {
    iconWrapper: "bg-destructive/10",
    iconColor: "text-destructive",
    confirmButton: "destructive" as const,
  },
  warning: {
    iconWrapper: "bg-warning/15",
    iconColor: "text-warning-foreground",
    confirmButton: "default" as const,
  },
  default: {
    iconWrapper: "bg-primary/10",
    iconColor: "text-primary",
    confirmButton: "default" as const,
  },
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
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
}) => {
  const returnFocusRef = React.useRef<HTMLElement | null>(null)
  const styles = variantStyles[variant]

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[1300] bg-black/50"
        className="z-[1300] max-w-md gap-0 overflow-hidden p-0 shadow-xl sm:max-w-md"
        onOpenAutoFocus={() => {
          returnFocusRef.current = document.activeElement as HTMLElement | null
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          returnFocusRef.current?.focus()
        }}
        onEscapeKeyDown={(event) => {
          if (isLoading) event.preventDefault()
        }}
        onPointerDownOutside={(event) => {
          if (isLoading) event.preventDefault()
        }}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex size-11 flex-shrink-0 items-center justify-center rounded-lg",
                styles.iconWrapper
              )}
            >
              <Icon aria-hidden="true" name={icon} size={22} className={styles.iconColor} />
            </div>

            <DialogHeader className="min-w-0 flex-1 pt-0.5 text-left">
              <DialogTitle className="leading-snug font-semibold">
                {title}
              </DialogTitle>
              <DialogDescription className="leading-relaxed">
                {message}
              </DialogDescription>
              {children}
            </DialogHeader>
          </div>
        </div>

        <DialogFooter className="m-0 rounded-none px-6 py-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="min-h-11"
          >
            {cancelText}
          </Button>
          <Button
            variant={styles.confirmButton}
            onClick={onConfirm}
            disabled={isLoading}
            className="min-h-11"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-4 motion-reduce:animate-none" />
                Đang xử lý...
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
