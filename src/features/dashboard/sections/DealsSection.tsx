import { type ElementType } from "react";
import { cn } from "@/lib/utils";
import {
    Search,
    Filter,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    XCircle,
    MoreHorizontal,
    ChevronDown,
    Package,
} from "lucide-react";

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
}

interface Order {
    _id: string;
    orderId: string;
    customer: string;
    customerPhone?: string;
    email?: string;
    table: string;
    total: number;
    items: OrderItem[];
    status: "completed" | "pending" | "processing" | "cancelled";
    paymentStatus: "paid" | "unpaid" | "refunded";
    staff: string;
    createdAt: string;
}

type OrderStatus = Order["status"];
type PaymentStatus = Order["paymentStatus"];

interface StatusConfig {
    icon: ElementType;
    color: string;
    label: string;
}

const orderStatusConfig: Record<OrderStatus, StatusConfig> = {
    completed: { icon: CheckCircle2, color: "text-success", label: "Hoàn thành" },
    pending: { icon: Clock, color: "text-warning", label: "Chờ xử lý" },
    processing: { icon: Package, color: "text-blue-500", label: "Đang xử lý" },
    cancelled: { icon: XCircle, color: "text-destructive", label: "Đã hủy" },
};

const paymentStatusConfig: Record<PaymentStatus, StatusConfig> = {
    paid: { icon: CheckCircle2, color: "text-success", label: "Đã thanh toán" },
    unpaid: { icon: Clock, color: "text-warning", label: "Chưa thanh toán" },
    refunded: { icon: XCircle, color: "text-destructive", label: "Đã hoàn tiền" },
};

const sampleOrders: Order[] = [
    { _id: "1", orderId: "ORD-001", customer: "Nguyễn Văn A", customerPhone: "0901 234 567", table: "B01", total: 450000, items: [{ id: "i1", name: "Cà phê", quantity: 2 }, { id: "i2", name: "Bánh mì", quantity: 1 }], status: "completed", paymentStatus: "paid", staff: "Trần B.", createdAt: "2024-01-20T08:30:00Z" },
    { _id: "2", orderId: "ORD-002", customer: "Lê Thị B", customerPhone: "0912 345 678", table: "A03", total: 320000, items: [{ id: "i3", name: "Phở", quantity: 1 }], status: "pending", paymentStatus: "unpaid", staff: "Phạm C.", createdAt: "2024-01-20T09:15:00Z" },
    { _id: "3", orderId: "ORD-003", customer: "Phạm Văn C", table: "C02", total: 780000, items: [{ id: "i4", name: "Bún bò", quantity: 2 }, { id: "i5", name: "Nước cam", quantity: 2 }, { id: "i6", name: "Tráng miệng", quantity: 1 }], status: "processing", paymentStatus: "unpaid", staff: "Nguyễn D.", createdAt: "2024-01-20T10:00:00Z" },
    { _id: "4", orderId: "ORD-004", customer: "Hoàng Thị D", email: "htd@email.com", table: "D04", total: 195000, items: [{ id: "i7", name: "Trà sữa", quantity: 1 }], status: "cancelled", paymentStatus: "refunded", staff: "Lê E.", createdAt: "2024-01-19T14:30:00Z" },
    { _id: "5", orderId: "ORD-005", customer: "Vũ Văn E", customerPhone: "0945 678 901", table: "B02", total: 560000, items: [{ id: "i8", name: "Lẩu nhỏ", quantity: 1 }, { id: "i9", name: "Rau", quantity: 1 }], status: "completed", paymentStatus: "paid", staff: "Trần B.", createdAt: "2024-01-19T19:00:00Z" },
    { _id: "6", orderId: "ORD-006", customer: "Đặng Thị F", table: "A01", total: 240000, items: [{ id: "i10", name: "Cơm gà", quantity: 2 }], status: "completed", paymentStatus: "paid", staff: "Phạm C.", createdAt: "2024-01-18T12:00:00Z" },
    { _id: "7", orderId: "ORD-007", customer: "Bùi Văn G", customerPhone: "0967 890 123", table: "C03", total: 410000, items: [{ id: "i11", name: "Mì xào", quantity: 1 }, { id: "i12", name: "Chè", quantity: 2 }], status: "pending", paymentStatus: "unpaid", staff: "Nguyễn D.", createdAt: "2024-01-18T15:30:00Z" },
    { _id: "8", orderId: "ORD-008", customer: "Ngô Thị H", table: "D01", total: 890000, items: [{ id: "i13", name: "Gà nướng", quantity: 1 }, { id: "i14", name: "Hải sản", quantity: 1 }, { id: "i15", name: "Bia", quantity: 3 }], status: "completed", paymentStatus: "paid", staff: "Lê E.", createdAt: "2024-01-17T20:00:00Z" },
];

const filterLabels: Record<string, string> = {
    all: "Tất cả",
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
};

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const formatCurrency = (amount: number): string => {
    return currencyFormatter.format(amount);
};

