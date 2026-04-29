import React, { useMemo, useState, useCallback } from 'react';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import OrderTableDesktopRow from './OrderTableDesktopRow';
import OrderTableMobileCard from './OrderTableMobileCard';
import { formatCurrency } from './order-display';
import type { AllowedOrderStatusUpdate, Order } from '@/types/order-type';

interface OrderTableProps {
  orders: Order[];
  highlightedOrderId?: string;
  onLoadOrderDetail: (orderId: string) => Promise<Order>;
  onUpdateOrderStatus: (order: Order, status: AllowedOrderStatusUpdate) => Promise<void>;
  onReprintReceipt: (order: Order) => void;
  /** Called when user confirms payment for an unpaid order */
  onPayOrder: (order: Order) => void;
  onCancelOrder: (order: Order, reason?: string) => Promise<void>;
}




const STATUS_LABELS: Record<AllowedOrderStatusUpdate, string> = {
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  ready: 'Sẵn sàng',
  delivering: 'Đang giao',
  completed: 'Hoàn thành',
};

function getAllowedNextStatuses(order: Order): AllowedOrderStatusUpdate[] {
  switch (order.status) {
    case 'pending':
      return ['confirmed'];
    case 'confirmed':
      return ['preparing'];
    case 'preparing':
      return ['ready'];
    case 'ready':
      return order.order_type === 'delivery' ? ['delivering', 'completed'] : ['completed'];
    case 'delivering':
      return ['completed'];
    default:
      return [];
  }
}

