import React from 'react';
import Button from '../../../components/Button';
import Icon from '@/components/AppIcon';
import { formatCurrency, formatDateTime, TableOrderStatusBadge, TablePaymentStatusBadge, TableOrderItemStatusBadge } from './order-display';
import { getCustomerDisplayName, getOrderSourceLabel, getOrderTypeLabel } from './order-table-utils';
import type { Order } from '@/types/order-type';

interface OrderTableMobileCardProps {
    order: Order;
    detailOrder?: Order | null;
    isLoadingDetail?: boolean;
    highlighted: boolean;
    expanded: boolean;
    onToggleExpand: (order: Order) => void;
    onOrderClick: (order: Order) => void;
    onUpdateStatusClick: (order: Order) => void;
    onReprintReceipt: (order: Order) => void;
    onCancelOrder: (order: Order) => void;
}

const OrderTableMobileCard: React.FC<OrderTableMobileCardProps> = ({
    order,
    detailOrder,
    isLoadingDetail,
    highlighted,
    expanded,
    onToggleExpand,
    onOrderClick,
    onUpdateStatusClick,
    onReprintReceipt,
    onCancelOrder,
}) => {
    const items = detailOrder?.items ?? [];
    const subtotal = detailOrder?.subtotal ?? 0;

    const total = detailOrder?.total_amount ?? 0;
    return (
        <>
            {/* Card Header */}
            <div
                className={`border border-border rounded-lg p-4 space-y-3 ${highlighted ? 'bg-primary/10 border-primary animate-pulse' : ''}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onToggleExpand(order)} className="w-8 h-8">
                            <Icon name={expanded ? 'ChevronDown' : 'ChevronRight'} size={16} />
                        </Button>
                        <span className="font-mono text-sm font-medium">#{order.order_number}</span>
                        <span className="text-xs text-muted-foreground">{getCustomerDisplayName(order)}</span>
                        <TableOrderStatusBadge status={order.status} />
                        <TablePaymentStatusBadge status={order.payment_status} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOrderClick(order)}
                            className="w-8 h-8"
                            title={order.payment_status === 'unpaid' ? 'Thanh toán' : ''}
                            disabled={order.payment_status !== 'unpaid'}
                        >
                            <Icon name={order.payment_status === 'unpaid' ? 'CreditCard' : 'Eye'} size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onReprintReceipt(order)} className="w-8 h-8">
                            <Icon name="Printer" size={16} />
                        </Button>
                        {order.status !== 'cancelled' && order.status !== 'completed' && order.status !== 'refunded' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onUpdateStatusClick(order)}
                                className="w-8 h-8"
                                title="Cập nhật trạng thái"
                            >
                                <Icon name="GitBranch" size={16} />
                            </Button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <Button variant="ghost" size="icon" onClick={() => onCancelOrder(order)} className="w-8 h-8">
                                <Icon name="Trash" size={16} />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="text-muted-foreground">Ngày tạo:</span>
                        <p className="font-medium text-foreground">{formatDateTime(order.created_at)}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Loại đơn:</span>
                        <p className="font-medium text-foreground">{getOrderTypeLabel(order.order_type)}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Tổng tiền:</span>
                        <p className="font-semibold text-foreground">{formatCurrency(order.total_amount)}</p>
                        <p className="text-xs text-muted-foreground">{order.currency}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Nguồn đơn:</span>
                        <p className="font-medium text-foreground">{getOrderSourceLabel(order.source)}</p>
                    </div>
                </div>
            </div>

            {/* Expansion Row */}
            {expanded && (
                <div className="border border-t-0 border-border rounded-b-lg bg-muted/20 p-4 space-y-4">
                    {/* Loading State */}
                    {isLoadingDetail ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <Icon name="Loader2" size={16} className="animate-spin" />
                                <span className="text-sm">Đang tải...</span>
                            </div>
                        </div>
                    ) : detailOrder ? (
                        <>
                            {/* Order Items */}
                            {/* Order Identification */}
                            <div className="text-xs space-y-2">
                                <div className="font-medium text-foreground mb-2">Thông tin đơn hàng</div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Số đơn</span><span className="font-semibold">{detailOrder.order_number}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Loại</span><span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">{getOrderTypeLabel(detailOrder.order_type)}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Nguồn</span><span className="inline-block px-2 py-0.5 bg-secondary/10 text-secondary rounded text-xs font-medium">{getOrderSourceLabel(detailOrder.source)}</span></div>
                            </div>

                            {/* Customer Information */}
                            <div className="text-xs border-t border-border pt-3 space-y-2">
                                <div className="font-medium text-foreground mb-2">Khách hàng</div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Tên</span><span className="font-medium">{getCustomerDisplayName(detailOrder)}</span></div>
                                {detailOrder.customer_phone && (
                                    <div className="flex justify-between"><span className="text-muted-foreground">SĐT</span><span className="font-medium">{detailOrder.customer_phone}</span></div>
                                )}
                                <div className="flex justify-between"><span className="text-muted-foreground">Bàn</span><span className="font-medium">{detailOrder.table_id ? `Bàn ${detailOrder.table_id}` : 'N/A'}</span></div>
                            </div>

                            {/* Timeline */}
                            <div className="text-xs border-t border-border pt-3 space-y-2">
                                <div className="font-medium text-foreground mb-2">Thời gian</div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Tạo</span><span>{formatDateTime(detailOrder.created_at)}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Cập nhật</span><span>{formatDateTime(detailOrder.updated_at)}</span></div>
                                {detailOrder.status === 'completed' && detailOrder.completed_at && (
                                    <div className="flex justify-between text-green-600"><span className="text-muted-foreground">Hoàn thành</span><span>{formatDateTime(detailOrder.completed_at)}</span></div>
                                )}
                                {detailOrder.status === 'cancelled' && detailOrder.cancelled_at && (
                                    <div className="flex justify-between text-destructive"><span className="text-muted-foreground">Hủy</span><span>{formatDateTime(detailOrder.cancelled_at)}</span></div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="text-xs border-t border-border pt-3 space-y-2">
                                <div className="font-medium text-foreground mb-2">Món ({items.length})</div>
                                <div className="space-y-1.5">
                                    {items.map((item, index) => {
                                        const isCancelled = item.status === 'cancelled';
                                        return (
                                            <div key={item._id ?? index} className={`bg-white dark:bg-muted/30 rounded p-2 ${isCancelled ? 'opacity-60' : ''}`}>
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className={`font-medium ${isCancelled ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{item.item_name}</span>
                                                        <TableOrderItemStatusBadge status={item.status} />
                                                    </div>
                                                    <span className={`font-medium whitespace-nowrap ${isCancelled ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{formatCurrency(item.total_price)}</span>
                                                </div>
                                                <div className="text-muted-foreground text-xs mt-1">{formatCurrency(item.unit_price)} × {item.quantity}</div>
                                                {item.notes && <p className="text-warning mt-1 text-xs">📝 {item.notes}</p>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="text-xs border-t border-border pt-3 space-y-1 bg-primary/5 rounded p-2">
                                <div className="font-medium text-foreground mb-2">Thanh toán</div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatCurrency(subtotal)}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Phí dịch vụ ({((detailOrder.service_charge_rate ?? 0) * 100).toFixed(0)}%)</span><span>+{formatCurrency(detailOrder.service_charge_amount ?? 0)}</span></div>
                                {/* Discount (always shown) */}
                                <>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Giảm giá ({detailOrder.discount_type === 'percent' ? `${((detailOrder.discount_value ?? 0) * 100).toFixed(0)}%` : detailOrder.discount_type})</span><span>-{formatCurrency(detailOrder.discount_amount ?? 0)}</span></div>
                                    {detailOrder.discount_ref && <div className="flex justify-between text-xs text-muted-foreground"><span>Mã:</span><span>{detailOrder.discount_ref}</span></div>}
                                </>
                                <div className="flex justify-between"><span className="text-muted-foreground">Thuế ({((detailOrder.tax_rate ?? 0) * 100).toFixed(0)}%)</span><span>+{formatCurrency(detailOrder.tax_amount ?? 0)}</span></div>
                                <div className="flex justify-between font-bold pt-2 border-t border-border"><span>Tổng</span><span className="text-primary">{formatCurrency(total)} {detailOrder.currency}</span></div>
                            </div>

                            {/* Notes */}
                            {detailOrder.notes && (
                                <div className="text-xs border-t border-border pt-3"><div className="font-medium text-foreground mb-2">Ghi chú</div><p className="bg-white dark:bg-muted/30 rounded p-2">{detailOrder.notes}</p></div>
                            )}

                            {/* Cancellation Reason */}
                            {detailOrder.cancel_reason && (
                                <div className="text-xs border-t border-border pt-3 bg-destructive/10 rounded p-2"><div className="font-medium text-destructive mb-1">Lý do hủy</div><p className="text-destructive">{detailOrder.cancel_reason}</p></div>
                            )}
                        </>
                    ) : null}
                </div>
            )}
        </>
    );
};

export default OrderTableMobileCard;