import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { createPosOrder, toOrderEndpointError } from '@/services/orders';
import type { CreatePosOrderPayload } from '@/types/domain/order';

interface UseOrderCreationParams {
  restaurantId?: string;
  onOrderCreated?: (orderNumber: string) => void;
}

interface OrderCreationInput {
  selectedOrderType: '' | 'dine_in' | 'takeaway' | 'delivery';
  selectedOrderSource: 'pos' | 'phone';
  selectedTable: string | null;
  customerName: string;
  customerPhone: string;
  orderNotes: string;
  cartItems: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
    note?: string;
  }>;
}

export const useOrderCreation = ({ restaurantId, onOrderCreated }: UseOrderCreationParams) => {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const validateOrderInput = useCallback((input: OrderCreationInput): string | null => {
    if (!restaurantId) return 'Không tìm thấy thông tin nhà hàng';
    if (input.cartItems.length === 0) return 'Giỏ hàng đang trống';
    if (!input.selectedOrderType) return 'Vui lòng chọn loại đơn';
    if (input.selectedOrderType === 'dine_in' && !input.selectedTable) {
      return 'Vui lòng chọn bàn cho đơn tại quán';
    }
    return null;
  }, [restaurantId]);

  const createOrder = useCallback(
    async (input: OrderCreationInput) => {
      const validationError = validateOrderInput(input);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const payload: CreatePosOrderPayload = {
        order_type: input.selectedOrderType as 'dine_in' | 'takeaway' | 'delivery',
        source: input.selectedOrderSource,
        table_id: input.selectedOrderType === 'dine_in' ? input.selectedTable ?? undefined : undefined,
        customer_name: input.customerName.trim() || undefined,
        customer_phone: input.customerPhone.trim() || undefined,
        notes: input.orderNotes.trim() || undefined,
        items: input.cartItems.map((item) => ({
          menu_item_id: item._id,
          quantity: item.quantity,
          notes: item.note?.trim() ? item.note.trim() : undefined,
        })),
      };

      try {
        setIsCreatingOrder(true);
        const created = await createPosOrder(restaurantId!, payload);
        setOrderNumber(created.order_number);
        toast.success(`Đã tạo đơn ${created.order_number}`);
        onOrderCreated?.(created.order_number);
      } catch (error) {
        toast.error(toOrderEndpointError('create', error).message);
      } finally {
        setIsCreatingOrder(false);
      }
    },
    [restaurantId, onOrderCreated, validateOrderInput]
  );

  return {
    isCreatingOrder,
    orderNumber,
    createOrder,
    setOrderNumber,
  };
};
