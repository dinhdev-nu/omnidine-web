import React, { useRef, useState } from "react"
import Icon from "@/components/AppIcon"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { TableListItem } from "@/types/domain/table"
import Button from "../../ui/Button"
import ConfirmationDialog from "../../ui/ConfirmationDialog"
import Input from "../../ui/Input"
import Select from "../../ui/Select"
import QuickActionBar from "./components/QuickActionBar"
import TableAddModal from "./components/TableAddModal"
import TableControlPanel from "./components/TableControlPanel"
import TableLayout from "./components/TableLayout"
import { useTableManagement } from "./hooks/useTableManagement"

interface TableStats {
  total: number
  available: number
  occupied: number
  reserved: number
  cleaning: number
}

const STATUS_SUMMARIES = [
  { key: "available" as const, color: "bg-success", label: "Trống" },
  { key: "occupied" as const, color: "bg-warning", label: "Có khách" },
  { key: "reserved" as const, color: "bg-error", label: "Đã đặt" },
  { key: "cleaning" as const, color: "bg-primary", label: "Dọn dẹp" },
]

const StatsStrip: React.FC<{ stats: TableStats }> = ({ stats }) => (
  <div
    className="flex min-w-0 items-stretch gap-2 overflow-x-auto pb-1"
    aria-label={`Thống kê bàn: ${stats.total} bàn`}
  >
    {STATUS_SUMMARIES.map(({ key, color, label }) => (
      <div
        key={key}
        className="inline-flex min-h-11 min-w-24 shrink-0 items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5"
      >
        <span
          className={cn("size-2.5 shrink-0 rounded-full", color)}
          aria-hidden="true"
        />
        <span className="flex min-w-0 flex-col">
          <span className="text-[10px] font-medium uppercase leading-none text-muted-foreground">
            {label}
          </span>
          <span className="mt-1 text-base font-semibold leading-none text-foreground">
            {stats[key]}
          </span>
        </span>
      </div>
    ))}
  </div>
)

interface FilterControlsProps {
  statusFilter: string
  activeFilter: string
  capacityMinFilter: string
  capacityMaxFilter: string
  hasActiveFilters: boolean
  isLoading: boolean
  onStatusChange: (value: string) => void
  onActiveChange: (value: string) => void
  onCapacityMinChange: (value: string) => void
  onCapacityMaxChange: (value: string) => void
  onClear: () => void
  mobile?: boolean
}

const FilterControls: React.FC<FilterControlsProps> = ({
  statusFilter,
  activeFilter,
  capacityMinFilter,
  capacityMaxFilter,
  hasActiveFilters,
  isLoading,
  onStatusChange,
  onActiveChange,
  onCapacityMinChange,
  onCapacityMaxChange,
  onClear,
  mobile = false,
}) => (
  <div
    className={cn(
      "grid gap-2",
      mobile
        ? "grid-cols-1 min-[360px]:grid-cols-2"
        : "sm:grid-cols-2 xl:grid-cols-5"
    )}
  >
    <Select
      name={mobile ? "mobile_table_status_filter" : "table_status_filter"}
      value={statusFilter}
      onChange={(event) => onStatusChange(event.target.value)}
      aria-label="Lọc theo trạng thái bàn"
      disabled={isLoading}
      options={[
        { value: "all", label: "Tất cả trạng thái" },
        { value: "available", label: "Trống" },
        { value: "occupied", label: "Có khách" },
        { value: "reserved", label: "Đã đặt" },
        { value: "cleaning", label: "Dọn dẹp" },
        { value: "inactive", label: "Ngừng hoạt động" },
      ]}
    />

    <Select
      name={mobile ? "mobile_table_active_filter" : "table_active_filter"}
      value={activeFilter}
      onChange={(event) => onActiveChange(event.target.value)}
      aria-label="Lọc theo tình trạng hoạt động"
      disabled={isLoading}
      options={[
        { value: "all", label: "Tất cả hoạt động" },
        { value: "active", label: "Đang hoạt động" },
        { value: "inactive", label: "Đang ngừng" },
      ]}
    />

    <Input
      name={mobile ? "mobile_capacity_min" : "capacity_min"}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={2}
      placeholder="Sức chứa từ"
      aria-label="Sức chứa tối thiểu"
      value={capacityMinFilter}
      onChange={(event) => onCapacityMinChange(event.target.value)}
      disabled={isLoading}
    />

    <Input
      name={mobile ? "mobile_capacity_max" : "capacity_max"}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={2}
      placeholder="Sức chứa đến"
      aria-label="Sức chứa tối đa"
      value={capacityMaxFilter}
      onChange={(event) => onCapacityMaxChange(event.target.value)}
      disabled={isLoading}
    />

    <Button
      variant="outline"
      size="sm"
      iconName="X"
      iconPosition="left"
      disabled={!hasActiveFilters || isLoading}
      onClick={onClear}
      className="w-full"
    >
      Xóa bộ lọc
    </Button>
  </div>
)

