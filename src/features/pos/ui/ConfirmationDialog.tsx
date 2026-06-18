import React from "react"

import { cn } from "@/lib/utils"

import Icon from "./AppIcon"
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
  children?: React.ReactNode
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
  const titleId = React.useId()
  const descriptionId = React.useId()

  if (!isOpen) return null

  const styles = variantStyles[variant]
  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center overflow-hidden p-4">
      <button
        type="button"
        aria-label="ÄÃ³ng há»™p thoáº¡i"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className={cn(
          "shadow-modal relative mx-4 w-full max-w-md overflow-hidden rounded-lg border border-border bg-card",
          "animate-in duration-200 zoom-in-95 fade-in"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                styles.iconWrapper
              )}
            >
              <Icon name={icon} size={20} aria-hidden="true" />
            </div>

            <h3
              id={titleId}
              className="min-w-0 text-xl font-semibold text-pretty text-foreground"
            >
              {title}
            </h3>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isLoading}
            className="hover-scale"
            aria-label="Đóng hộp thoại"
          >
            <Icon name="X" size={20} aria-hidden="true" />
          </Button>
        </div>

        <div className="max-h-[calc(90vh-144px)] overflow-y-auto p-6">
          <p
            id={descriptionId}
            className="text-sm leading-relaxed break-words text-muted-foreground"
          >
            {message}
          </p>
          {children}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border p-6 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={styles.confirmButton}
            onClick={onConfirm}
            disabled={isLoading}
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
      </div>
    </div>
  )
}

export default ConfirmationDialog
