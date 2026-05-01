import React, { useState, useCallback } from 'react';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import OrderTableDesktopRow from './OrderTableDesktopRow';
import OrderTableMobileCard from './OrderTableMobileCard';
import type { AllowedOrderItemStatusUpdate, AllowedOrderStatusUpdate, Order, OrderDiscountType } from '@/types/order-type';

interface OrderTableProps {
  orders: Order[];
  highlightedOrderId?: string;
  onLoadOrderDetail: (orderId: string) => Promise<Order>;
  onUpdateOrderStatus: (order: Order, status: AllowedOrderStatusUpdate) => Promise<void>;
  onPaymentClick: (order: Order) => void;
  onCancelOrder: (order: Order, reason?: string) => Promise<void>;
  onUpdateOrderItemStatus?: (order: Order, itemId: string, status: AllowedOrderItemStatusUpdate) => Promise<void>;
  onCancelOrderItem?: (order: Order, itemId: string, reason?: string) => Promise<void>;
  onUpdateOrderDiscount?: (
    order: Order,
    type: OrderDiscountType,
    value: number,
    discountRef?: string
  ) => Promise<void>;
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
  onPaymentClick,
  onCancelOrder,
  onUpdateOrderItemStatus,
  onCancelOrderItem,
  onUpdateOrderDiscount,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
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