const TableSection: React.FC = () => {
  const {
    tables,
    tablePositions,
    tableOccupancyById,
    selectedTable,
    selectedTableCurrentOccupancy,
    stats,
    showAddModal,
    setShowAddModal,
    isSubmittingAdd,
    isSubmittingUpdate,
    isSubmittingStatus,
    isTogglingActive,
    isRegeneratingQr,
    isDeletingTable,
    isLoadingTables,
    tableListError,
    statusFilter,
    activeFilter,
    capacityMinFilter,
    capacityMaxFilter,
    hasActiveFilters,
    handleStatusFilterChange,
    handleActiveFilterChange,
    handleCapacityMinFilterChange,
    handleCapacityMaxFilterChange,
    handleClearFilters,
    retryTableList,
    handleAutoArrange,
    handleTableMove,
    syncTableSelection,
    handleTableStatusChange,
    handleAddTable,
    handleUpdateTable,
    handleToggleTableActive,
    handleRegenerateTableQr,
    handleDeleteTable,
  } = useTableManagement()

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [tablePendingDeletion, setTablePendingDeletion] =
    useState<TableListItem | null>(null)
  const [addFormRevision, setAddFormRevision] = useState(0)
  const addTableButtonRef = useRef<HTMLButtonElement | null>(null)
  const detailsButtonRef = useRef<HTMLButtonElement | null>(null)
  const deleteTableButtonRef = useRef<HTMLElement | null>(null)

  const handleTableSelection = (table: TableListItem | null) => {
    syncTableSelection(table)
    if (!table) setIsDetailsOpen(false)
  }

  const requestTableDeletion = (id: string) => {
    const table = tables.find((item) => item._id === id)
    if (table) {
      deleteTableButtonRef.current = document.activeElement as HTMLElement | null
      setTablePendingDeletion(table)
    }
  }

  const filterProps = {
    statusFilter,
    activeFilter,
    capacityMinFilter,
    capacityMaxFilter,
    hasActiveFilters,
    isLoading: isLoadingTables,
    onStatusChange: handleStatusFilterChange,
    onActiveChange: handleActiveFilterChange,
    onCapacityMinChange: handleCapacityMinFilterChange,
    onCapacityMaxChange: handleCapacityMaxFilterChange,
    onClear: handleClearFilters,
  }

  return (
    <div className="relative h-full min-h-0 overflow-hidden">
      <div className="flex h-full min-h-0 flex-col bg-surface">
        <header className="max-h-[55dvh] shrink-0 overflow-y-auto border-b border-border bg-background/95 px-3 py-3 lg:max-h-none lg:overflow-visible lg:px-4 lg:py-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <h1 className="break-words text-lg font-semibold text-foreground md:text-xl">
                  Sơ đồ phòng ăn
                </h1>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                  Thống kê trực tiếp: {stats.total} bàn
                </p>
              </div>

              <div className="hidden min-w-0 flex-1 lg:mx-4 lg:block 2xl:mx-8">
                <StatsStrip stats={stats} />
              </div>

              <div className="grid w-full grid-cols-1 gap-2 min-[280px]:grid-cols-2 lg:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCcw"
                  iconPosition="left"
                  onClick={handleAutoArrange}
                  disabled={isLoadingTables || stats.available === 0}
                  title="Sắp xếp gọn các bàn trống"
                  className="w-full whitespace-normal"
                >
                  Gom bàn trống
                </Button>
                <Button
                  ref={addTableButtonRef}
                  variant="default"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => {
                    setAddFormRevision((current) => current + 1)
                    setShowAddModal(true)
                  }}
                  className="w-full whitespace-normal"
                >
                  Thêm bàn mới
                </Button>
              </div>
            </div>

            <details className="group lg:hidden">
              <summary className="flex min-h-11 cursor-pointer touch-manipulation list-none items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                <span>Thống kê và bộ lọc</span>
                <Icon
                  name="ChevronDown"
                  size={18}
                  className="shrink-0 transition-transform motion-reduce:transition-none group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="mt-3 flex flex-col gap-3">
                <StatsStrip stats={stats} />
                <FilterControls {...filterProps} mobile />
              </div>
            </details>

            <div className="hidden lg:block">
              <FilterControls {...filterProps} />
            </div>

            {isLoadingTables && tables.length > 0 && (
              <p
                className="text-xs text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                Đang cập nhật danh sách bàn theo bộ lọc...
              </p>
            )}

            {tableListError && tables.length > 0 && (
              <div
                className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-surface p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                role="alert"
              >
                <p className="min-w-0 break-words text-destructive">
                  {tableListError}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCcw"
                  iconPosition="left"
                  onClick={retryTableList}
                  className="shrink-0"
                >
                  Thử lại
                </Button>
              </div>
            )}
          </div>
        </header>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
          <div className="flex min-h-0 min-w-0 flex-1 border-border lg:border-r">
            <TableLayout
              tables={tables}
              tablePositions={tablePositions}
              currentOccupancyByTableId={tableOccupancyById}
              selectedTable={selectedTable}
              isLoading={isLoadingTables}
              errorMessage={tableListError}
              hasActiveFilters={hasActiveFilters}
              onTableSelect={handleTableSelection}
              onTableClick={handleTableSelection}
              onTableMove={handleTableMove}
              onRetry={retryTableList}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="hidden h-full lg:block">
            <TableControlPanel
              key={selectedTable?._id ?? "none"}
              selectedTable={selectedTable}
              isSubmittingUpdate={isSubmittingUpdate}
              isSubmittingStatus={isSubmittingStatus}
              isTogglingActive={isTogglingActive}
              isRegeneratingQr={isRegeneratingQr}
              isDeleting={isDeletingTable}
              onTableStatusChange={handleTableStatusChange}
              onUpdateTable={handleUpdateTable}
              onToggleTableActive={handleToggleTableActive}
              onRegenerateTableQr={handleRegenerateTableQr}
              onDeleteTable={requestTableDeletion}
            />
          </div>
        </div>

        <QuickActionBar
          selectedTable={selectedTable}
          selectedTableCurrentOccupancy={selectedTableCurrentOccupancy}
          isUpdatingStatus={isSubmittingStatus}
          detailsButtonRef={detailsButtonRef}
          onQuickStatusChange={handleTableStatusChange}
          onOpenDetails={() => setIsDetailsOpen(true)}
        />
      </div>

      <TableAddModal
        key={addFormRevision}
        isOpen={showAddModal}
        isSubmitting={isSubmittingAdd}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleAddTable}
        triggerRef={addTableButtonRef}
      />

      <ConfirmationDialog
        isOpen={Boolean(tablePendingDeletion)}
        onClose={() => setTablePendingDeletion(null)}
        onConfirm={() => {
          if (tablePendingDeletion) {
            handleDeleteTable(tablePendingDeletion._id)
            setTablePendingDeletion(null)
          }
        }}
        title={
          tablePendingDeletion
            ? `Xóa bàn ${tablePendingDeletion.table_number}?`
            : "Xóa bàn?"
        }
        message="Thao tác này không thể hoàn tác. Toàn bộ mã QR và cấu hình của bàn sẽ bị xóa."
        confirmText="Xóa bàn"
        cancelText="Giữ lại"
        variant="danger"
        icon="Trash2"
        isLoading={isDeletingTable}
        returnFocusRef={deleteTableButtonRef}
      />

      <Dialog
        open={isDetailsOpen && Boolean(selectedTable)}
        onOpenChange={setIsDetailsOpen}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] gap-0 overflow-hidden p-0 sm:max-w-lg"
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            detailsButtonRef.current?.focus()
          }}
        >
          <DialogHeader className="relative shrink-0 border-b border-border p-4 pr-16">
            <DialogTitle className="break-words text-lg font-semibold">
              {selectedTable
                ? `Chi tiết bàn ${selectedTable.table_number}`
                : "Chi tiết bàn"}
            </DialogTitle>
            <DialogDescription>
              Cập nhật trạng thái, thông tin và mã QR của bàn đã chọn.
            </DialogDescription>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                aria-label="Đóng chi tiết bàn"
              >
                <Icon name="X" size={20} aria-hidden="true" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="min-h-0 overflow-y-auto">
            <TableControlPanel
              key={selectedTable?._id ?? "mobile-none"}
              selectedTable={selectedTable}
              displayMode="dialog"
              isSubmittingUpdate={isSubmittingUpdate}
              isSubmittingStatus={isSubmittingStatus}
              isTogglingActive={isTogglingActive}
              isRegeneratingQr={isRegeneratingQr}
              isDeleting={isDeletingTable}
              onTableStatusChange={handleTableStatusChange}
              onUpdateTable={handleUpdateTable}
              onToggleTableActive={handleToggleTableActive}
              onRegenerateTableQr={handleRegenerateTableQr}
              onDeleteTable={requestTableDeletion}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TableSection
