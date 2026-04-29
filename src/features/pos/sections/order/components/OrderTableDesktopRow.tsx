import React from 'react';
import Button from '../../../components/Button';
import Icon from '@/components/AppIcon';
import {
    formatCurrency,
    formatDateTime,
    TableOrderStatusBadge,
    TablePaymentStatusBadge,
    TableOrderItemStatusBadge,
} from './order-display';
import { getCustomerDisplayName, getOrderSourceLabel, getOrderTypeLabel } from './order-table-utils';
import type { Order } from '@/types/order-type';

interface OrderTableDesktopRowProps {
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

const OrderTableDesktopRow: React.FC<OrderTableDesktopRowProps> = ({
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
}) => (
    <React.Fragment>
        <tr
            className={`border-b border-border hover:bg-muted/30 transition-smooth ${highlighted ? 'bg-primary/10 animate-pulse' : ''}`}
        >
            <td className="p-4">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onToggleExpand(order)} className="w-6 h-6">
                        <Icon name={expanded ? 'ChevronDown' : 'ChevronRight'} size={16} />
                    </Button>
                    <span className="font-mono text-sm font-medium">#{order.order_number}</span>
                </div>
            </td>
            <td className="p-4">
                <div className="text-sm font-medium text-foreground">{formatDateTime(order.created_at)}</div>
            </td>
            <td className="p-4">
                <div className="text-sm font-medium text-foreground">{getOrderTypeLabel(order.order_type)}</div>
            </td>
            <td className="p-4">
                <div className="text-sm text-muted-foreground">{getCustomerDisplayName(order)}</div>
            </td>
            <td className="p-4">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-foreground">{formatCurrency(order.total_amount)}</span>
                    <span className="text-xs text-muted-foreground">{order.currency}</span>
                </div>
            </td>
            <td className="p-4">
                <div className="text-sm font-medium text-foreground">{getOrderSourceLabel(order.source)}</div>
            </td>
            <td className="p-4">
                <TableOrderStatusBadge status={order.status} />
            </td>
            <td className="p-4">
                <TablePaymentStatusBadge status={order.payment_status} />
            </td>
            <td className="p-4">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOrderClick(order)}
                        className="hover-scale"
                        title={order.payment_status === 'unpaid' ? 'Thanh toán' : 'Xem chi tiết'}
                    >
                        <Icon name={order.payment_status === 'unpaid' ? 'CreditCard' : 'Eye'} size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onReprintReceipt(order)} className="hover-scale">
                        <Icon name="Printer" size={16} />
                    </Button>
                    {order.status !== 'cancelled' && order.status !== 'completed' && order.status !== 'refunded' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onUpdateStatusClick(order)}
                            className="hover-scale"
                            title="Cập nhật trạng thái"
                        >
                            <Icon name="GitBranch" size={16} />
                        </Button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <Button variant="ghost" size="icon" onClick={() => onCancelOrder(order)} className="hover-scale" title="Hủy đơn">
                            <Icon name="Trash" size={16} />
                        </Button>
                    )}
                </div>
            </td>
        </tr>

        {expanded && (
            <tr className="bg-gradient-to-b from-muted/30 to-muted/10">
                <td colSpan={9} className="p-0">
                    <div className="px-4 py-4 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Icon name="FileText" size={16} className="text-primary" />
                                Chi tiết đơn hàng
                            </h4>
                            <span className="text-xs text-muted-foreground">{formatDateTime(order.created_at)}</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {isLoadingDetail && !detailOrder ? (
                                <div className="lg:col-span-3 flex items-center justify-center py-8">
                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                        <Icon name="Loader2" size={16} className="animate-spin" />
                                        <span className="text-sm">Đang tải...</span>
                                    </div>
                                </div>
                            ) : null}

                            {!isLoadingDetail && detailOrder ? (
                                <>
                                    <div className="lg:col-span-2">
                                        {/* Order Identification */}
                                        <div className="bg-card border border-border rounded-md overflow-hidden mb-3">
                                            <div className="bg-muted/50 px-3 py-1.5 border-b border-border"><h5 className="text-xs font-semibold text-foreground">Thông tin đơn hàng</h5></div>
                                            <div className="p-3 space-y-2 text-xs">
                                                <div className="flex justify-between"><span className="text-muted-foreground">Số đơn</span><span className="font-semibold">{detailOrder.order_number}</span></div>
                                                <div className="flex justify-between"><span className="text-muted-foreground">Loại</span><span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">{getOrderTypeLabel(detailOrder.order_type)}</span></div>
                                                <div className="flex justify-between"><span className="text-muted-foreground">Nguồn</span><span className="inline-block px-2 py-0.5 bg-secondary/10 text-secondary rounded text-xs font-medium">{getOrderSourceLabel(detailOrder.source)}</span></div>
                                            </div>
                                        </div>

                                        {/* Customer Information */}
                                        <div className="bg-card border border-border rounded-md overflow-hidden mb-3 bg-blue-50/30 dark:bg-blue-950/20">
                                            <div className="bg-muted/50 px-3 py-1.5 border-b border-border"><h5 className="text-xs font-semibold text-foreground">Khách hàng</h5></div>
                                            <div className="p-3 space-y-2 text-xs">
                                                <div className="flex justify-between"><span className="text-muted-foreground">Tên</span><span className="font-semibold">{getCustomerDisplayName(detailOrder)}</span></div>
                                                {detailOrder.customer_phone && <div className="flex justify-between"><span className="text-muted-foreground">SĐT</span><span className="font-medium">{detailOrder.customer_phone}</span></div>}
                                                <div className="flex justify-between"><span className="text-muted-foreground">Bàn</span><span className="font-medium">{detailOrder.table_id ? `Bàn ${detailOrder.table_id}` : 'N/A'}</span></div>
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div className="bg-card border border-border rounded-md overflow-hidden mb-3">
                                            <div className="bg-muted/50 px-3 py-1.5 border-b border-border"><h5 className="text-xs font-semibold text-foreground">Thời gian</h5></div>
                                            <div className="p-3 space-y-1.5 text-xs">
                                                <div className="flex justify-between"><span className="text-muted-foreground">Tạo</span><span>{formatDateTime(detailOrder.created_at)}</span></div>
                                                <div className="flex justify-between"><span className="text-muted-foreground">Cập nhật</span><span>{formatDateTime(detailOrder.updated_at)}</span></div>
                                                {detailOrder.status === 'completed' && detailOrder.completed_at && <div className="flex justify-between text-green-600"><span className="text-muted-foreground">Hoàn thành</span><span>{formatDateTime(detailOrder.completed_at)}</span></div>}
                                                {detailOrder.status === 'cancelled' && detailOrder.cancelled_at && <div className="flex justify-between text-destructive"><span className="text-muted-foreground">Hủy</span><span>{formatDateTime(detailOrder.cancelled_at)}</span></div>}
                                            </div>
                                        </div>

                                        <div className="bg-card border border-border rounded-md overflow-hidden">
                                            <div className="bg-muted/50 px-3 py-1.5 border-b border-border">
                                                <h5 className="text-xs font-semibold text-foreground flex items-center gap-2">
                                                    <Icon name="ShoppingBag" size={12} />
                                                    Món ăn ({detailOrder.items?.length || 0})
                                                </h5>
                                            </div>
                                            <div className="divide-y divide-border max-h-[200px] overflow-y-auto">
                                                {detailOrder.items?.map((item, index) => {
                                                    const isCancelled = item.status === 'cancelled';
                                                    return (
                                                        <div key={index} className={`px-3 py-2 hover:bg-muted/30 transition-colors ${isCancelled ? 'opacity-60 bg-muted/20' : ''}`}>
                                                            <div className="flex justify-between items-start gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold flex-shrink-0 ${isCancelled ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                                                                            {item.quantity}
                                                                        </span>
                                                                        <span className={`text-sm font-medium truncate ${isCancelled ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                                                            {item.item_name}
                                                                        </span>
                                                                        <TableOrderItemStatusBadge status={item.status} />
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground mt-0.5 ml-7">
                                                                        {formatCurrency(item.unit_price)}
                                                                    </div>
                                                                    {item.notes && (
                                                                        <p className="text-xs text-muted-foreground mt-0.5 ml-7 italic">📝 {item.notes}</p>
                                                                    )}
                                                                </div>
                                                                <span className={`text-sm font-semibold whitespace-nowrap ${isCancelled ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                                                    {formatCurrency(item.total_price)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-card border border-border rounded-md overflow-hidden">
                                            <div className="bg-muted/50 px-3 py-1.5 border-b border-border">
                                                <h5 className="text-xs font-semibold text-foreground flex items-center gap-2">
                                                    <Icon name="Calculator" size={12} />
                                                    Tổng kết
                                                </h5>
                                            </div>
                                            <div className="p-3 space-y-1.5 text-xs">
                                                <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatCurrency(detailOrder.subtotal)}</span></div>
                                                <div className="flex justify-between"><span className="text-muted-foreground">Phí dịch vụ ({((detailOrder.service_charge_rate ?? 0) * 100).toFixed(0)}%)</span><span>+{formatCurrency(detailOrder.service_charge_amount ?? 0)}</span></div>
                                                <>
                                                    <div className="flex justify-between"><span className="text-muted-foreground">Giảm giá ({detailOrder.discount_type === 'percent' ? `${((detailOrder.discount_value ?? 0) * 100).toFixed(0)}%` : detailOrder.discount_type})</span><span>-{formatCurrency(detailOrder.discount_amount ?? 0)}</span></div>
                                                    {detailOrder.discount_ref && <div className="flex justify-between text-muted-foreground"><span>Mã:</span><span>{detailOrder.discount_ref}</span></div>}
                                                </>
                                                <div className="flex justify-between"><span className="text-muted-foreground">Thuế ({((detailOrder.tax_rate ?? 0) * 100).toFixed(0)}%)</span><span>+{formatCurrency(detailOrder.tax_amount ?? 0)}</span></div>
                                                <div className="border-t border-border pt-1.5 mt-1.5"><div className="flex justify-between items-center"><span className="font-semibold text-foreground">Tổng</span><span className="text-base font-bold text-primary">{formatCurrency(detailOrder.total_amount)} {detailOrder.currency}</span></div></div>
                                            </div>
                                        </div>

                                        <div className="bg-card border border-border rounded-md overflow-hidden">
                                            <div className="bg-muted/50 px-3 py-1.5 border-b border-border">
                                                <h5 className="text-xs font-semibold text-foreground flex items-center gap-2">
                                                    <Icon name="Info" size={12} />
                                                    Thông tin
                                                </h5>
                                            </div>
                                            <div className="p-3 space-y-2 text-xs">
                                                {detailOrder.staff_id && <div className="flex justify-between"><span className="text-muted-foreground">Nhân viên</span><span className="font-medium">{detailOrder.staff_id}</span></div>}
                                                {detailOrder.notes && <div className="pt-1.5 border-t border-border"><span className="text-muted-foreground block mb-1">Ghi chú</span><p className="text-foreground bg-muted/30 p-1.5 rounded italic">{detailOrder.notes}</p></div>}
                                                {detailOrder.cancel_reason && <div className="pt-1.5 border-t border-destructive/50 bg-destructive/10 rounded p-2"><span className="text-destructive block mb-1 font-medium">Lý do hủy</span><p className="text-destructive italic">{detailOrder.cancel_reason}</p></div>}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="h-2 bg-muted/20" />
                </td>
            </tr>
        )}
    </React.Fragment>
);

export default OrderTableDesktopRow;