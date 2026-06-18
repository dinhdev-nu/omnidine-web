import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRequiredPosData } from '@/features/pos/contexts/usePosContext';
import {
    listTables,
    getTableDetail,
    createTable,
    updateTable,
    toggleTableActive,
    regenerateTableQrCode,
    deleteTable,
    updateTableStatus,
    toTableEndpointError,
} from '@/services/tables';
import type {
    CreateTablePayload,
    TablePosition,
    TableListItem,
    TableStatus,
    UpdateTablePayload,
} from '@/types/domain/table';
import {
    INITIAL_TABLES,
    INITIAL_TABLE_POSITIONS,
} from '../constants';
import { clamp, getDefaultPosition, toTableFromListItem, toTableFromRecord } from './utils';

type TableStatusFilter = TableStatus | 'all';
type TableActiveFilter = 'all' | 'active' | 'inactive';

const normalizeCapacityInput = (value: string) => value.replace(/\D/g, '').slice(0, 2);

const parseCapacityFilter = (value: string): number | undefined => {
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    const parsed = Number.parseInt(trimmed, 10);
    if (Number.isNaN(parsed)) return undefined;

    return clamp(parsed, 1, 99);
};

export const useTableManagement = () => {
    const posData = useRequiredPosData();
    const restaurantId = posData.restaurant._id;

    const [tables, setTables] = useState<TableListItem[]>(INITIAL_TABLES);
    const [tablePositions, setTablePositions] = useState<Record<string, TablePosition>>(INITIAL_TABLE_POSITIONS);
    const [tableOccupancyById, setTableOccupancyById] = useState<Record<string, number>>({});

    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
    const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
    const [isTogglingActive, setIsTogglingActive] = useState(false);
    const [isRegeneratingQr, setIsRegeneratingQr] = useState(false);
    const [isLoadingTables, setIsLoadingTables] = useState(false);

    const [statusFilter, setStatusFilter] = useState<TableStatusFilter>('all');
    const [activeFilter, setActiveFilter] = useState<TableActiveFilter>('all');
    const [capacityMinFilter, setCapacityMinFilter] = useState('');
    const [capacityMaxFilter, setCapacityMaxFilter] = useState('');

    const tablesRef = useRef<TableListItem[]>(tables);
    useEffect(() => {
        tablesRef.current = tables;
    }, [tables]);



    const listQuery = useMemo(() => {
        const query: {
            status?: TableStatus;
            is_active?: boolean;
            capacity_min?: number;
            capacity_max?: number;
        } = {};

        if (statusFilter !== 'all') {
            query.status = statusFilter;
        }

        if (activeFilter !== 'all') {
            query.is_active = activeFilter === 'active';
        }

        const min = parseCapacityFilter(capacityMinFilter);
        const max = parseCapacityFilter(capacityMaxFilter);

        if (min !== undefined && max !== undefined) {
            query.capacity_min = Math.min(min, max);
            query.capacity_max = Math.max(min, max);
        } else {
            if (min !== undefined) {
                query.capacity_min = min;
            }
            if (max !== undefined) {
                query.capacity_max = max;
            }
        }

        return query;
    }, [activeFilter, capacityMaxFilter, capacityMinFilter, statusFilter]);

    useEffect(() => {
        let alive = true;
        const fetchTables = async () => {
            setIsLoadingTables(true);
            try {
                const response = await listTables(restaurantId, listQuery);
                if (!alive) return;

                const mapped = response.data
                    .map((item) => toTableFromListItem(item))
                    .filter((item): item is TableListItem => item !== null);

                setTables((prev) => mapped.map((table) => {
                    const previous = prev.find((item) => item._id === table._id);
                    if (!previous) {
                        return table;
                    }

                    const qrCode = table.qr_code ?? previous.qr_code;
                    return {
                        ...table,
                        qr_code: qrCode,
                        qr_url: qrCode ? `${window.location.origin}/public/tables/${qrCode}` : null,
                    };
                }));
                setSelectedTableId((prev) => {
                    if (!prev) return null;
                    const stillExists = mapped.some((table) => table._id === prev);
                    return stillExists ? prev : null;
                });
                setTablePositions((prev) => {
                    const next: Record<string, TablePosition> = {};
                    mapped.forEach((table, index) => {
                        next[table._id] = prev[table._id] ?? getDefaultPosition(index);
                    });
                    return next;
                });
                setTableOccupancyById((prev) => {
                    const next: Record<string, number> = {};
                    mapped.forEach((table) => {
                        const current = prev[table._id] ?? 0;
                        next[table._id] = table.status === 'occupied'
                            ? clamp(current || 1, 1, table.capacity)
                            : 0;
                    });
                    return next;
                });
            } catch (error) {
                toast.error(`${toTableEndpointError('list', error).message}. Đang hiển thị dữ liệu mẫu.`);
            } finally {
                if (alive) {
                    setIsLoadingTables(false);
                }
            }
        };

        void fetchTables();
        return () => {
            alive = false;
        };
    }, [restaurantId, listQuery]);

    const selectedTable = useMemo(
        () => tables.find((table) => table._id === selectedTableId) ?? null,
        [tables, selectedTableId],
    );

    const selectedTableCurrentOccupancy = selectedTable
        ? tableOccupancyById[selectedTable._id] ?? 0
        : 0;

    useEffect(() => {
        if (!selectedTableId) return;
        let alive = true;

        const fetchDetail = async () => {
            try {
                const detail = await getTableDetail(restaurantId, selectedTableId);
                if (!alive) return;

                setTables((prev) => prev.map((table) => {
                    if (table._id !== selectedTableId) return table;

                    const nextHasQr = 'has_qr' in detail ? detail.has_qr : Boolean(detail.qr_code);
                    const nextNotes = 'notes' in detail ? detail.notes : table.notes ?? null;
                    return {
                        ...table,
                        table_number: detail.table_number,
                        name: detail.name,
                        notes: nextNotes,
                        capacity: detail.capacity,
                        status: detail.status,
                        is_active: detail.is_active,
                        has_qr: nextHasQr,
                        qr_code: 'qr_code' in detail ? detail.qr_code : table.qr_code,
                    };
                }));
                setTableOccupancyById((prev) => {
                    const next = { ...prev };
                    if (detail.status === 'occupied') {
                        next[selectedTableId] = clamp(prev[selectedTableId] || 1, 1, detail.capacity);
                    } else {
                        next[selectedTableId] = 0;
                    }
                    return next;
                });
            } catch {
                // Ignore silent fetch detail fail
            }
        };

        void fetchDetail();
        return () => {
            alive = false;
        };
    }, [restaurantId, selectedTableId]);

    const stats = useMemo(() => {
        let available = 0;
        let occupied = 0;
        let reserved = 0;
        let cleaning = 0;

        for (const table of tables) {
            if (table.status === 'available') available++;
            else if (table.status === 'occupied') occupied++;
            else if (table.status === 'reserved') reserved++;
            else if (table.status === 'cleaning') cleaning++;
        }

        return { total: tables.length, available, occupied, reserved, cleaning };
    }, [tables]);

    const syncTableSelection = useCallback((table: TableListItem | null) => {
        setSelectedTableId(table?._id ?? null);
    }, []);

    const updateTableById = useCallback((id: string, updater: (table: TableListItem) => TableListItem) => {
        setTables((prev) => prev.map((table) => (table._id === id ? updater(table) : table)));
    }, []);

    const handleTableMove = useCallback((id: string, position: TablePosition) => {
        setTablePositions((prev) => ({ ...prev, [id]: position }));
    }, []);

    const submitStatusChange = useCallback(async (
        id: string,
        status: TableStatus,
    ) => {
        const target = tablesRef.current.find((table) => table._id === id);
        if (!target) return false;
        if (target.status === status) return true;
        if (target.is_active === false) {
            toast.error('Bàn đang ngưng hoạt động, không thể đổi trạng thái.');
            return false;
        }

        try {
            await updateTableStatus(restaurantId, id, { status });

            updateTableById(id, (table) => ({ ...table, status }));
            setTableOccupancyById((prev) => {
                const next = { ...prev };
                if (status === 'occupied') {
                    next[id] = clamp(prev[id] || 1, 1, target.capacity);
                } else {
                    next[id] = 0;
                }
                return next;
            });
            return true;
        } catch (error) {
            toast.error(toTableEndpointError('update-status', error).message);
            return false;
        }
    }, [restaurantId, updateTableById]);

    const handleTableStatusChange = useCallback((id: string, status: TableStatus) => {
        void submitStatusChange(id, status);
    }, [submitStatusChange]);

    const handleAddTable = useCallback((form: CreateTablePayload) => {
        if (isSubmittingAdd) return;

        void (async () => {
            setIsSubmittingAdd(true);
            try {
                const tableNumber = form.table_number?.trim() ?? '';
                if (!tableNumber) return;

                const created = await createTable(restaurantId, {
                    table_number: tableNumber,
                    capacity: clamp(form.capacity ?? 1, 1, 99),
                    name: form.name?.trim() || null,
                    notes: form.notes?.trim() || null,
                });

                const mapped = toTableFromRecord(created);
                if (!mapped) return;

                const fallbackX = 90 + (tables.length % 4) * 170;
                const fallbackY = 60 + Math.floor(tables.length / 4) * 160;

                setTables((prev) => [...prev, mapped]);
                setTablePositions((prev) => ({
                    ...prev,
                    [mapped._id]: { x: fallbackX, y: fallbackY },
                }));
                setTableOccupancyById((prev) => ({
                    ...prev,
                    [mapped._id]: mapped.status === 'occupied' ? 1 : 0,
                }));

                syncTableSelection(mapped);
                setShowAddModal(false);
                toast.success('Đã tạo bàn mới thành công');
            } catch (error) {
                toast.error(toTableEndpointError('create', error).message);
            } finally {
                setIsSubmittingAdd(false);
            }
        })();
    }, [isSubmittingAdd, restaurantId, syncTableSelection, tables.length]);

    const handleUpdateTable = useCallback((id: string, form: UpdateTablePayload) => {
        if (isSubmittingUpdate) return;

        void (async () => {
            setIsSubmittingUpdate(true);
            try {
                const tableNumber = form.table_number?.trim() ?? '';
                if (!tableNumber) return;

                const response = await updateTable(restaurantId, id, {
                    table_number: tableNumber,
                    capacity: clamp(form.capacity ?? 1, 1, 99),
                    name: form.name?.trim() || null,
                    notes: form.notes?.trim() || null,
                });

                setTables((prev) => prev.map((table) => {
                    if (table._id !== id) return table;
                    return {
                        ...table,
                        table_number: response.table.table_number,
                        name: response.table.name,
                        notes: response.table.notes,
                        capacity: response.table.capacity,
                        status: response.table.status,
                        is_active: response.table.is_active,
                        has_qr: Boolean(response.table.qr_code),
                        qr_code: response.table.qr_code,
                        qr_url: response.table.qr_code ? `${window.location.origin}/public/tables/${response.table.qr_code}` : null,
                    };
                }));
                setTableOccupancyById((prev) => ({
                    ...prev,
                    [id]: response.table.status === 'occupied'
                        ? clamp(prev[id] || 1, 1, response.table.capacity)
                        : 0,
                }));

                toast.success('Đã cập nhật thông tin bàn');
            } catch (error) {
                toast.error(toTableEndpointError('update', error).message);
            } finally {
                setIsSubmittingUpdate(false);
            }
        })();
    }, [isSubmittingUpdate, restaurantId]);

    const handleToggleTableActive = useCallback((id: string) => {
        if (isTogglingActive) return;

        void (async () => {
            setIsTogglingActive(true);
            try {
                const result = await toggleTableActive(restaurantId, id);
                setTables((prev) => prev.map((table) => {
                    if (table._id !== id) return table;
                    const nextStatus = result.is_active
                        ? (table.status === 'inactive' ? 'available' : table.status)
                        : 'inactive';
                    return {
                        ...table,
                        is_active: result.is_active,
                        status: nextStatus,
                    };
                }));
                setTableOccupancyById((prev) => ({
                    ...prev,
                    [id]: result.is_active ? prev[id] ?? 0 : 0,
                }));

                toast.success(result.is_active ? 'Đã kích hoạt bàn' : 'Đã ngưng hoạt động bàn');
            } catch (error) {
                toast.error(toTableEndpointError('toggle-active', error).message);
            } finally {
                setIsTogglingActive(false);
            }
        })();
    }, [isTogglingActive, restaurantId]);

    const handleRegenerateTableQr = useCallback((id: string) => {
        if (isRegeneratingQr) return;

        void (async () => {
            setIsRegeneratingQr(true);
            try {
                const result = await regenerateTableQrCode(restaurantId, id);
                setTables((prev) => prev.map((table) => {
                    if (table._id !== id) return table;
                    return {
                        ...table,
                        has_qr: true,
                        qr_code: result.qr_code,
                        qr_url: `${window.location.origin}/public/tables/${result.qr_code}`,
                    };
                }));
                toast.success('Đã tạo lại QR cho bàn');
            } catch (error) {
                toast.error(toTableEndpointError('regenerate-qr', error).message);
            } finally {
                setIsRegeneratingQr(false);
            }
        })();
    }, [isRegeneratingQr, restaurantId]);

    const handleDeleteTable = useCallback((id: string) => {
        void (async () => {
            try {
                const result = await deleteTable(restaurantId, id);
                setTables((prev) => prev.filter((table) => table._id !== id));
                setTablePositions((prev) => {
                    const next = { ...prev };
                    delete next[id];
                    return next;
                });
                setTableOccupancyById((prev) => {
                    const next = { ...prev };
                    delete next[id];
                    return next;
                });


                if (selectedTableId === id) {
                    syncTableSelection(null);
                }
                toast.success(result.message || 'Đã xóa bàn');
            } catch (error) {
                toast.error(toTableEndpointError('delete', error).message);
            }
        })();
    }, [restaurantId, selectedTableId, syncTableSelection]);

    const handleAutoArrange = useCallback(() => {

        setTablePositions((prev) => {
            const next = { ...prev };
            const movingTables = tables.filter((table) => table.status === 'available');

            const gridWidth = 170;
            const gridHeight = 160;
            const startX = 90;
            const startY = 60;

            let currentRow = 0;
            let currentCol = 0;

            for (const table of movingTables) {
                let found = false;
                while (!found) {
                    const testX = startX + currentCol * gridWidth;
                    const testY = startY + currentRow * gridHeight;

                    const occupied = Object.entries(next).some(([tableId, pos]) => {
                        if (tableId === table._id) return false;
                        return Math.abs(pos.x - testX) < gridWidth * 0.8
                            && Math.abs(pos.y - testY) < gridHeight * 0.8;
                    });

                    if (!occupied) {
                        next[table._id] = { x: testX, y: testY };
                        found = true;
                    }

                    currentCol++;
                    if (currentCol >= 5) {
                        currentCol = 0;
                        currentRow++;
                    }
                }
            }

            return next;
        });
    }, [tables]);

    const handleStatusFilterChange = useCallback((value: string) => {
        const allowed: TableStatusFilter[] = ['all', 'available', 'occupied', 'reserved', 'cleaning', 'inactive'];
        if (!allowed.includes(value as TableStatusFilter)) return;
        setStatusFilter(value as TableStatusFilter);
    }, []);

    const handleActiveFilterChange = useCallback((value: string) => {
        const allowed: TableActiveFilter[] = ['all', 'active', 'inactive'];
        if (!allowed.includes(value as TableActiveFilter)) return;
        setActiveFilter(value as TableActiveFilter);
    }, []);

    const handleCapacityMinFilterChange = useCallback((value: string) => {
        setCapacityMinFilter(normalizeCapacityInput(value));
    }, []);

    const handleCapacityMaxFilterChange = useCallback((value: string) => {
        setCapacityMaxFilter(normalizeCapacityInput(value));
    }, []);

    const handleClearFilters = useCallback(() => {
        setStatusFilter('all');
        setActiveFilter('all');
        setCapacityMinFilter('');
        setCapacityMaxFilter('');
    }, []);

    const hasActiveFilters = statusFilter !== 'all'
        || activeFilter !== 'all'
        || capacityMinFilter !== ''
        || capacityMaxFilter !== '';

    return {
        tables,
        tablePositions,
        tableOccupancyById,
        selectedTable,
        selectedTableCurrentOccupancy,
        stats,
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
    };
};
