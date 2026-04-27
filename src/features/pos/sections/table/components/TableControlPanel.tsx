import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import type { TableListItem, TableStatus, UpdateTablePayload } from '@/types/table-type';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import QrDialog from '../../../components/QrDialog';

interface TableControlPanelProps {
  selectedTable?: TableListItem | null;
  isSubmittingUpdate?: boolean;
  isTogglingActive?: boolean;
  isRegeneratingQr?: boolean;
  onTableStatusChange: (id: string, status: TableStatus) => void;
  onUpdateTable: (id: string, form: UpdateTablePayload) => void;
  onToggleTableActive: (id: string) => void;
  onRegenerateTableQr: (id: string) => void;
  onDeleteTable: (id: string) => void;
}

const TableControlPanel: React.FC<TableControlPanelProps> = ({
  selectedTable,
  isSubmittingUpdate = false,
  isTogglingActive = false,
  isRegeneratingQr = false,
  onTableStatusChange,
  onUpdateTable,
  onToggleTableActive,
  onRegenerateTableQr,
  onDeleteTable,
}) => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    table_number: selectedTable?.table_number ?? '',
    name: selectedTable?.name ?? '',
    notes: selectedTable?.notes ?? '',
    capacity: selectedTable?.capacity ?? 1,
  });

  const tableQrUrl = selectedTable?.qr_url
    ?? (selectedTable?.qr_code ? `${window.location.origin}/public/tables/${selectedTable.qr_code}` : null);

  const handleUpdateTable = () => {
    if (!selectedTable || !editForm.table_number.trim()) return;
    onUpdateTable(selectedTable._id, {
      table_number: editForm.table_number.trim(),
      capacity: editForm.capacity,
      name: editForm.name,
      notes: editForm.notes,
    });
  };

  return (
    <div className="w-72 2xl:w-80 bg-surface border-l border-border h-full flex flex-col relative">
      {selectedTable ? (
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 space-y-3 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Bàn {selectedTable.table_number}</h3>
            </div>

            {/* Status Control */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Trạng thái hiện tại</label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { status: 'available' as const, label: 'Trống', variant: 'success' },
                    { status: 'occupied' as const, label: 'Có khách', variant: 'warning' },
                    { status: 'reserved' as const, label: 'Đã đặt', variant: 'error' },
                    { status: 'cleaning' as const, label: 'Dọn dẹp', variant: 'default' },
                  ] as const
                ).map(({ status, label, variant }) => (
                  <Button
                    key={status}
                    variant={selectedTable.status === status ? variant : 'outline'}
                    size="sm"
                    onClick={() => onTableStatusChange(selectedTable._id, status)}
                    disabled={selectedTable.is_active === false}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t border-border">
              <label className="text-xs text-muted-foreground block">Thông số chi tiết</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  label="Số bàn"
                  placeholder="Số bàn"
                  value={editForm.table_number}
                  onChange={(e) => setEditForm((p) => ({ ...p, table_number: e.target.value }))}
                />
                <Input
                  type="number"
                  label="Sức chứa"
                  min="1"
                  max="99"
                  placeholder="Sức chứa"
                  value={editForm.capacity}
                  onChange={(e) => setEditForm((p) => ({ ...p, capacity: parseInt(e.target.value, 10) || 1 }))}
                />
              </div>
              <Input
                type="text"
                label="Tên bàn"
                placeholder="Tên bàn (không bắt buộc)"
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
              />
              <Input
                type="text"
                label="Ghi chú"
                placeholder="Ghi chú (không bắt buộc)"
                value={editForm.notes}
                onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
              />

              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Save"
                iconPosition="left"
                onClick={handleUpdateTable}
                disabled={isSubmittingUpdate || !editForm.table_number.trim()}
              >
                Cập nhật thông tin
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleTableActive(selectedTable._id)}
                disabled={isTogglingActive}
                iconName={selectedTable.is_active === false ? 'Power' : 'PowerOff'}
                iconPosition="left"
              >
                {selectedTable.is_active === false ? 'Kích hoạt' : 'Ngưng bàn'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onRegenerateTableQr(selectedTable._id);
                  setIsQrModalOpen(true);
                }}
                disabled={isRegeneratingQr}
                iconName="QrCode"
                iconPosition="left"
              >
                Tạo lại QR
              </Button>
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t border-border">
              <label className="text-xs text-muted-foreground block">QR bàn hiện tại</label>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="ScanQrCode"
                iconPosition="left"
                onClick={() => setIsQrModalOpen(true)}
              >
                Xem QR và URL
              </Button>
              {!selectedTable.has_qr && (
                <p className="text-xs text-muted-foreground">
                  Bàn này chưa có QR. Bấm Tạo lại QR để sinh mã mới rồi mở modal xem.
                </p>
              )}
            </div>

            <div className="mt-auto pt-4">
              <Button
                variant="error"
                size="sm"
                fullWidth
                iconName="Trash2"
                iconPosition="left"
                onClick={() => onDeleteTable(selectedTable._id)}
                disabled={selectedTable.status === 'occupied' || isSubmittingUpdate || isTogglingActive}
              >
                Xóa bỏ bàn này
              </Button>
            </div>

            <QrDialog
              open={isQrModalOpen}
              onClose={() => setIsQrModalOpen(false)}
              title={`QR bàn ${selectedTable.table_number}`}
              subtitle="Xem mã QR và đường dẫn để chia sẻ hoặc in tại quầy."
              qrUrl={tableQrUrl}
              emptyMessage={selectedTable.has_qr
                ? 'Bàn đã có QR. Nếu link chưa hiện, bấm Tạo lại QR để nạp đường dẫn mới.'
                : 'Bàn này chưa có QR. Bấm Tạo lại QR để sinh mã mới rồi mở lại modal.'}
              copyUrlLabel="Sao chép URL"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground p-4">
            <Icon name="MousePointer" size={32} className="mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm font-medium">Bảng điều khiển</p>
            <p className="text-xs mt-1">Chọn một bàn để cấu hình chi tiết</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableControlPanel;
