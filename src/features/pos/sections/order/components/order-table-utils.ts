import type { Order } from '@/types/domain/order';

export const DEFAULT_CUSTOMER_NAME = 'Khách Vãng Lai';

export function getCustomerDisplayName(order: Pick<Order, 'customer_name'>): string {
  const customerName = order.customer_name?.trim();
  return customerName || DEFAULT_CUSTOMER_NAME;
}

export function getOrderTypeLabel(orderType: Order['order_type']): string {
  switch (orderType) {
    case 'dine_in':
      return 'Tại bàn';
    case 'takeaway':
      return 'Mang đi';
    case 'delivery':
      return 'Giao hàng';
    case 'online':
      return 'Online';
    default:
      return orderType;
  }
}

export function getOrderSourceLabel(source: Order['source']): string {
  switch (source) {
    case 'pos':
      return 'POS';
    case 'online':
      return 'Online';
    case 'qr':
      return 'QR';
    case 'app':
      return 'App';
    case 'phone':
      return 'Điện thoại';
    default:
      return source;
  }
}