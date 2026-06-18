import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  listOrders,
  getOrderDetail,
  updateOrderStatus,
  updateOrderItemStatus,
  cancelOrderItem,
  updateOrderDiscount,
  cancelOrder,
  toOrderEndpointError,
} from '@/services/orders';
import { useRequiredPosData } from '@/features/pos/contexts/usePosContext';
import type {
  ListOrdersQuery,
  OrderListItem,
  OrderStatus,
  AllowedOrderStatusUpdate,
  OrderPaymentStatus,
  OrderSource,
  Order,
  AllowedOrderItemStatusUpdate,
  OrderDiscountType,
} from '@/types/domain/order';

/**
 * UI-specific filters (camelCase for consistency, maps to API via converter)
 */
interface UIFilters {
  status?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
  table?: string;
  source?: OrderSource;
  date?: string;
  page?: number;
  limit?: number;
}

function getTodayLocalDate(): string {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

/**
 * Adapter: Convert API OrderListItem to Order type (with placeholder data for missing fields)
 */
function adaptOrderListItemToOrder(item: OrderListItem): Order {
  const customerName = item.customer_name?.trim();

  return {
    _id: item._id,
    order_number: item.order_number,
    created_at: item.created_at,
    updated_at: item.created_at,
    restaurant_id: '',
    order_type: item.order_type,
    status: item.status,
    payment_status: item.payment_status,
    items: [],
    subtotal: 0,
    discount_type: 'none',
    discount_value: 0,
    discount_amount: 0,
    tax_rate: 0,
    tax_amount: 0,
    service_charge_rate: 0,
    service_charge_amount: 0,
    total_amount: item.total_amount,
    currency: item.currency,
    source: item.source,
    table_id: item.table_id,
    customer_name: customerName || 'Khách Vãng Lai',
    staff_id: undefined,
    notes: undefined,
  };
}

/**
 * Adapter: Convert full API Order to UI Order interface
 * Note: API Order object is stored directly in selectedOrder state (not adapted)
 */

interface UseOrderManagementReturn {
  // Data
  orders: Order[];
  selectedOrder: Order | null;
  filters: UIFilters;
  isLoadingOrders: boolean;
  isLoadingDetail: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  totalFetched: number;
  pagination: { page: number; limit: number; total: number; total_pages: number };

  // Handlers
  onFilterChange: (newFilters: Partial<UIFilters>) => void;
  onViewDetails: (order: Order) => Promise<void>;
  onLoadOrderDetail: (orderId: string) => Promise<Order>;
  onUpdateOrderStatus: (order: Order, status: AllowedOrderStatusUpdate) => Promise<void>;
  onCancelOrder: (order: Order, reason?: string) => Promise<void>;
  onUpdateOrderItemStatus: (order: Order, itemId: string, status: AllowedOrderItemStatusUpdate) => Promise<void>;
  onCancelOrderItem: (order: Order, itemId: string, reason?: string) => Promise<void>;
  onUpdateOrderDiscount: (
    order: Order,
    type: OrderDiscountType,
    value: number,
    discountRef?: string
  ) => Promise<void>;
  onLoadMore: () => Promise<void>;
  onClearFilters: () => void;
  onRefresh: () => Promise<void>;

  // UI state
  activeFiltersCount: number;
}

const DEFAULT_FILTERS: UIFilters = {
  date: getTodayLocalDate(),
  page: 1,
  limit: 50,
};

/**
 * Convert UI filters (camelCase) to API ListOrdersQuery (snake_case)
 */
function convertUIFiltersToQuery(filters: UIFilters): ListOrdersQuery {
  const query: ListOrdersQuery = {
    page: filters.page || 1,
    limit: filters.limit || 50,
  };

  // Map API fields from camelCase to snake_case
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.paymentStatus) {
    query.payment_status = filters.paymentStatus;
  }
  if (filters.table) {
    query.table_id = filters.table;
  }
  if (filters.source) {
    query.source = filters.source;
  }

  if (filters.date) {
    query.date = filters.date;
  }

  return query;
}

const DEFAULT_PAGINATION = { page: 1, limit: 50, total: 0, total_pages: 0 };

