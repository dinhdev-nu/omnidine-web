import React, { useRef, useState } from "react"
import Icon from "@/components/AppIcon"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type {
  TableListItem,
  TableStatus,
  UpdateTablePayload,
} from "@/types/domain/table"
import Button from "../../../ui/Button"
import Input from "../../../ui/Input"
import TableQrDialog from "./TableQrDialog"

interface TableControlPanelProps {
  selectedTable?: TableListItem | null
  displayMode?: "sidebar" | "dialog"
  isSubmittingUpdate?: boolean
  isSubmittingStatus?: boolean
  isTogglingActive?: boolean
  isRegeneratingQr?: boolean
  isDeleting?: boolean
  onTableStatusChange: (id: string, status: TableStatus) => void
  onUpdateTable: (id: string, form: UpdateTablePayload) => void
  onToggleTableActive: (id: string) => void
  onRegenerateTableQr: (id: string) => void
  onDeleteTable: (id: string) => void
}

const STATUS_OPTIONS = [
  { status: "available" as const, label: "Trống", variant: "success" as const },
  {
    status: "occupied" as const,
    label: "Có khách",
    variant: "warning" as const,
  },
  { status: "reserved" as const, label: "Đã đặt", variant: "error" as const },
  {
    status: "cleaning" as const,
    label: "Dọn dẹp",
    variant: "default" as const,
  },
]

