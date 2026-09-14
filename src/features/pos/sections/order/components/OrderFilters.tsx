import React from 'react';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import type { OrderStatus, OrderPaymentStatus, OrderSource } from '@/types/domain/order';

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

// ── Component ──────────────────────────────────────────────────────────────────

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => (
  <section aria-labelledby="order-filters-heading" className="rounded-lg border border-border bg-card p-3 sm:p-4">
    <div className="mb-3 flex flex-col gap-3 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
      <h2 id="order-filters-heading" className="text-lg font-semibold text-foreground">Bộ lọc tìm kiếm</h2>
      <div className="flex">
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onClearFilters}
          className="w-full hover-scale min-[390px]:w-auto"
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      <Input
        type="date"
        label="Ngày"
        name="order-date"
        autoComplete="off"
        value={filters.date}
        onChange={(e) => onFilterChange('date', e.target.value)}
        className="w-full"
      />
      <Select
        label="Trạng thái đơn"
        name="order-status"
        options={STATUS_OPTIONS}
        value={filters.status ?? 'all'}
        onChange={(event) => onFilterChange('status', event.target.value)}
        className="w-full"
      />
      <Select
        label="TT Thanh toán"
        name="order-payment-status"
        options={PAYMENT_STATUS_OPTIONS}
        value={filters.paymentStatus ?? 'all'}
        onChange={(event) => onFilterChange('paymentStatus', event.target.value)}
        className="w-full"
      />
      <Input
        type="search"
        label="Mã bàn"
        name="order-table"
        autoComplete="off"
        placeholder="Nhập mã bàn…"
        value={filters.table ?? ''}
        onChange={(event) => onFilterChange('table', event.target.value)}
        className="w-full"
      />
      <Select
        label="Nguồn đơn"
        name="order-source"
        options={SOURCE_OPTIONS}
        value={filters.source ?? 'all'}
        onChange={(event) => onFilterChange('source', event.target.value)}
        className="w-full"
      />
    </div>
  </section>
);

export default OrderFilters;