export function useOrderManagement(): UseOrderManagementReturn {
  const posData = useRequiredPosData();
  const restaurantId = posData.restaurant._id;

  // State: Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState<UIFilters>(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  // State: Loading
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /**
   * Fetch orders list with filters
   */
  const fetchOrders = useCallback(
    async (page = 1, append = false, overrideFilters?: UIFilters) => {
      try {
        setIsLoadingOrders(!append);
        setIsLoadingMore(append);
        // Convert UI filters to API query
        const filtersToUse = overrideFilters || filters;
        const query = convertUIFiltersToQuery({
          ...filtersToUse,
          page,
          limit: pagination.limit,
        });

        const response = await listOrders(restaurantId, query);

        // Update pagination
        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          total_pages: response.pagination.total_pages,
        });

        // Adapt data
        const adaptedOrders = response.data.map(adaptOrderListItemToOrder);

        if (append) {
          setOrders((prev) => [...prev, ...adaptedOrders]);
        } else {
          setOrders(adaptedOrders);
        }

      } catch (error) {
        toast.error(toOrderEndpointError('list', error).message);
      } finally {
        setIsLoadingOrders(false);
        setIsLoadingMore(false);
      }
    },
    [restaurantId, pagination.limit, filters]
  );

  /**
   * Fetch order detail
   */
  const loadOrderDetail = useCallback(
    async (orderId: string) => {
      try {
        const apiOrder = await getOrderDetail(restaurantId, orderId);
        return apiOrder;
      } catch (error) {
        toast.error(toOrderEndpointError('detail', error).message);
        throw error;
      }
    },
    [restaurantId]
  );

  /**
   * Initialize: fetch orders on mount
   */
  React.useEffect(() => {
    void fetchOrders(1, false, DEFAULT_FILTERS);
  }, [fetchOrders]);

  // Handlers
  const handleFilterChange = useCallback(
    (newFilters: Partial<UIFilters>) => {
      const normalizedFilters = Object.fromEntries(
        Object.entries(newFilters).map(([key, value]) => [
          key,
          value === 'all' ? undefined : value,
        ])
      ) as Partial<UIFilters>;

      const updatedFilters = { ...filters, ...normalizedFilters };
      setFilters(updatedFilters);
      setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
      void fetchOrders(1, false, updatedFilters);
    },
    [filters, fetchOrders]
  );

  const handleViewDetails = useCallback(
    async (order: Order) => {
      try {
        setIsLoadingDetail(true);
        const apiOrder = await loadOrderDetail(order._id);
        setSelectedOrder(apiOrder);
      } catch {
        // Error already toasted
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [loadOrderDetail]
  );

  const handleLoadOrderDetail = useCallback(
    async (orderId: string) => loadOrderDetail(orderId),
    [loadOrderDetail]
  );

  const handleUpdateOrderStatus = useCallback(
    async (order: Order, status: AllowedOrderStatusUpdate) => {
      try {
        await updateOrderStatus(restaurantId, order._id, { status });
        toast.success(`Đã cập nhật đơn ${order.order_number} sang trạng thái mới`);
        void fetchOrders(pagination.page);
      } catch (error) {
        toast.error(toOrderEndpointError('update-status', error).message);
      }
    },
    [restaurantId, pagination.page, fetchOrders]
  );

  const handleUpdateOrderItemStatus = useCallback(
    async (order: Order, itemId: string, status: AllowedOrderItemStatusUpdate) => {
      try {
        await updateOrderItemStatus(restaurantId, order._id, itemId, { status });
        toast.success('Đã cập nhật trạng thái món');
      } catch (error) {
        toast.error(toOrderEndpointError('update-item-status', error).message);
        throw error;
      }
    },
    [restaurantId]
  );

  const handleCancelOrderItem = useCallback(
    async (order: Order, itemId: string, reason?: string) => {
      try {
        await cancelOrderItem(restaurantId, order._id, itemId, { cancel_reason: reason });
        toast.success('Đã hủy món trong đơn');
      } catch (error) {
        toast.error(toOrderEndpointError('cancel-item', error).message);
        throw error;
      }
    },
    [restaurantId]
  );

  const handleUpdateOrderDiscount = useCallback(
    async (order: Order, type: OrderDiscountType, value: number, discountRef?: string) => {
      try {
        await updateOrderDiscount(restaurantId, order._id, {
          discount_type: type,
          discount_value: value,
          discount_ref: discountRef?.trim() || undefined,
        });
        toast.success('Đã cập nhật giảm giá đơn hàng');
        void fetchOrders(pagination.page);
      } catch (error) {
        toast.error(toOrderEndpointError('update-discount', error).message);
        throw error;
      }
    },
    [restaurantId, pagination.page, fetchOrders]
  );

  const handleLoadMore = useCallback(async () => {
    const nextPage = pagination.page + 1;
    if (nextPage <= pagination.total_pages) {
      await fetchOrders(nextPage, true);
    }
  }, [pagination, fetchOrders]);

  const handleCancelOrder = useCallback(
    async (order: Order, reason?: string) => {
      try {
        setIsLoadingDetail(true);
        await cancelOrder(restaurantId, order._id, { cancel_reason: reason ?? '' });
        toast.success(`Đã hủy đơn ${order.order_number}`);
        // Refresh list
        void fetchOrders(pagination.page);
      } catch (error) {
        toast.error(toOrderEndpointError('cancel', error).message);
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [restaurantId, pagination.page, fetchOrders]
  );

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    void fetchOrders(1, false, DEFAULT_FILTERS);
  }, [fetchOrders]);

  const handleRefresh = useCallback(async () => {
    void fetchOrders(pagination.page);
  }, [pagination.page, fetchOrders]);

  // Computed
  const hasMore = pagination.page < pagination.total_pages;
  const totalFetched = orders.length;
  const activeFiltersCount = Object.entries(filters).filter(
    ([, value]) => {
      if (value === undefined || value === '' || value === 'all') return false;
      return true;
    }
  ).length;

  return {
    // Data
    orders,
    selectedOrder,
    filters,
    isLoadingOrders,
    isLoadingDetail,
    isLoadingMore,
    hasMore,
    totalFetched,
    pagination,

    // Handlers
    onFilterChange: handleFilterChange,
    onViewDetails: handleViewDetails,
    onLoadOrderDetail: handleLoadOrderDetail,
    onUpdateOrderStatus: handleUpdateOrderStatus,
    onCancelOrder: handleCancelOrder,
    onUpdateOrderItemStatus: handleUpdateOrderItemStatus,
    onCancelOrderItem: handleCancelOrderItem,
    onUpdateOrderDiscount: handleUpdateOrderDiscount,
    onLoadMore: handleLoadMore,
    onClearFilters: handleClearFilters,
    onRefresh: handleRefresh,

    // UI state
    activeFiltersCount,
  };
}
