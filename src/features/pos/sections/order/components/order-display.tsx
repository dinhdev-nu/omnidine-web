import React from 'react';
import Icon from '@/components/AppIcon';
import type { OrderStatus, OrderPaymentStatus, OrderItemStatus } from '@/types/order-type';

/**
 * Re-export API types for use in components
 * (avoid circular imports by importing directly from order-type.ts)
 */
export type { OrderStatus, OrderPaymentStatus, OrderItemStatus };

export const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('vi-VN').format(amount ?? 0);

export const formatDateTime = (timestamp?: string): string => {
    if (!timestamp) return 'N/A';
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(timestamp));
};

export const getTableDisplay = (table?: string): string => {
    if (!table) return 'N/A';
    if (table === 'takeaway') return 'Mang đi';
    return `Bàn ${table}`;
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
    cash: 'Tiền mặt', CASH: 'Tiền mặt',
    card: 'Thẻ tín dụng',
    momo: 'MoMo',
    zalopay: 'ZaloPay',
    banking: 'Chuyển khoản',
    qr: 'QR Code', QR_CODE: 'QR Code',
};

const ORDER_STATUS_TABLE_CONFIG: Record<OrderStatus, { color: string; label: string }> = {
    pending: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', label: 'Chờ xử lý' },
    confirmed: { color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300', label: 'Đã xác nhận' },
    preparing: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', label: 'Đang chuẩn bị' },
    ready: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', label: 'Sẵn sàng' },
    delivering: { color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300', label: 'Đang giao' },
    completed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', label: 'Hoàn thành' },
    cancelled: { color: 'bg-destructive/15 text-destructive', label: 'Đã hủy' },
    refunded: { color: 'bg-secondary text-secondary-foreground', label: 'Đã hoàn tiền' },
};

const PAYMENT_STATUS_TABLE_CONFIG: Record<OrderPaymentStatus, { color: string; label: string; icon: string }> = {
    unpaid: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', label: 'Chưa thanh toán', icon: 'AlertCircle' },
    partial: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300', label: 'Thanh toán một phần', icon: 'AlertCircle' },
    paid: { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', label: 'Đã thanh toán', icon: 'CheckCircle' },
    partially_refunded: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', label: 'Hoàn tiền một phần', icon: 'RotateCcw' },
    refunded: { color: 'bg-secondary text-secondary-foreground', label: 'Đã hoàn tiền', icon: 'RotateCcw' },
};

const ORDER_STATUS_MODAL_CONFIG: Record<OrderStatus, { color: string; label: string }> = {
    pending: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', label: 'Chờ xử lý' },
    confirmed: { color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300', label: 'Đã xác nhận' },
    preparing: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', label: 'Đang chuẩn bị' },
    ready: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', label: 'Sẵn sàng' },
    delivering: { color: 'bg-violet-100 text-violet-600', label: 'Đang giao' },
    completed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', label: 'Hoàn thành' },
    cancelled: { color: 'bg-destructive/15 text-destructive', label: 'Đã hủy' },
    refunded: { color: 'bg-muted text-muted-foreground', label: 'Đã hoàn tiền' },
};

const PAYMENT_STATUS_MODAL_CONFIG: Record<OrderPaymentStatus, { color: string; label: string }> = {
    unpaid: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', label: 'Chưa thanh toán' },
    partial: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300', label: 'Thanh toán một phần' },
    paid: { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', label: 'Đã thanh toán' },
    partially_refunded: { color: 'bg-blue-100 text-blue-600', label: 'Hoàn tiền một phần' },
    refunded: { color: 'bg-muted text-muted-foreground', label: 'Đã hoàn tiền' },
};

export const TableOrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const config = ORDER_STATUS_TABLE_CONFIG[status] ?? ORDER_STATUS_TABLE_CONFIG.completed;
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.color}`}>
            {config.label}
        </span>
    );
};

export const TablePaymentStatusBadge: React.FC<{ status: OrderPaymentStatus }> = ({ status }) => {
    const config = PAYMENT_STATUS_TABLE_CONFIG[status] ?? PAYMENT_STATUS_TABLE_CONFIG.unpaid;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.color}`}>
            <Icon name={config.icon} size={12} />
            {config.label}
        </span>
    );
};

export const ModalOrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const config = ORDER_STATUS_MODAL_CONFIG[status] ?? ORDER_STATUS_MODAL_CONFIG.pending;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
            {config.label}
        </span>
    );
};

export const ModalPaymentStatusBadge: React.FC<{ status: OrderPaymentStatus }> = ({ status }) => {
    const config = PAYMENT_STATUS_MODAL_CONFIG[status] ?? PAYMENT_STATUS_MODAL_CONFIG.unpaid;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
            {config.label}
        </span>
    );
};

const ORDER_ITEM_STATUS_CONFIG: Record<OrderItemStatus, { color: string; label: string }> = {
    pending: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', label: 'Chờ xử lý' },
    preparing: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', label: 'Đang làm' },
    ready: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', label: 'Xong' },
    served: { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', label: 'Đã lên' },
    cancelled: { color: 'bg-destructive/15 text-destructive', label: 'Đã hủy' },
};

export const TableOrderItemStatusBadge: React.FC<{ status: OrderItemStatus }> = ({ status }) => {
    const config = ORDER_ITEM_STATUS_CONFIG[status] ?? ORDER_ITEM_STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${config.color}`}>
            {config.label}
        </span>
    );
};