// ── Main component ─────────────────────────────────────────────────────────────

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  highlightedOrderId,
  onLoadOrderDetail,
  onUpdateOrderStatus,
  onReprintReceipt,
  onPayOrder,
  onCancelOrder,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<Order | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedOrderToUpdateStatus, setSelectedOrderToUpdateStatus] = useState<Order | null>(null);
  const [showUpdateStatusDialog, setShowUpdateStatusDialog] = useState(false);
  const [nextStatus, setNextStatus] = useState<AllowedOrderStatusUpdate | ''>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [detailOrders, setDetailOrders] = useState<Record<string, Order>>({});
  const [loadingDetailOrders, setLoadingDetailOrders] = useState<Record<string, boolean>>({});

  // ── Handlers ──────────────────────────────────────────────────────────────



  const handleOrderClick = useCallback((order: Order) => {
    if (order.payment_status === 'unpaid') {
      setSelectedOrder(order);
      setShowPaymentDialog(true);
    }
  }, []);

  const handleCancelClick = useCallback((order: Order) => {
    setSelectedOrderToCancel(order);
    setShowCancelDialog(true);
  }, []);

  const handleUpdateStatusClick = useCallback((order: Order) => {
    const allowedStatuses = getAllowedNextStatuses(order);
    if (allowedStatuses.length === 0) {
      return;
    }

    setSelectedOrderToUpdateStatus(order);
    setNextStatus(allowedStatuses[0]);
    setShowUpdateStatusDialog(true);
  }, []);

  const handleConfirmPayment = useCallback(() => {
    if (selectedOrder) onPayOrder(selectedOrder);
    setShowPaymentDialog(false);
    setSelectedOrder(null);
  }, [selectedOrder, onPayOrder]);

  const handleConfirmCancel = useCallback(async () => {
    if (!selectedOrderToCancel) return;
    try {
      setIsCancelling(true);
      await onCancelOrder(selectedOrderToCancel, cancelReason || undefined);
    } finally {
      setIsCancelling(false);
      setShowCancelDialog(false);
      setSelectedOrderToCancel(null);
      setCancelReason('');
    }
  }, [selectedOrderToCancel, cancelReason, onCancelOrder]);

  const handleConfirmUpdateStatus = useCallback(async () => {
    if (!selectedOrderToUpdateStatus || !nextStatus) return;
    try {
      setIsUpdatingStatus(true);
      await onUpdateOrderStatus(selectedOrderToUpdateStatus, nextStatus);
    } finally {
      setIsUpdatingStatus(false);
      setShowUpdateStatusDialog(false);
      setSelectedOrderToUpdateStatus(null);
      setNextStatus('');
    }
  }, [selectedOrderToUpdateStatus, nextStatus, onUpdateOrderStatus]);

  const handleCancelPayment = useCallback(() => {
    setShowPaymentDialog(false);
    setSelectedOrder(null);
  }, []);

  const handleToggleExpand = useCallback((order: Order) => {
    const isExpanding = !expandedRows.has(order._id);

    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(order._id)) {
        next.delete(order._id);
      } else {
        next.add(order._id);
      }
      return next;
    });

    if (!isExpanding || detailOrders[order._id] || loadingDetailOrders[order._id]) {
      return;
    }

    setLoadingDetailOrders((prev) => ({ ...prev, [order._id]: true }));
    void (async () => {
      try {
        const detailOrder = await onLoadOrderDetail(order._id);
        setDetailOrders((prev) => ({ ...prev, [order._id]: detailOrder }));
      } finally {
        setLoadingDetailOrders((prev) => ({ ...prev, [order._id]: false }));
      }
    })();
  }, [expandedRows, detailOrders, loadingDetailOrders, onLoadOrderDetail]);



  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span>Số đơn</span>
                </div>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <span>Ngày tạo</span>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Loại đơn</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Khách hàng</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Tổng tiền</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Nguồn đơn</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Trạng thái</th>
              <th className="text-left p-4 font-medium text-muted-foreground">TT Thanh toán</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderTableDesktopRow
                key={order._id}
                order={order}
                detailOrder={detailOrders[order._id]}
                isLoadingDetail={loadingDetailOrders[order._id]}
                highlighted={highlightedOrderId === order._id}
                expanded={expandedRows.has(order._id)}
                onToggleExpand={handleToggleExpand}
                onOrderClick={handleOrderClick}
                onUpdateStatusClick={handleUpdateStatusClick}
                onReprintReceipt={onReprintReceipt}
                onCancelOrder={handleCancelClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {orders.map((order) => (
          <OrderTableMobileCard
            key={order._id}
            order={order}
            detailOrder={detailOrders[order._id]}
            isLoadingDetail={loadingDetailOrders[order._id]}
            highlighted={highlightedOrderId === order._id}
            expanded={expandedRows.has(order._id)}
            onToggleExpand={handleToggleExpand}
            onOrderClick={handleOrderClick}
            onUpdateStatusClick={handleUpdateStatusClick}
            onReprintReceipt={onReprintReceipt}
            onCancelOrder={handleCancelClick}
          />
        ))}
      </div>

      {/* Payment Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showPaymentDialog}
        onClose={handleCancelPayment}
        onConfirm={handleConfirmPayment}
        title="Thanh toán đơn hàng"
        message={`Bạn có muốn thanh toán đơn hàng ${selectedOrder?.order_number}? Tổng tiền: ${selectedOrder ? formatCurrency(selectedOrder.total_amount) : ''}`}
        confirmText="Thanh toán ngay"
        cancelText="Hủy"
        variant="success"
        icon="CreditCard"
      />
      <ConfirmationDialog
        isOpen={showUpdateStatusDialog}
        onClose={() => {
          setShowUpdateStatusDialog(false);
          setSelectedOrderToUpdateStatus(null);
          setNextStatus('');
        }}
        onConfirm={handleConfirmUpdateStatus}
        title="Cập nhật trạng thái đơn"
        message={`Chọn trạng thái mới cho đơn ${selectedOrderToUpdateStatus?.order_number ?? ''}.`}
        confirmText="Cập nhật"
        cancelText="Đóng"
        variant="default"
        icon="GitBranch"
        isLoading={isUpdatingStatus}
      >
        <div className="mt-3">
          <label className="block text-xs text-muted-foreground mb-1">Trạng thái mới</label>
          <select
            className="w-full h-9 px-2 border border-border rounded text-sm bg-background"
            value={nextStatus}
            onChange={(e) => setNextStatus(e.target.value as AllowedOrderStatusUpdate)}
          >
            {(selectedOrderToUpdateStatus ? getAllowedNextStatuses(selectedOrderToUpdateStatus) : []).map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </ConfirmationDialog>
      <ConfirmationDialog
        isOpen={showCancelDialog}
        onClose={() => { setShowCancelDialog(false); setSelectedOrderToCancel(null); setCancelReason(''); }}
        onConfirm={handleConfirmCancel}
        title="Hủy đơn hàng"
        message={`Bạn có chắc muốn hủy đơn ${selectedOrderToCancel?.order_number}? Hành động này không thể hoàn tác.`}
        confirmText="Hủy đơn"
        cancelText="Đóng"
        variant="danger"
        icon="Trash"
        isLoading={isCancelling}
      >
        <div className="mt-3">
          <label className="block text-xs text-muted-foreground mb-1">Lý do hủy (tuỳ chọn)</label>
          <textarea
            className="w-full min-h-[80px] p-2 border border-border rounded text-sm"
            placeholder="Nhập lý do hủy để lưu lại (ví dụ: Khách đổi ý)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      </ConfirmationDialog>
    </div>
  );
};

export default OrderTable;