export function DealsSection() {
    return (
        <div className="min-w-0 space-y-6">
            {/* Header */}
            <div>
                <p className="text-sm text-muted-foreground">Xem và quản lý tất cả đơn hàng của bạn tại một nơi</p>
            </div>

            {/* Filters and search */}
            <div className="flex flex-col items-stretch justify-between gap-4 xl:flex-row xl:items-start">
                <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <div className="relative w-full sm:w-auto">
                        <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            aria-label="Tìm đơn hàng"
                            aria-description="Tính năng tìm kiếm đơn hàng chưa khả dụng"
                            name="order-search"
                            type="search"
                            disabled
                            title="Tìm kiếm đơn hàng chưa khả dụng"
                            autoComplete="off"
                            spellCheck={false}
                            placeholder="Tìm đơn hàng…"
                            className="h-11 w-full rounded-lg border border-border bg-secondary pr-4 pl-9 text-sm text-foreground transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring/20 focus:outline-none motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-64"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {(["all", "pending", "processing", "completed", "cancelled"] as const).map((filter) => (
                            <button
                                type="button"
                                key={filter}
                                disabled
                                title="Lọc trạng thái chưa khả dụng"
                                aria-label={`${filterLabels[filter]} (bộ lọc chưa khả dụng)`}
                                aria-pressed={filter === "all"}
                                className={cn(
                                    "min-h-11 rounded-lg px-3 py-2 text-xs font-medium transition-[background-color,color] duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60",
                                    filter === "all"
                                        ? "bg-accent text-white"
                                        : "bg-secondary text-muted-foreground"
                                )}
                            >
                                {filterLabels[filter]}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    type="button"
                    disabled
                    title="Bộ lọc nâng cao chưa khả dụng"
                    aria-label="Thêm bộ lọc (chưa khả dụng)"
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto xl:shrink-0"
                >
                    <Filter aria-hidden="true" className="w-4 h-4" />
                    Thêm bộ lọc
                    <ChevronDown aria-hidden="true" className="w-3 h-3" />
                </button>
            </div>

            {/* Table */}
            <div className="min-w-0 animate-in overflow-hidden rounded-xl border border-border bg-card duration-500 fade-in slide-in-from-bottom-4 motion-reduce:animate-none">
                <div tabIndex={0} aria-label="Bảng đơn hàng, cuộn ngang để xem thêm" className="overflow-x-auto overscroll-x-contain focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none">
                    <table className="w-full min-w-[1050px]">
                        <caption className="sr-only">Danh sách đơn hàng</caption>
                        <thead>
                            <tr className="border-b border-border bg-secondary/50">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <button
                                        type="button"
                                        disabled
                                        title="Sắp xếp theo mã đơn chưa khả dụng"
                                        aria-label="Sắp xếp theo mã đơn hàng (chưa khả dụng)"
                                        className="flex min-h-11 items-center gap-1 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Mã đơn hàng
                                        <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Khách hàng</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bàn</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <button
                                        type="button"
                                        disabled
                                        title="Sắp xếp theo tổng tiền chưa khả dụng"
                                        aria-label="Sắp xếp theo tổng tiền (chưa khả dụng)"
                                        className="flex min-h-11 items-center gap-1 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Tổng tiền
                                        <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Số món</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thanh toán</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nhân viên</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ngày tạo</th>
                                <th className="w-16" aria-label="Thao tác"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleOrders.map((order, index) => {
                                const orderStatus = orderStatusConfig[order.status];
                                const paymentStatus = paymentStatusConfig[order.paymentStatus];
                                const OrderStatusIcon = orderStatus.icon;
                                const PaymentStatusIcon = paymentStatus.icon;
                                const customerInitial = order.customer ? order.customer.charAt(0).toUpperCase() : "K";

                                return (
                                    <tr
                                        key={order._id}
                                        className="animate-in border-b border-border transition-colors duration-150 fade-in slide-in-from-left-2 last:border-0 hover:bg-secondary/30 motion-reduce:animate-none motion-reduce:transition-none"
                                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground">
                                                    {customerInitial}
                                                </div>
                                                <span className="text-xs font-medium text-foreground">{order.orderId}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="text-xs text-foreground">{order.customer}</p>
                                                {(order.customerPhone || order.email) && (
                                                    <p className="text-xs text-muted-foreground">{order.customerPhone ?? order.email}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-xs text-foreground">{order.table}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-xs font-semibold text-foreground">
                                                {formatCurrency(order.total)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium text-foreground inline-flex items-center gap-1">
                                                <Package aria-hidden="true" className="w-3 h-3" />
                                                {order.items.length}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className={cn(
                                                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                                                orderStatus.color
                                            )}>
                                                <OrderStatusIcon aria-hidden="true" className="w-3 h-3" />
                                                {orderStatus.label}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", paymentStatus.color)}>
                                                <PaymentStatusIcon aria-hidden="true" className="w-3 h-3" />
                                                {paymentStatus.label}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-xs text-muted-foreground">{order.staff}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                type="button"
                                                disabled
                                                title="Thao tác đơn hàng chưa khả dụng"
                                                aria-label={`Thao tác cho đơn hàng ${order.orderId} (chưa khả dụng)`}
                                                className="flex size-11 items-center justify-center rounded-lg text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <MoreHorizontal aria-hidden="true" className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-start justify-between gap-3 border-t border-border bg-secondary/30 px-4 py-3 sm:flex-row sm:items-center">
                    <span className="text-sm text-muted-foreground tabular-nums">
                        Hiển thị 1-{sampleOrders.length} trên {sampleOrders.length} đơn hàng
                    </span>
                    <div className="flex items-center gap-2">
                        <button type="button" disabled className="min-h-11 rounded-lg px-3 py-2 text-sm text-muted-foreground/50 disabled:cursor-not-allowed">
                            Trước
                        </button>
                        <span
                            aria-current="page"
                            aria-label="Trang 1, trang hiện tại"
                            className="flex size-11 items-center justify-center rounded-lg bg-accent text-sm font-medium text-white tabular-nums"
                        >
                            1
                        </span>
                        <button type="button" disabled className="min-h-11 rounded-lg px-3 py-2 text-sm text-muted-foreground/50 disabled:cursor-not-allowed">
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
