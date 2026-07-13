import React from "react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import type {
  TablePosition,
  TableListItem,
  TableStatus,
} from "@/types/domain/table"
import TableCard from "./TableCard"

interface DraggableTableProps {
  table: TableListItem
  position: TablePosition
  currentOccupancy: number
  isSelected?: boolean
  isActive?: boolean
  onTableClick: (table: TableListItem) => void
}

const STATUS_LABEL: Record<TableStatus, string> = {
  available: "trống",
  occupied: "có khách",
  reserved: "đã đặt",
  cleaning: "đang dọn dẹp",
  inactive: "ngừng hoạt động",
}

const DraggableTable: React.FC<DraggableTableProps> = ({
  table,
  position,
  currentOccupancy,
  isSelected = false,
  isActive = false,
  onTableClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: table._id })

  const visualStatus: TableStatus =
    table.is_active === false ? "inactive" : table.status

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging || isActive ? 50 : 10,
    cursor: isDragging ? "grabbing" : "grab",
    opacity: isDragging ? 0 : 1,
    transition: "none",
  }

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      className={cn(
        "group touch-none select-none rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      {...attributes}
      {...listeners}
      aria-label={`Bàn ${table.table_number}, ${STATUS_LABEL[visualStatus]}, ${currentOccupancy} trên ${table.capacity} khách. Nhấn để chọn; dùng phím cách rồi phím mũi tên để di chuyển.`}
      aria-pressed={isSelected}
      onClick={() => onTableClick(table)}
    >
      <TableCard
        table={table}
        currentOccupancy={currentOccupancy}
        isDragging={isDragging || isActive}
      />
    </button>
  )
}

export default DraggableTable
