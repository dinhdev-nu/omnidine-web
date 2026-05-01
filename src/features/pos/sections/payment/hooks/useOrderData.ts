import { useEffect, useState } from 'react';
import { getOrderDetail, toOrderEndpointError } from '@/services/orders';
import type { Order } from '@/types/order-type';

interface UseOrderDataResult {
  orderData: Order | null;
  isLoading: boolean;
  error: string;
}

export function useOrderData(restaurantId: string, orderId: string): UseOrderDataResult {
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    if (!orderId.trim()) {
      setOrderData(null);
      setError('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    void (async () => {
      try {
        const detailOrder = await getOrderDetail(restaurantId, orderId);
        if (!isActive) return;
        setOrderData(detailOrder);
      } catch (err) {
        if (!isActive) return;
        setOrderData(null);
        setError(toOrderEndpointError('detail', err).message);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [restaurantId, orderId]);

  return { orderData, isLoading, error };
}
