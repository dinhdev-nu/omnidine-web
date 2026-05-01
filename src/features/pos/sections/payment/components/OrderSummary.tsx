import React from 'react';
import Icon from '@/components/AppIcon';

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
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

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
}) => (
  <div className="bg-surface border border-border rounded-lg p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-foreground">Chi tiết đơn hàng</h3>
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
      {orderItems.map((item) => (
        <div
          key={item.itemId}
          className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-foreground">{item.name}</span>
              <span className="text-sm text-muted-foreground">x{item.quantity}</span>
            </div>
            {item.notes && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                Ghi chú: {item.notes}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="font-medium text-foreground">{formatCurrency(item.total)}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}/món</p>
          </div>
        </div>
      ))}
    </div>

    {/* Order Summary */}
    <div className="space-y-3 pt-4 border-t border-border">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tạm tính:</span>
        <span className="text-foreground">{formatCurrency(subtotal)}</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Giảm giá {discountType === 'percent' ? `(${(discountValue * 100).toFixed(0)}%)` : ''}:
          </span>
          <span className={discount > 0 ? 'text-success' : 'text-foreground'}>-{formatCurrency(discount)}</span>
        </div>
        {discountRef && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Mã: {discountRef}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Thuế VAT ({(taxRate * 100).toFixed(0)}%):</span>
        <span className="text-foreground">{formatCurrency(tax)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Phí dịch vụ ({(serviceChargeRate * 100).toFixed(0)}%):</span>
        <span className="text-foreground">{formatCurrency(serviceChargeAmount)}</span>
      </div>
      <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
        <span className="text-foreground">Tổng cộng:</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>
    </div>

    {/* Time Info */}
    <div className="mt-6 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Icon name="Clock" size={16} />
        <span>Thời gian: {new Date().toLocaleString('vi-VN')}</span>
      </div>
    </div>
  </div>
);

export default OrderSummary;
