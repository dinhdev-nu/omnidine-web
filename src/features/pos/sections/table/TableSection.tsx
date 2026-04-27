import React from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import TableLayout from './components/TableLayout';
import TableControlPanel from './components/TableControlPanel';
import TableAddModal from './components/TableAddModal';
import QuickActionBar from './components/QuickActionBar';
import { useTableManagement } from './hooks/useTableManagement';

const TableSection: React.FC = () => {
    const {
        // State
        tables,
        tablePositions,
        tableOccupancyById,
        selectedTable,
        selectedTableCurrentOccupancy,
        stats,
        // Statuses
        showAddModal,
        setShowAddModal,
        isSubmittingAdd,
        isSubmittingUpdate,
        isTogglingActive,
        isRegeneratingQr,
        isLoadingTables,
        statusFilter,
        activeFilter,
        capacityMinFilter,
        capacityMaxFilter,
        hasActiveFilters,
        // Handlers
        handleStatusFilterChange,
        handleActiveFilterChange,
        handleCapacityMinFilterChange,
        handleCapacityMaxFilterChange,
        handleClearFilters,
        handleAutoArrange,
        handleTableMove,
        syncTableSelection,
        handleTableStatusChange,
        handleAddTable,
        handleUpdateTable,
        handleToggleTableActive,
        handleRegenerateTableQr,
        handleDeleteTable,
    } = useTableManagement();

    return (
        <div className="relative h-full min-h-0">
            <div className="h-full min-h-0 flex flex-col bg-surface">
                <div className="border-b border-border bg-background/95 px-3 py-3 md:px-4 md:py-4 space-y-3">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0">
                            <h1 className="text-lg md:text-xl font-semibold text-foreground">Sơ đồ phòng ăn</h1>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                                Thống kê trực tiếp: {stats.total} bàn
                            </p>
                        </div>

                        <div className="flex items-center gap-4 overflow-x-auto pb-1 xl:pb-0 px-2 lg:flex-1 lg:mx-8">
                            {[
                                { color: 'bg-success', label: 'Trống', count: stats.available, textColor: 'text-success' },
                                { color: 'bg-warning', label: 'Có khách', count: stats.occupied, textColor: 'text-warning' },
                                { color: 'bg-error', label: 'Đã đặt', count: stats.reserved, textColor: 'text-error' },
                                { color: 'bg-primary', label: 'Dọn dẹp', count: stats.cleaning, textColor: 'text-primary' },
                            ].map(({ color, label, count }) => (
                                <div key={label} className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 min-w-[100px] border border-border bg-surface rounded-md">
                                    <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-medium text-muted-foreground uppercase leading-none">{label}</span>
                                        <span className={`text-base font-semibold text-foreground leading-none mt-1`}>{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-start xl:self-auto">

                            <Button
                                variant="outline"
                                size="sm"
                                iconName="RefreshCcw"
                                iconPosition="left"
                                onClick={handleAutoArrange}
                                title="Sắp xếp gọn các bàn trống"
                            >
                                Gom bàn trống
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                iconName="Plus"
                                iconPosition="left"
                                onClick={() => setShowAddModal(true)}
                            >
                                Thêm bàn mới
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
                            <Select
                                value={statusFilter}
                                onChange={(event) => handleStatusFilterChange(event.target.value)}
                                options={[
                                    { value: 'all', label: 'Tất cả trạng thái' },
                                    { value: 'available', label: 'Trống' },
                                    { value: 'occupied', label: 'Có khách' },
                                    { value: 'reserved', label: 'Đã đặt' },
                                    { value: 'cleaning', label: 'Dọn dẹp' },
                                    { value: 'inactive', label: 'Ngưng hoạt động' },
                                ]}
                            />

                            <Select
                                value={activeFilter}
                                onChange={(event) => handleActiveFilterChange(event.target.value)}
                                options={[
                                    { value: 'all', label: 'Tất cả hoạt động' },
                                    { value: 'active', label: 'Đang hoạt động' },
                                    { value: 'inactive', label: 'Đang ngưng' },
                                ]}
                            />

                            <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="Sức chứa từ"
                                value={capacityMinFilter}
                                onChange={(event) => handleCapacityMinFilterChange(event.target.value)}
                            />

                            <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="Sức chứa đến"
                                value={capacityMaxFilter}
                                onChange={(event) => handleCapacityMaxFilterChange(event.target.value)}
                            />

                            <Button
                                variant="outline"
                                size="sm"
                                iconName="X"
                                iconPosition="left"
                                disabled={!hasActiveFilters}
                                onClick={handleClearFilters}
                                className="w-full xl:h-10"
                            >
                                Xóa lọc
                            </Button>
                        </div>

                        {isLoadingTables && (
                            <p className="text-xs text-muted-foreground">
                                Đang tải danh sách bàn theo bộ lọc...
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col lg:flex-row min-w-0">
                    <div className="flex-1 min-h-0 flex min-w-0 border-r border-border">
                        <TableLayout
                            tables={tables}
                            tablePositions={tablePositions}
                            currentOccupancyByTableId={tableOccupancyById}
                            selectedTable={selectedTable}
                            onTableSelect={syncTableSelection}
                            onTableClick={syncTableSelection}
                            onTableMove={handleTableMove}
                        />
                    </div>

                    <div className="hidden lg:block h-full">
                        <TableControlPanel
                            key={selectedTable?._id ?? 'none'}
                            selectedTable={selectedTable}
                            isSubmittingUpdate={isSubmittingUpdate}
                            isTogglingActive={isTogglingActive}
                            isRegeneratingQr={isRegeneratingQr}
                            onTableStatusChange={handleTableStatusChange}
                            onUpdateTable={handleUpdateTable}
                            onToggleTableActive={handleToggleTableActive}
                            onRegenerateTableQr={handleRegenerateTableQr}
                            onDeleteTable={handleDeleteTable}
                        />
                    </div>
                </div>

                <QuickActionBar
                    selectedTable={selectedTable}
                    selectedTableCurrentOccupancy={selectedTableCurrentOccupancy}
                    onQuickStatusChange={handleTableStatusChange}
                />
            </div>

            <TableAddModal
                isOpen={showAddModal}
                isSubmitting={isSubmittingAdd}
                onClose={() => setShowAddModal(false)}
                onConfirm={handleAddTable}
            />
        </div>
    );
};

export default TableSection;