import React, { useState } from "react"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import Icon from "@/components/AppIcon"
import type { PosTablePosition, TableListItem } from "@/types/domain/table"
import Button from "../../../ui/Button"
import DraggableTable from "./DraggableTable"
import TableCard from "./TableCard"

interface TableLayoutProps {
  tables: TableListItem[]
  tablePositions: Record<string, PosTablePosition>
  currentOccupancyByTableId: Record<string, number>
  selectedTable?: TableListItem | null
  isLoading?: boolean
  errorMessage?: string | null
  hasActiveFilters?: boolean
  onTableSelect: (table: TableListItem | null) => void
  onTableClick: (table: TableListItem) => void
  onTableMove: (id: string, pos: PosTablePosition) => void
  onRetry?: () => void
  onClearFilters?: () => void
}

const TableLayout: React.FC<TableLayoutProps> = ({
  tables,
  tablePositions,
  currentOccupancyByTableId,
  selectedTable,
  isLoading = false,
  errorMessage,
  hasActiveFilters = false,
  onTableSelect,
  onTableClick,
  onTableMove,
  onRetry,
  onClearFilters,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [scale, setScale] = useState(1)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    if (delta.x !== 0 || delta.y !== 0) {
      const table = tables.find((item) => item._id === String(active.id))
      if (table) {
        const currentPosition = tablePositions[table._id] ?? { x: 0, y: 0 }
        onTableMove(String(active.id), {
          x: Math.round(currentPosition.x + delta.x / scale),
          y: Math.round(currentPosition.y + delta.y / scale),
        })
      }
    }
    setActiveId(null)
  }

  const handleLayoutPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).dataset.tableLayout === "true") {
      onTableSelect(null)
    }
  }

  const handleZoomIn = () => setScale((current) => Math.min(current + 0.1, 2))
  const handleZoomOut = () =>
    setScale((current) => Math.max(current - 0.1, 0.4))
  const handleZoomReset = () => setScale(1)

  const activeTable = activeId
    ? tables.find((table) => table._id === activeId)
    : null

  const showBlockingState = tables.length === 0

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => setActiveId(String(event.active.id))}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/30">
        {tables.length > 0 && (
          <div
            className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5 rounded-lg border border-border bg-surface/90 p-1.5 shadow-lg backdrop-blur-sm transition-opacity motion-reduce:transition-none sm:bottom-6 sm:right-6"
            aria-label="Điều khiển thu phóng sơ đồ"
          >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={scale >= 2}
            aria-label="Phóng to sơ đồ"
            aria-controls="table-floor-plan"
            title="Phóng to sơ đồ"
          >
            <Icon name="ZoomIn" size={18} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomReset}
            disabled={scale === 1}
            aria-label={`Khôi phục mức thu phóng về 100%. Hiện tại ${Math.round(scale * 100)}%`}
            aria-controls="table-floor-plan"
            title="Khôi phục mức thu phóng"
            className="text-[10px] font-bold tracking-tighter text-muted-foreground"
          >
            {Math.round(scale * 100)}%
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={scale <= 0.4}
            aria-label="Thu nhỏ sơ đồ"
            aria-controls="table-floor-plan"
            title="Thu nhỏ sơ đồ"
          >
            <Icon name="ZoomOut" size={18} aria-hidden="true" />
          </Button>
          </div>
        )}

        <div
          id="table-floor-plan"
          role="region"
          aria-label="Sơ đồ vị trí bàn. Có thể cuộn theo hai chiều."
          tabIndex={0}
          className="flex-1 overflow-auto outline-none [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary [&::-webkit-scrollbar]:hidden"
          onPointerDown={handleLayoutPointerDown}
        >
          <div
            data-table-layout="true"
            className="relative min-h-[1200px] min-w-[1200px] origin-top-left transition-transform duration-200 ease-out motion-reduce:transition-none sm:min-h-[2000px] sm:min-w-[2000px]"
            style={{
              transform: `scale(${scale})`,
              backgroundImage: `
                linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          >
            {tables.map((table) => (
              <DraggableTable
                key={table._id}
                table={table}
                position={tablePositions[table._id] ?? { x: 0, y: 0 }}
                currentOccupancy={
                  currentOccupancyByTableId[table._id] ?? 0
                }
                isSelected={selectedTable?._id === table._id}
                isActive={activeId === table._id}
                onTableClick={onTableClick}
              />
            ))}
          </div>
        </div>

        {showBlockingState && (
          <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center p-4">
            {isLoading ? (
              <div
                role="status"
                aria-live="polite"
                className="flex max-w-sm flex-col items-center gap-3 rounded-lg border border-border bg-surface/95 p-5 text-center shadow-sm"
              >
                <Icon
                  name="Loader2"
                  size={32}
                  className="animate-spin text-primary motion-reduce:animate-none"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-foreground">
                  Đang tải danh sách bàn...
                </p>
              </div>
            ) : errorMessage ? (
              <div
                role="alert"
                className="pointer-events-auto flex max-w-sm flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-surface/95 p-5 text-center shadow-sm"
              >
                <Icon
                  name="AlertCircle"
                  size={32}
                  className="text-destructive"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    Không thể tải danh sách bàn
                  </p>
                  <p className="mt-1 break-words text-sm text-muted-foreground">
                    {errorMessage}
                  </p>
                </div>
                {onRetry && (
                  <Button
                    variant="outline"
                    iconName="RefreshCcw"
                    iconPosition="left"
                    onClick={onRetry}
                  >
                    Thử lại
                  </Button>
                )}
              </div>
            ) : (
              <div
                role="status"
                className="pointer-events-auto flex max-w-sm flex-col items-center gap-3 rounded-lg border border-border bg-surface/95 p-5 text-center shadow-sm"
              >
                <Icon
                  name="Table"
                  size={48}
                  className="text-muted-foreground"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-foreground">
                    {hasActiveFilters
                      ? "Không tìm thấy bàn phù hợp"
                      : "Chưa có bàn nào"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {hasActiveFilters
                      ? "Hãy điều chỉnh hoặc xóa bộ lọc để xem các bàn khác."
                      : "Chọn “Thêm bàn mới” ở phía trên để bắt đầu."}
                  </p>
                </div>
                {hasActiveFilters && onClearFilters && (
                  <Button
                    variant="outline"
                    iconName="X"
                    iconPosition="left"
                    onClick={onClearFilters}
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <DragOverlay>
          {activeTable ? (
            <div
              className="opacity-80"
              style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}
            >
              <TableCard
                table={activeTable}
                currentOccupancy={
                  currentOccupancyByTableId[activeTable._id] ?? 0
                }
                isDragging
              />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

export default TableLayout
