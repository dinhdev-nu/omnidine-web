import React from 'react';
import Icon from '@/components/AppIcon';

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
}

interface OrderSummaryProps {
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  discountValue?: number;
  serviceChargeAmount?: number;
  serviceChargeRate?: number;
  taxRate?: number;
  total: number;
  orderNumber?: string;
  tableNumber?: string | null;
  discountRef?: string | null;
  discountType?: 'none' | 'percent' | 'fixed' | 'coupon';
  customerName?: string | null;
  customerPhone?: string | null;
  orderType?: 'dine_in' | 'takeaway' | 'delivery' | 'online';
  source?: 'pos' | 'online' | 'qr' | 'app' | 'phone';
  notes?: string | null;
}

const formatCurrency = (amount: number): string =>
  currencyFormatter.format(amount);

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderItems,
  subtotal,
  tax,
  discount = 0,
  discountValue = 0,
  serviceChargeAmount = 0,
  serviceChargeRate = 0,
  taxRate = 0,
  total,
  orderNumber = '#001',
  tableNumber = null,
  discountRef = null,
  discountType = 'none',
}) => {
  const [renderedAt] = React.useState(() => new Date().toLocaleString('vi-VN'));

  return (
  <div className="min-w-0 rounded-lg border border-border bg-surface p-3 sm:p-4 md:p-6">
    <div className="mb-6 flex flex-col gap-2 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
      <h2 className="text-lg font-semibold text-foreground">Chi tiết đơn hàng</h2>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="text-xs">Đơn hàng: {orderNumber}</span>
        {tableNumber && (
          <>
            <span>•</span>
            <span className="text-xs">Bàn: {tableNumber}</span>
          </>
        )}
      </div>
    </div>

    {/* Order Items */}
    <div className="mb-6 max-h-64 space-y-3 overflow-y-auto overscroll-contain">
      {orderItems.map((item) => (
        <div
          key={item.itemId}
          className="flex min-w-0 items-start justify-between gap-3 border-b border-border py-2 last:border-b-0"
        >
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <span className="break-words font-medium text-foreground">{item.name}</span>
              <span className="text-sm text-muted-foreground">x{item.quantity}</span>
            </div>
            {item.notes && (
              <p className="mt-1 break-words text-xs text-muted-foreground italic">
                Ghi chú: {item.notes}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="font-medium text-foreground tabular-nums">{formatCurrency(item.total)}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}/món</p>
          </div>
        </div>
      ))}
    </div>

    {/* Order Summary */}
    <div className="space-y-3 border-t border-border pt-4">
      <div className="flex min-w-0 justify-between gap-3 text-sm">
        <span className="text-muted-foreground">Tạm tính:</span>
        <span className="text-foreground">{formatCurrency(subtotal)}</span>
      </div>
      <div className="space-y-1">
        <div className="flex min-w-0 justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            Giảm giá {discountType === 'percent' ? `(${(discountValue * 100).toFixed(0)}%)` : ''}:
          </span>
          <span className={discount > 0 ? 'text-success' : 'text-foreground'}>-{formatCurrency(discount)}</span>
        </div>
        {discountRef && (
          <div className="flex min-w-0 justify-between gap-3 text-xs text-muted-foreground">
            <span>Mã: {discountRef}</span>
          </div>
        )}
      </div>
      <div className="flex min-w-0 justify-between gap-3 text-sm">
        <span className="text-muted-foreground">Thuế VAT ({(taxRate * 100).toFixed(0)}%):</span>
        <span className="text-foreground">{formatCurrency(tax)}</span>
      </div>
      <div className="flex min-w-0 justify-between gap-3 text-sm">
        <span className="text-muted-foreground">Phí dịch vụ ({(serviceChargeRate * 100).toFixed(0)}%):</span>
        <span className="text-foreground">{formatCurrency(serviceChargeAmount)}</span>
      </div>
      <div className="flex min-w-0 justify-between gap-3 border-t border-border pt-2 text-lg font-semibold">
        <span className="text-foreground">Tổng cộng:</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>
    </div>

    {/* Time Info */}
    <div className="mt-6 rounded-lg bg-muted/30 p-3">
      <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <Icon name="Clock" size={16} aria-hidden="true" />
        <span>Thời gian: {renderedAt}</span>
      </div>
    </div>
  </div>
  );
};

export default OrderSummary;
