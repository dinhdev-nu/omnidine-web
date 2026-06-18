import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay, type DragEndEvent } from '@dnd-kit/core';
import type { PosTablePosition, TableListItem } from '@/types/domain/table';
import TableCard from './TableCard';
import DraggableTable from './DraggableTable';
import Icon from '@/components/AppIcon';
import Button from '../../../ui/Button';

interface TableLayoutProps {
  tables: TableListItem[];
  tablePositions: Record<string, PosTablePosition>;
  currentOccupancyByTableId: Record<string, number>;
  selectedTable?: TableListItem | null;
  onTableSelect: (table: TableListItem | null) => void;
  onTableClick: (table: TableListItem) => void;
  onTableMove: (id: string, pos: PosTablePosition) => void;
}

const TableLayout: React.FC<TableLayoutProps> = ({
  tables,
  tablePositions,
  currentOccupancyByTableId,
  selectedTable,
  onTableSelect,
  onTableClick,
  onTableMove,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (delta.x !== 0 || delta.y !== 0) {
      const table = tables.find((t) => t._id === active.id);
      if (table) {
        const currentPosition = tablePositions[table._id] ?? { x: 0, y: 0 };
        // Compensate for scale factor when dropping
        onTableMove(String(active.id), {
          x: Math.round(currentPosition.x + delta.x / scale),
          y: Math.round(currentPosition.y + delta.y / scale),
        });
      }
    }
    setActiveId(null);
  };

  const handleLayoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('table-layout')) {
      onTableSelect(null);
    }
  };

  const handleZoomIn = () => setScale(s => Math.min(s + 0.1, 2));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.1, 0.4));
  const handleZoomReset = () => setScale(1);

  const activeTable = activeId ? tables.find((t) => t._id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(String(e.active.id))}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex-1 min-w-0 min-h-0 bg-muted/30 relative overflow-hidden flex flex-col">

        {/* Zoom Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-1.5 bg-surface/90 backdrop-blur-sm border border-border rounded-lg shadow-lg p-1.5 z-10 transition-opacity">
          <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Thu phóng lớn"><Icon name="ZoomIn" size={18} /></Button>
          <Button variant="ghost" size="icon" onClick={handleZoomReset} title="Khôi phục zoom" className="w-8 h-8 px-0 text-[10px] font-bold text-muted-foreground flex items-center justify-center tracking-tighter">
            {Math.round(scale * 100)}%
          </Button>
          <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Thu phóng nhỏ"><Icon name="ZoomOut" size={18} /></Button>
        </div>

        {/* Scrollable Layout Container */}
        <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" onClick={handleLayoutClick}>
          {/* Zoomable Container Grid */}
          <div
            className="table-layout min-w-[2000px] min-h-[2000px] relative transition-transform duration-200 ease-out origin-top-left"
            style={{
              transform: `scale(${scale})`,
              backgroundImage: `
                linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          >
            {tables.map((table) => (
              <DraggableTable
                key={table._id}
                table={table}
                position={tablePositions[table._id] ?? { x: 0, y: 0 }}
                currentOccupancy={currentOccupancyByTableId[table._id] ?? 0}
                isSelected={selectedTable?._id === table._id}
                isActive={activeId === table._id}
                onTableClick={onTableClick}
              />
            ))}

            {tables.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <Icon name="Table" size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Chưa có bàn nào</h3>
                  <p className="text-muted-foreground">Thêm bàn mới từ bảng điều khiển bên phải</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTable ? (
            <div className="opacity-80" style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
              <TableCard
                table={activeTable}
                currentOccupancy={currentOccupancyByTableId[activeTable._id] ?? 0}
                onTableClick={() => { }}
                isDragging
              />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default TableLayout;
