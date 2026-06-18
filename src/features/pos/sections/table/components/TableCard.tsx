import React from 'react';
import Icon from '@/components/AppIcon';
import type { TableListItem, TableStatus } from '@/types/domain/table';

interface TableCardProps {
  table: TableListItem;
  currentOccupancy: number;
  onTableClick: (table: TableListItem) => void;
  isDragging?: boolean;
}

// ── Style maps ────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<TableStatus, string> = {
  available: 'bg-success text-success-foreground',
  occupied: 'bg-warning text-warning-foreground',
  reserved: 'bg-error text-error-foreground',
  cleaning: 'bg-primary text-primary-foreground',
  inactive: 'bg-muted text-muted-foreground',
};

const STATUS_ICON: Record<TableStatus, string> = {
  available: 'CheckCircle',
  occupied: 'Users',
  reserved: 'Clock',
  cleaning: 'Sparkles',
  inactive: 'PowerOff',
};

// ── Component ─────────────────────────────────────────────────────────────────

const TableCard: React.FC<TableCardProps> = ({
  table,
  currentOccupancy,
  onTableClick,
  isDragging = false,
}) => {
  const visualStatus: TableStatus = table.is_active === false ? 'inactive' : table.status;

  return (
    <button
      type="button"
      aria-label={`Chon ban ${table.table_number}`}
      className={`
        relative bg-surface border-2 p-2 pt-3
        transition-all duration-200 hover:shadow-interactive
        rounded-lg w-36 min-h-[8rem] h-auto
        ${isDragging ? 'opacity-50 scale-95' : 'hover:scale-105 border-border'}
        flex flex-col items-center justify-center
      `}
      onClick={() => onTableClick(table)}
    >

      {/* Table Number */}
      <div className="text-lg font-bold text-foreground mb-1">{table.table_number}</div>

      {/* Table Name */}
      <div className="mb-1 max-w-full px-2 text-center text-xs font-medium text-muted-foreground truncate">
        {table.name || 'Chua dat ten'}
      </div>

      {/* Status Indicator */}
      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${STATUS_COLOR[visualStatus] ?? 'bg-muted text-muted-foreground'}`}>
        <Icon name={STATUS_ICON[visualStatus] ?? 'Circle'} size={12} />
      </div>

      {/* Capacity */}
      <div className="text-xs text-muted-foreground flex items-center">
        <Icon name="Users" size={10} className="mr-1" />
        {currentOccupancy}/{table.capacity}
      </div>

    </button>
  );
};

export default TableCard;
