import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OrderFilters from './components/OrderFilters';
import OrderTable from './components/OrderTable';
import Button from '../../ui/Button';
import Icon from '../../ui/AppIcon';
import { useOrderManagement } from './hooks/useOrderManagement';
import { POS_BASE_PATH } from '@/routes/pos-route-config';
import type { Order } from '@/types/domain/order';

// ─── Component ────────────────────────────────────────────────────────────────

const OrderSection: React.FC = () => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const {
        orders,
        filters,
        isLoadingOrders,
        ordersError,
        isLoadingMore,
        hasMore,
        totalFetched,
        pagination,
        onFilterChange,
        onLoadOrderDetail,
        onUpdateOrderStatus,
        onLoadMore,
        onClearFilters,
        onRefresh,
        onCancelOrder,
        onUpdateOrderItemStatus,
        onCancelOrderItem,
        onUpdateOrderDiscount,
        activeFiltersCount,
    } = useOrderManagement();

    // Handlers

    const handleFilterChange = useCallback(
        (key: string, value: string) => {
            onFilterChange({ [key]: value } as Parameters<typeof onFilterChange>[0]);
        },
        [onFilterChange]
    );

    const handleCreateOrder = useCallback(() => {
        navigate(`${POS_BASE_PATH}/${slug}`);
    }, [navigate, slug]);

    const handleGoToPayment = useCallback((order: Order) => {
        navigate(`${POS_BASE_PATH}/${slug}/payments/${order._id}`);
    }, [navigate, slug]);

    return (
        <section className="min-w-0 space-y-4 p-3 sm:p-4">
            {/* Page Header */}
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-foreground text-balance">Lịch sử đơn hàng</h1>
                    <p className="mt-1 text-muted-foreground text-pretty">
                        Theo dõi và quản lý tất cả giao dịch của cửa hàng
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 xl:flex xl:shrink-0">
                    <Button
                        variant="outline"
                        iconName="RefreshCw"
                        iconPosition="left"
                        onClick={onRefresh}
                        disabled={isLoadingOrders}
                        className="w-full hover-scale xl:w-auto"
                    >
                        Làm mới
                    </Button>
                    <Button
                        variant="default"
                        iconName="Plus"
                        iconPosition="left"
                        onClick={handleCreateOrder}
                        className="w-full hover-scale xl:w-auto"
                    >
                        Tạo đơn mới
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <OrderFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={onClearFilters}
            />

            {/* Results Summary */}
            <div className="flex flex-col gap-2 rounded-lg bg-muted/20 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="text-muted-foreground">
                    Hiển thị {orders.length} đơn hàng từ tổng số {pagination.total} đơn
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Filter" size={16} aria-hidden="true" />
                    <span className="text-sm text-muted-foreground">
                        Đã áp dụng {activeFiltersCount} bộ lọc
                    </span>
                </div>
            </div>

            {/* Orders Table */}
            {isLoadingOrders ? (
                <div role="status" aria-live="polite" className="block py-12 text-center">
                    <Icon name="Loader2" size={48} aria-hidden="true" className="mx-auto mb-4 animate-spin text-muted-foreground motion-reduce:animate-none" />
                    <h2 className="mb-2 text-lg font-medium text-foreground">
                        Đang tải dữ liệu…
                    </h2>
                    <p className="text-muted-foreground">
                        Vui lòng chờ trong giây lát
                    </p>
                </div>
            ) : ordersError ? (
                <div role="alert" className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
                    <div>
                        <h2 className="text-lg font-medium text-foreground">Không thể tải đơn hàng</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{ordersError}</p>
                    </div>
                    <Button variant="outline" iconName="RefreshCw" iconPosition="left" onClick={onRefresh}>
                        Thử lại
                    </Button>
                </div>
            ) : (
                <>
                    <OrderTable
                        orders={orders}
                        onLoadOrderDetail={onLoadOrderDetail}
                        onUpdateOrderStatus={onUpdateOrderStatus}
                        onPaymentClick={handleGoToPayment}
                        onCancelOrder={onCancelOrder}
                        onUpdateOrderItemStatus={onUpdateOrderItemStatus}
                        onCancelOrderItem={onCancelOrderItem}
                        onUpdateOrderDiscount={onUpdateOrderDiscount}
                    />

                    {/* Load More Button */}
                    {orders.length > 0 && hasMore && (
                        <div className="flex flex-col items-center gap-2 py-4">
                            <Button
                                variant="outline"
                                onClick={onLoadMore}
                                disabled={isLoadingMore}
                                iconName={isLoadingMore ? 'Loader2' : 'ChevronDown'}
                                iconPosition="right"
                                className="hover-scale"
                            >
                                {isLoadingMore ? 'Đang tải…' : 'Tải thêm đơn hàng'}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Mỗi lần tải thêm 20 đơn hàng
                            </p>
                        </div>
                    )}

                    {/* End of list message */}
                    {orders.length > 0 && !hasMore && (
                        <div className="text-center py-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm text-muted-foreground">
                                <Icon name="CheckCircle2" size={16} aria-hidden="true" />
                                <span>Đã tải tất cả {totalFetched} đơn hàng từ server</span>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!isLoadingOrders && !ordersError && orders.length === 0 && (
                <div className="py-12 text-center">
                    <Icon name="Search" size={48} aria-hidden="true" className="mx-auto mb-4 text-muted-foreground" />
                    <h2 className="mb-2 text-lg font-medium text-foreground">
                        Không tìm thấy đơn hàng
                    </h2>
                    <p className="mb-4 text-muted-foreground">
                        Thử điều chỉnh bộ lọc hoặc tạo đơn hàng mới.
                    </p>
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        className="hover-scale"
                    >
                        Xóa bộ lọc
                    </Button>
                </div>
            )}
        </section>
    );
};

export default OrderSection;
