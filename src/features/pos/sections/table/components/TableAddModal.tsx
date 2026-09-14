import React, { useState } from "react"
import Icon from "@/components/AppIcon"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CreateTablePayload } from "@/types/domain/table"
import Button from "../../../ui/Button"
import Input from "../../../ui/Input"

interface TableAddModalProps {
  isOpen: boolean
  isSubmitting: boolean
  onClose: () => void
  onConfirm: (form: CreateTablePayload) => void
  triggerRef?: React.RefObject<HTMLButtonElement | null>
}

const DEFAULT_FORM: CreateTablePayload = {
  table_number: "",
  name: "",
  notes: "",
  capacity: 4,
}

const TableAddModal: React.FC<TableAddModalProps> = ({
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
  triggerRef,
}) => {
  const [form, setForm] = useState<CreateTablePayload>(DEFAULT_FORM)
  const dialogContentRef = React.useRef<HTMLDivElement>(null)
  const tableNumberInputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const tableNumber = form.table_number?.trim()
    if (!tableNumber || isSubmitting) return

    onConfirm({
      ...form,
      table_number: tableNumber,
    })
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        ref={dialogContentRef}
        tabIndex={-1}
        showCloseButton={false}
        className="max-h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] gap-0 overflow-hidden p-0 sm:max-w-md"
        aria-busy={isSubmitting}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          if (window.matchMedia("(min-width: 768px)").matches) {
            tableNumberInputRef.current?.focus({ preventScroll: true })
          } else {
            dialogContentRef.current?.focus({ preventScroll: true })
          }
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          triggerRef?.current?.focus()
        }}
        onEscapeKeyDown={(event) => {
          if (isSubmitting) event.preventDefault()
        }}
        onPointerDownOutside={(event) => {
          if (isSubmitting) event.preventDefault()
        }}
      >
        <DialogHeader className="relative border-b border-border p-4 pr-16 sm:p-6 sm:pr-20">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              aria-hidden="true"
            >
              <Icon name="Plus" size={20} />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold sm:text-xl">
                Thêm bàn mới
              </DialogTitle>
              <DialogDescription className="mt-1 leading-relaxed">
                Nhập thông tin bàn. Bạn có thể chỉnh sửa lại sau khi tạo.
              </DialogDescription>
            </div>
          </div>

          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isSubmitting}
              className="absolute right-2 top-2 sm:right-4 sm:top-4"
              aria-label="Đóng hộp thoại thêm bàn"
            >
              <Icon name="X" size={20} aria-hidden="true" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit}
        >
          <div className="flex max-h-[calc(100dvh-13rem)] flex-col gap-4 overflow-y-auto p-4 sm:p-6">
            <Input
              ref={tableNumberInputRef}
              id="table-number-input"
              name="table_number"
              type="text"
              label="Số bàn"
              placeholder="Ví dụ: 10"
              value={form.table_number}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  table_number: event.target.value,
                }))
              }
              autoComplete="off"
              maxLength={24}
              disabled={isSubmitting}
              required
            />

            <Input
              id="table-name-input"
              name="name"
              type="text"
              label="Tên bàn (tùy chọn)"
              placeholder="Ví dụ: Bàn ban công"
              value={form.name ?? ""}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
              autoComplete="off"
              maxLength={100}
              disabled={isSubmitting}
            />

            <Input
              id="table-capacity-input"
              name="capacity"
              type="number"
              inputMode="numeric"
              label="Sức chứa"
              min={1}
              max={99}
              value={form.capacity}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  capacity: Number.parseInt(event.target.value, 10) || 1,
                }))
              }
              disabled={isSubmitting}
              required
            />

            <Input
              id="table-notes-input"
              name="notes"
              type="text"
              label="Ghi chú (tùy chọn)"
              placeholder="Ví dụ: Gần cửa sổ"
              value={form.notes ?? ""}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  notes: event.target.value,
                }))
              }
              autoComplete="off"
              maxLength={255}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="m-0 shrink-0 rounded-none px-4 py-4 sm:px-6">
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="default"
              disabled={!form.table_number?.trim() || isSubmitting}
              iconName={isSubmitting ? "Loader2" : "Check"}
              iconPosition="left"
              className="w-full motion-reduce:[&_svg]:animate-none sm:w-auto"
              aria-live="polite"
            >
              {isSubmitting ? "Đang tạo..." : "Xác nhận tạo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TableAddModal
