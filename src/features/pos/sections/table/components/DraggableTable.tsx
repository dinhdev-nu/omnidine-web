import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { TablePosition, TableListItem } from '@/types/table-type';
import TableCard from './TableCard';

interface DraggableTableProps {
  table: TableListItem;
  position: TablePosition;
  currentOccupancy: number;
  isSelected?: boolean;
  isActive?: boolean;
  onTableClick: (table: TableListItem) => void;
}

const DraggableTable: React.FC<DraggableTableProps> = ({
  table,
  position,
  currentOccupancy,
  isSelected = false,
  isActive = false,
  onTableClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: table._id,
  });

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging || isActive ? 50 : 10,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0 : 1,
    transition: 'none',
  };

  const handleClick = (clickedTable: TableListItem) => {
    onTableClick(clickedTable);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        select-none !cursor-grab active:!cursor-grabbing
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
      {...listeners}
      {...attributes}
    >
      <TableCard
        table={table}
        currentOccupancy={currentOccupancy}
        onTableClick={handleClick}
        isDragging={isDragging || isActive}
      />
    </div>
  );
};

export default DraggableTable;