  const [selectedOrderToDiscount, setSelectedOrderToDiscount] = useState<Order | null>(null);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountRef, setDiscountRef] = useState('');
  const [isUpdatingDiscount, setIsUpdatingDiscount] = useState(false);

  const [selectedItemToCancel, setSelectedItemToCancel] = useState<{ order: Order, itemId: string } | null>(null);
  const [showCancelItemDialog, setShowCancelItemDialog] = useState(false);
  const [cancelItemReason, setCancelItemReason] = useState('');
  const [isCancellingItem, setIsCancellingItem] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────



  const handleOrderClick = useCallback((order: Order) => {
    if (order.payment_status !== 'unpaid') return;
    onPaymentClick(order);
  }, [onPaymentClick]);

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

  const handleUpdateOrderItemStatus = useCallback(async (order: Order, itemId: string, status: AllowedOrderItemStatusUpdate) => {
    if (!onUpdateOrderItemStatus) return;
    await onUpdateOrderItemStatus(order, itemId, status);
    const detailOrder = await onLoadOrderDetail(order._id);
    setDetailOrders((prev) => ({ ...prev, [order._id]: detailOrder }));
  }, [onUpdateOrderItemStatus, onLoadOrderDetail]);

  const handleEditDiscountClick = useCallback((order: Order) => {
    setSelectedOrderToDiscount(order);
    const detail = detailOrders[order._id] || order;
    setDiscountType((detail.discount_type as any) === 'percent' ? 'percent' : 'fixed');
    setDiscountValue(detail.discount_value || 0);
    setDiscountRef(detail.discount_ref ?? '');
    setShowDiscountDialog(true);
  }, [detailOrders]);

  const handleCancelItemClick = useCallback((order: Order, itemId: string) => {
    setSelectedItemToCancel({ order, itemId });
    setCancelItemReason('');
    setShowCancelItemDialog(true);
  }, []);

  const handleConfirmDiscount = useCallback(async () => {
    if (!selectedOrderToDiscount || !onUpdateOrderDiscount) return;
    try {
      setIsUpdatingDiscount(true);
      await onUpdateOrderDiscount(selectedOrderToDiscount, discountType, discountValue, discountRef);
      const detailOrder = await onLoadOrderDetail(selectedOrderToDiscount._id);
      setDetailOrders((prev) => ({ ...prev, [selectedOrderToDiscount._id]: detailOrder }));
    } finally {
      setIsUpdatingDiscount(false);
      setShowDiscountDialog(false);
      setSelectedOrderToDiscount(null);
    }
  }, [selectedOrderToDiscount, discountType, discountValue, discountRef, onUpdateOrderDiscount, onLoadOrderDetail]);

  const handleConfirmCancelItem = useCallback(async () => {
    if (!selectedItemToCancel || !onCancelOrderItem) return;
    try {
      setIsCancellingItem(true);
      await onCancelOrderItem(selectedItemToCancel.order, selectedItemToCancel.itemId, cancelItemReason);
      const detailOrder = await onLoadOrderDetail(selectedItemToCancel.order._id);
      setDetailOrders((prev) => ({ ...prev, [selectedItemToCancel.order._id]: detailOrder }));
    } finally {
      setIsCancellingItem(false);
      setShowCancelItemDialog(false);
      setSelectedItemToCancel(null);
    }
  }, [selectedItemToCancel, cancelItemReason, onCancelOrderItem, onLoadOrderDetail]);

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
                onPaymentClick={handleOrderClick}
                onUpdateStatusClick={handleUpdateStatusClick}
                onCancelOrder={handleCancelClick}
                onUpdateOrderItemStatus={handleUpdateOrderItemStatus}
                onCancelOrderItemClick={handleCancelItemClick}
                onEditDiscountClick={handleEditDiscountClick}
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
            onPaymentClick={handleOrderClick}
            onUpdateStatusClick={handleUpdateStatusClick}
            onCancelOrder={handleCancelClick}
            onUpdateOrderItemStatus={handleUpdateOrderItemStatus}
            onCancelOrderItemClick={handleCancelItemClick}
            onEditDiscountClick={handleEditDiscountClick}
          />
        ))}
      </div>
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

      <ConfirmationDialog
        isOpen={showDiscountDialog}
        onClose={() => { setShowDiscountDialog(false); setSelectedOrderToDiscount(null); setDiscountRef(''); }}
        onConfirm={handleConfirmDiscount}
        title="Cập nhật giảm giá"
        message={`Cập nhật giảm giá cho đơn ${selectedOrderToDiscount?.order_number}.`}
        confirmText="Cập nhật"
        cancelText="Đóng"
        variant="default"
        icon="Tag"
        isLoading={isUpdatingDiscount}
      >
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Loại giảm giá</label>
            <select
              className="w-full h-9 px-2 border border-border rounded text-sm bg-background"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'fixed' | 'percent')}
            >
              <option value="fixed">Tiền mặt</option>
              <option value="percent">Phần trăm (%)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Giá trị</label>
            <input
              type="number"
              className="w-full h-9 px-2 border border-border rounded text-sm bg-background"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Mã giảm giá / chương trình</label>
            <input
              type="text"
              className="w-full h-9 px-2 border border-border rounded text-sm bg-background"
              placeholder="Nhập mã voucher hoặc tên chương trình"
              value={discountRef}
              onChange={(e) => setDiscountRef(e.target.value)}
            />
          </div>
        </div>
      </ConfirmationDialog>

      <ConfirmationDialog
        isOpen={showCancelItemDialog}
        onClose={() => { setShowCancelItemDialog(false); setSelectedItemToCancel(null); setCancelItemReason(''); }}
        onConfirm={handleConfirmCancelItem}
        title="Hủy món ăn"
        message={`Bạn có chắc muốn hủy món này trong đơn?`}
        confirmText="Hủy món"
        cancelText="Đóng"
        variant="danger"
        icon="Trash"
        isLoading={isCancellingItem}
      >
        <div className="mt-3">
          <label className="block text-xs text-muted-foreground mb-1">Lý do hủy (tuỳ chọn)</label>
          <textarea
            className="w-full min-h-[80px] p-2 border border-border rounded text-sm"
            placeholder="Nhập lý do hủy món..."
            value={cancelItemReason}
            onChange={(e) => setCancelItemReason(e.target.value)}
          />
        </div>
      </ConfirmationDialog>
    </div>
  );
};

export default OrderTable;