const TableControlPanel: React.FC<TableControlPanelProps> = ({
  selectedTable,
  displayMode = "sidebar",
  isSubmittingUpdate = false,
  isSubmittingStatus = false,
  isTogglingActive = false,
  isRegeneratingQr = false,
  isDeleting = false,
  onTableStatusChange,
  onUpdateTable,
  onToggleTableActive,
  onRegenerateTableQr,
  onDeleteTable,
}) => {
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false)
  const qrTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [editForm, setEditForm] = useState({
    table_number: selectedTable?.table_number ?? "",
    name: selectedTable?.name ?? "",
    notes: selectedTable?.notes ?? "",
    capacity: selectedTable?.capacity ?? 1,
  })

  const tableQrUrl =
    selectedTable?.qr_url ??
    (selectedTable?.qr_code
      ? `${window.location.origin}/public/tables/${selectedTable.qr_code}`
      : null)

  const isBusy =
    isSubmittingUpdate ||
    isSubmittingStatus ||
    isTogglingActive ||
    isRegeneratingQr ||
    isDeleting

  const handleUpdateTable = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedTable || !editForm.table_number.trim() || isBusy) return

    onUpdateTable(selectedTable._id, {
      table_number: editForm.table_number.trim(),
      capacity: editForm.capacity,
      name: editForm.name,
      notes: editForm.notes,
    })
  }

  const openQrDialog = (trigger: HTMLButtonElement) => {
    qrTriggerRef.current = trigger
    setIsQrDialogOpen(true)
  }

  return (
    <section
      className={cn(
        "relative flex flex-col bg-surface",
        displayMode === "sidebar"
          ? "h-full w-72 border-l border-border 2xl:w-80"
          : "w-full"
      )}
      aria-label="Bảng điều khiển bàn"
      aria-busy={isBusy}
    >
      {selectedTable ? (
        <div
          className={cn(
            "min-h-0 flex-1",
            displayMode === "sidebar" && "overflow-y-auto"
          )}
        >
          <div className="flex min-h-full flex-col gap-4 p-4">
            <div className="min-w-0">
              <h2 className="break-words text-lg font-medium text-foreground">
                Bàn {selectedTable.table_number}
              </h2>
              {selectedTable.name && (
                <p className="mt-1 break-words text-sm text-muted-foreground">
                  {selectedTable.name}
                </p>
              )}
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-xs text-muted-foreground">
                Trạng thái hiện tại
              </legend>
              <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                {STATUS_OPTIONS.map(({ status, label, variant }) => (
                  <Button
                    key={status}
                    variant={
                      selectedTable.status === status ? variant : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      onTableStatusChange(selectedTable._id, status)
                    }
                    disabled={
                      selectedTable.is_active === false ||
                      isBusy ||
                      selectedTable.status === status
                    }
                    aria-pressed={selectedTable.status === status}
                    className="h-auto min-h-11 whitespace-normal py-2"
                  >
                    {label}
                  </Button>
                ))}
              </div>
              {isSubmittingStatus && (
                <p className="text-xs text-muted-foreground" role="status">
                  Đang cập nhật trạng thái...
                </p>
              )}
            </fieldset>

            <Separator />

            <form className="flex flex-col gap-3" onSubmit={handleUpdateTable}>
              <p className="text-xs text-muted-foreground">Thông tin chi tiết</p>
              <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
                <Input
                  type="text"
                  name="table_number"
                  label="Số bàn"
                  placeholder="Số bàn"
                  value={editForm.table_number}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      table_number: event.target.value,
                    }))
                  }
                  autoComplete="off"
                  maxLength={24}
                  disabled={isBusy}
                  required
                />
                <Input
                  type="number"
                  name="capacity"
                  inputMode="numeric"
                  label="Sức chứa"
                  min={1}
                  max={99}
                  value={editForm.capacity}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      capacity:
                        Number.parseInt(event.target.value, 10) || 1,
                    }))
                  }
                  disabled={isBusy}
                  required
                />
              </div>
              <Input
                type="text"
                name="name"
                label="Tên bàn"
                placeholder="Tên bàn (không bắt buộc)"
                value={editForm.name}
                onChange={(event) =>
                  setEditForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                autoComplete="off"
                maxLength={100}
                disabled={isBusy}
              />
              <Input
                type="text"
                name="notes"
                label="Ghi chú"
                placeholder="Ghi chú (không bắt buộc)"
                value={editForm.notes}
                onChange={(event) =>
                  setEditForm((previous) => ({
                    ...previous,
                    notes: event.target.value,
                  }))
                }
                autoComplete="off"
                maxLength={255}
                disabled={isBusy}
              />

              <Button
                type="submit"
                variant="outline"
                size="sm"
                fullWidth
                iconName={isSubmittingUpdate ? "Loader2" : "Save"}
                iconPosition="left"
                disabled={
                  isBusy ||
                  !editForm.table_number.trim() ||
                  editForm.capacity < 1 ||
                  editForm.capacity > 99
                }
                className="motion-reduce:[&_svg]:animate-none"
              >
                {isSubmittingUpdate ? "Đang cập nhật..." : "Cập nhật thông tin"}
              </Button>
            </form>

            <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleTableActive(selectedTable._id)}
                disabled={isBusy}
                iconName={
                  selectedTable.is_active === false ? "Power" : "PowerOff"
                }
                iconPosition="left"
                className="h-auto min-h-11 whitespace-normal py-2"
              >
                {isTogglingActive
                  ? "Đang cập nhật..."
                  : selectedTable.is_active === false
                    ? "Kích hoạt"
                    : "Ngừng bàn"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(event) => {
                  openQrDialog(event.currentTarget)
                  onRegenerateTableQr(selectedTable._id)
                }}
                disabled={isBusy}
                iconName={isRegeneratingQr ? "Loader2" : "QrCode"}
                iconPosition="left"
                className="h-auto min-h-11 whitespace-normal py-2 motion-reduce:[&_svg]:animate-none"
              >
                {isRegeneratingQr ? "Đang tạo QR..." : "Tạo lại QR"}
              </Button>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">QR bàn hiện tại</p>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="ScanQrCode"
                iconPosition="left"
                onClick={(event) => openQrDialog(event.currentTarget)}
                disabled={isBusy}
              >
                Xem QR và URL
              </Button>
              {!selectedTable.has_qr && (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Bàn này chưa có QR. Chọn “Tạo lại QR” để tạo mã mới.
                </p>
              )}
            </div>

            <div className="mt-auto pt-2">
              <Button
                variant="error"
                size="sm"
                fullWidth
                iconName={isDeleting ? "Loader2" : "Trash2"}
                iconPosition="left"
                onClick={() => onDeleteTable(selectedTable._id)}
                disabled={
                  selectedTable.status === "occupied" || isBusy
                }
                aria-describedby={
                  selectedTable.status === "occupied"
                    ? "occupied-table-delete-help"
                    : undefined
                }
                className="motion-reduce:[&_svg]:animate-none"
              >
                {isDeleting ? "Đang xóa..." : "Xóa bàn này"}
              </Button>
              {selectedTable.status === "occupied" && (
                <p
                  id="occupied-table-delete-help"
                  className="mt-2 text-xs leading-relaxed text-muted-foreground"
                >
                  Không thể xóa bàn đang có khách.
                </p>
              )}
            </div>

            <TableQrDialog
              open={isQrDialogOpen}
              onClose={() => setIsQrDialogOpen(false)}
              title={`QR bàn ${selectedTable.table_number}`}
              subtitle="Xem mã QR và đường dẫn để chia sẻ hoặc in tại quầy."
              qrUrl={tableQrUrl}
              emptyMessage={
                selectedTable.has_qr
                  ? "Bàn đã có QR nhưng đường dẫn chưa sẵn sàng. Hãy tạo lại QR rồi thử lại."
                  : "Bàn này chưa có QR. Hãy đóng hộp thoại và chọn “Tạo lại QR”."
              }
              triggerRef={qrTriggerRef}
            />
          </div>
        </div>
      ) : (
        <div className="flex min-h-48 flex-1 items-center justify-center p-4">
          <div className="text-center text-muted-foreground">
            <Icon
              name="MousePointer"
              size={32}
              className="mx-auto text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm font-medium">Bảng điều khiển</p>
            <p className="mt-1 text-xs leading-relaxed">
              Chọn một bàn để cấu hình chi tiết
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default TableControlPanel
