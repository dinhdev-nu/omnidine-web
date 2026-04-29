import React from 'react';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import type { OrderStatus, OrderPaymentStatus, OrderSource } from '@/types/order-type';

/**
 * UI-specific filter values
 * Uses camelCase for consistency with UI, but maps to API snake_case via hook
 */
export interface OrderFiltersValues {
  // API-aligned fields (camelCase for UI)
  status?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
  table?: string;
  source?: OrderSource;
  date?: string;

}

interface OrderFiltersProps {
  filters: OrderFiltersValues;
  onFilterChange: (field: keyof OrderFiltersValues, value: string) => void;
  onClearFilters: () => void;
}

// ── Static options ─────────────────────────────────────────────────────────────
// Map to actual API enum values from order-type.ts

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'preparing', label: 'Đang chuẩn bị' },
  { value: 'ready', label: 'Sẵn sàng' },
  { value: 'delivering', label: 'Đang giao' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'refunded', label: 'Đã hoàn tiền' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả TT thanh toán' },
  { value: 'unpaid', label: 'Chưa thanh toán' },
  { value: 'partial', label: 'Thanh toán một phần' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'partially_refunded', label: 'Hoàn tiền một phần' },
  { value: 'refunded', label: 'Đã hoàn tiền' },
];

const SOURCE_OPTIONS = [
  { value: 'all', label: 'Tất cả nguồn' },
  { value: 'pos', label: 'Tại quầy' },
  { value: 'online', label: 'Online' },
  { value: 'qr', label: 'QR' },
  { value: 'app', label: 'App' },
  { value: 'phone', label: 'Điện thoại' },
];

const TABLE_OPTIONS = [
  { value: 'all', label: 'Tất cả bàn' },
  { value: 'takeaway', label: 'Mang về' },
  { value: 'delivery', label: 'Giao hàng' },
  ...Array.from({ length: 20 }, (_, i) => ({
    value: `table-${i + 1}`,
    label: `Bàn ${i + 1}`,
  })),
];

// ── Component ──────────────────────────────────────────────────────────────────

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => (
  <div className="mb-3 rounded-lg border border-border bg-card p-3">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-foreground">Bộ lọc tìm kiếm</h3>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onClearFilters}
          className="hover-scale"
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>

    <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-5">
      <Input
        type="date"
        label="Ngày"
        value={filters.date}
        onChange={(e) => onFilterChange('date', e.target.value)}
        className="w-full"
      />
      <Select
        label="Trạng thái đơn"
        options={STATUS_OPTIONS}
        value={filters.status ?? 'all'}
        onChange={(event) => onFilterChange('status', event.target.value)}
        className="w-full"
      />
      <Select
        label="TT Thanh toán"
        options={PAYMENT_STATUS_OPTIONS}
        value={filters.paymentStatus ?? 'all'}
        onChange={(event) => onFilterChange('paymentStatus', event.target.value)}
        className="w-full"
      />
      <Select
        label="Bàn/Khu vực"
        options={TABLE_OPTIONS}
        value={filters.table ?? 'all'}
        onChange={(event) => onFilterChange('table', event.target.value)}
        searchable
        className="w-full"
      />
      <Select
        label="Nguồn đơn"
        options={SOURCE_OPTIONS}
        value={filters.source ?? 'all'}
        onChange={(event) => onFilterChange('source', event.target.value)}
        className="w-full"
      />
    </div>
  </div>
);

export default OrderFilters;
