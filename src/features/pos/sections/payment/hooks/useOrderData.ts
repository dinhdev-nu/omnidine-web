import { useEffect, useState } from 'react';
import { getOrderDetail, toOrderEndpointError } from '@/services/orders';
import type { Order } from '@/types/domain/order';

interface UseOrderDataResult {
  orderData: Order | null;
  isLoading: boolean;
  error: string;
}

interface OrderDataState extends UseOrderDataResult {
  requestKey: string;
}

const getInitialOrderDataState = (requestKey: string): OrderDataState => ({
  requestKey,
  orderData: null,
  isLoading: Boolean(requestKey),
  error: '',
});

export function useOrderData(restaurantId: string, orderId: string): UseOrderDataResult {
  const trimmedOrderId = orderId.trim();
  const requestKey = restaurantId && trimmedOrderId ? `${restaurantId}:${trimmedOrderId}` : '';
  const [storedState, setStoredState] = useState<OrderDataState>(() =>
    getInitialOrderDataState(requestKey)
  );
  let state = storedState;

  if (storedState.requestKey !== requestKey) {
    state = getInitialOrderDataState(requestKey);
    setStoredState(state);
  }

  useEffect(() => {
    let isActive = true;

    if (!requestKey) return;

    void (async () => {
      try {
        const detailOrder = await getOrderDetail(restaurantId, trimmedOrderId);
        if (!isActive) return;
        setStoredState((current) =>
          current.requestKey === requestKey
            ? {
                requestKey,
                orderData: detailOrder,
                isLoading: false,
                error: '',
              }
            : current
        );
      } catch (err) {
        if (!isActive) return;
        setStoredState((current) =>
          current.requestKey === requestKey
            ? {
                requestKey,
                orderData: null,
                isLoading: false,
                error: toOrderEndpointError('detail', err).message,
              }
            : current
        );
      }
    })();

    return () => {
      isActive = false;
    };
  }, [requestKey, restaurantId, trimmedOrderId]);

  return {
    orderData: state.orderData,
    isLoading: state.isLoading,
    error: state.error,
  };
}
