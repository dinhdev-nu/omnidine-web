import type { Order } from '@/types/domain/order';

export const generateIdempotencyKey = (): string => crypto.randomUUID();

export interface SummaryItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  notes: string;
}

export const mapOrderItemsToSummaryItems = (order?: Order | null): SummaryItem[] => {
  if (!order) return [];

  return order.items.map((item) => ({
    itemId: item._id ?? item.menu_item_id,
    name: item.item_name,
    quantity: item.quantity,
    price: item.unit_price,
    total: item.total_price,
    notes: item.notes ?? '',
  }));
};

export const generateQRCodeUrl = (
  orderNumber: string,
  method: string,
  totalAmount: number,
  idempotencyKey: string
): string => {
  const payload = `PAY|${orderNumber}|${method}|${totalAmount}|${idempotencyKey}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(payload)}`;
};
