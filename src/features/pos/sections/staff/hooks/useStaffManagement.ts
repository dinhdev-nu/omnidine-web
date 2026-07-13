import React from 'react';
import { toast } from 'sonner';
import {
    deleteRestaurantStaff,
    listRestaurantStaff,
    toStaffEndpointError,
    updateRestaurantStaffStatus,
} from '@/services/staff';
import { usePOSStore } from '@/stores/pos-store';
import type { StaffPosition, StaffStatus, StaffDetail, StaffSummary } from '@/types/domain/staff';

function mapDetailToSummary(detail: StaffDetail): StaffSummary {
    return {
        id: detail._id,
        employee_code: detail.employee_code,
        full_name: detail.full_name,
        phone: detail.phone,
        email: detail.email,
        position: detail.position,
        status: detail.status,
        hire_date: detail.hire_date,
        avatar_url: detail.avatar_url,
        user_id: detail.user_id,
        created_at: detail.created_at,
    };
}

export function useStaffManagement(restaurantId: string) {
    const setStaffs = usePOSStore((state) => state.setStaffs);
    const [isLoadingData, setIsLoadingData] = React.useState(true);
    const [filterRole, setFilterRole] = React.useState<StaffPosition | ''>('');
    const [filterStatus, setFilterStatus] = React.useState<StaffStatus | ''>('');
    const [page, setPage] = React.useState(1);
    const [limit] = React.useState(20);
    const [total, setTotal] = React.useState(0);
    const [staffData, setStaffData] = React.useState<StaffSummary[]>([]);
    const [listError, setListError] = React.useState<string | null>(null);
    const [pendingStaffIds, setPendingStaffIds] = React.useState<Set<string>>(() => new Set());
    const pendingStaffIdsRef = React.useRef<Set<string>>(new Set());

    const setStaffPending = React.useCallback((staffId: string, isPending: boolean) => {
        const next = new Set(pendingStaffIdsRef.current);
        if (isPending) next.add(staffId);
        else next.delete(staffId);
        pendingStaffIdsRef.current = next;
        setPendingStaffIds(next);
    }, []);

    const fetchStaffData = React.useCallback(async (silent = false) => {
        if (!silent) setIsLoadingData(true);
        if (!silent) setListError(null);
        try {
            const result = await listRestaurantStaff(restaurantId, {
                page,
                limit,
                position: filterRole || undefined,
                status: filterStatus || undefined,
            });

            setStaffData(result.data);
            setStaffs(result.data);
            setTotal(result.pagination.total);
            setListError(null);
        } catch (error) {
            const normalized = toStaffEndpointError('list', error);
            if (silent) {
                toast.error(normalized.message);
            } else {
                setStaffData([]);
                setStaffs([]);
                setTotal(0);
                setListError(normalized.message);
            }
        } finally {
            if (!silent) setIsLoadingData(false);
        }
    }, [restaurantId, page, limit, filterRole, filterStatus, setStaffs]);

    React.useEffect(() => {
        void fetchStaffData();
    }, [fetchStaffData]);

    const staffStats = React.useMemo(() => {
        const active = staffData.filter((s) => s.status === 'active').length;
        const onLeave = staffData.filter((s) => s.status === 'on_leave').length;
        const terminated = staffData.filter((s) => s.status === 'terminated').length;
        return {
            total: total || staffData.length,
            active,
            onLeave,
            terminated,
        };
    }, [staffData, total]);

    const toggleStatus = async (staff: StaffSummary): Promise<void> => {
        if (pendingStaffIdsRef.current.has(staff.id)) return;

        setStaffPending(staff.id, true);
        try {
            const nextStatus: StaffStatus = staff.status === 'active' ? 'inactive' : 'active';
            await updateRestaurantStaffStatus(restaurantId, staff.id, { status: nextStatus });
            toast.success('Cập nhật trạng thái thành công');
            await fetchStaffData(true);
        } catch (error) {
            toast.error(toStaffEndpointError('update-status', error).message);
        } finally {
            setStaffPending(staff.id, false);
        }
    };

    const deleteStaff = async (staffId: string): Promise<void> => {
        if (pendingStaffIdsRef.current.has(staffId)) return;

        setStaffPending(staffId, true);
        try {
            await deleteRestaurantStaff(restaurantId, staffId);
            toast.success('Đã xóa nhân viên');
            await fetchStaffData(true);
        } catch (error) {
            toast.error(toStaffEndpointError('delete', error).message);
        } finally {
            setStaffPending(staffId, false);
        }
    };

    const handleRoleChange = (role: StaffPosition | '') => {
        setFilterRole(role);
        setPage(1);
    };

    const handleStatusChange = (status: StaffStatus | '') => {
        setFilterStatus(status);
        setPage(1);
    };

    const refetch = React.useCallback(() => fetchStaffData(true), [fetchStaffData]);
    const retry = React.useCallback(() => fetchStaffData(false), [fetchStaffData]);

    return {
        staffData,
        isLoadingData,
        listError,
        retry,
        pendingStaffIds,
        total,
        page,
        setPage,
        limit,
        filterRole,
        handleRoleChange,
        filterStatus,
        handleStatusChange,
        staffStats,
        refetch,
        toggleStatus,
        deleteStaff,
    };
}

export { mapDetailToSummary };
