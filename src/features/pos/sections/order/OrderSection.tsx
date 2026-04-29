import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OrderFilters from './components/OrderFilters';
import OrderTable from './components/OrderTable';
import Button from '../../components/Button';
import Icon from '../../components/AppIcon';
import { useOrderManagement } from './hooks/useOrderManagement';
import { POS_BASE_PATH } from '@/routes/pos-route';
import type { Order } from '@/types/order-type';

// ─── Component ────────────────────────────────────────────────────────────────

const OrderSection: React.FC = () => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const {
        orders,
        filters,
        isLoadingOrders,
        isLoadingMore,
        hasMore,
        totalFetched,
        pagination,
        onFilterChange,
        onLoadOrderDetail,
        onUpdateOrderStatus,
        onPayOrder,
        onLoadMore,
        onClearFilters,
        onRefresh,
        onCancelOrder,
        activeFiltersCount,
    } = useOrderManagement();

    // Handlers

    const handlePayOrder = useCallback(
        async (order: Order) => {
            try {
                await onPayOrder(order);
            } catch {
                // Error already toasted by hook
            }
        },
        [onPayOrder]
    );

    const handleFilterChange = useCallback(
        (key: string, value: string) => {
            const filterKey = key as keyof typeof filters;
            onFilterChange({ [filterKey]: value } as Partial<typeof filters>);
        },
        [filters, onFilterChange]
    );

    const handleCreateOrder = useCallback(() => {
        navigate(`${POS_BASE_PATH}/${slug}`);
    }, [navigate, slug]);

    return (
        <div className="p-4 space-y-4">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Lịch sử đơn hàng</h1>
                    <p className="text-muted-foreground mt-1">
                        Theo dõi và quản lý tất cả giao dịch của cửa hàng
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        iconName="RefreshCw"
                        iconPosition="left"
                        onClick={onRefresh}
                        disabled={isLoadingOrders}
                        className="hover-scale"
                    >
                        Làm mới
                    </Button>
                    <Button
                        variant="default"
                        iconName="Plus"
                        iconPosition="left"
                        onClick={handleCreateOrder}
                        className="hover-scale"
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
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Hiển thị {orders.length} đơn hàng từ tổng số {pagination.total} đơn
                </div>
                <div className="flex items-center gap-2">
                    <Icon name="Filter" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Đã áp dụng {activeFiltersCount} bộ lọc
                    </span>
                </div>
            </div>

            {/* Orders Table */}
            {isLoadingOrders ? (
                <div className="text-center py-12">
                    <Icon name="Loader2" size={48} className="text-muted-foreground mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        Đang tải dữ liệu...
                    </h3>
                    <p className="text-muted-foreground">
                        Vui lòng chờ trong giây lát
                    </p>
                </div>
            ) : (
                <>
                    <OrderTable
                        orders={orders}
                        onLoadOrderDetail={onLoadOrderDetail}
                        onUpdateOrderStatus={onUpdateOrderStatus}
                        onReprintReceipt={() => { }}
                        onPayOrder={handlePayOrder}
                        onCancelOrder={onCancelOrder}
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
                                {isLoadingMore ? 'Đang tải...' : 'Tải thêm đơn hàng'}
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
                                <Icon name="CheckCircle2" size={16} />
                                <span>Đã tải tất cả {totalFetched} đơn hàng từ server</span>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!isLoadingOrders && orders.length === 0 && (
                <div className="text-center py-12">
                    <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        Không tìm thấy đơn hàng
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        {orders.length === 0
                            ? 'Chưa có đơn hàng nào trong hệ thống'
                            : 'Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác'
                        }
                    </p>
                    {orders.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={onClearFilters}
                            className="hover-scale"
                        >
                            Xóa tất cả bộ lọc
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderSection;