import React from "react"
import Icon from "@/components/AppIcon"
import { useRequiredPosData } from "@/features/pos/contexts/usePosContext"
import type { StaffDetail, StaffSummary } from "@/types/domain/staff"
import Button from "../../ui/Button"
import ConfirmationDialog from "../../ui/ConfirmationDialog"
import { Spinner } from "../../ui/Spinner"
import StaffCard from "./components/StaffCard"
import StaffTable from "./components/StaffTable"
import StaffFormModal from "./components/StaffFormModal"
import StaffDetailsModal from "./components/StaffDetailsModal"
import StaffStatsCards from "./components/StaffStatsCards"
import StaffFilters from "./components/StaffFilters"
import StaffHeader from "./components/StaffHeader"
import {
  useStaffManagement,
  mapDetailToSummary,
} from "./hooks/useStaffManagement"
import { useStaffForm } from "./hooks/useStaffForm"
import {
  getRestaurantStaffDetail,
  toStaffEndpointError,
} from "@/services/staff"
import { toast } from "sonner"

type StaffViewMode = "cards" | "table"

type StaffUiState = {
  viewMode: StaffViewMode
  showDetailsModal: boolean
  showDeleteConfirm: boolean
  selectedStaffDetail: StaffDetail | null
  staffToDelete: StaffSummary | null
}

type StaffUiAction =
  | { type: "setViewMode"; viewMode: StaffViewMode }
  | { type: "showDetails"; detail: StaffDetail }
  | { type: "closeDetails" }
  | { type: "setSelectedStaffDetail"; detail: StaffDetail }
  | { type: "requestDelete"; staff: StaffSummary }
  | { type: "closeDelete" }

const staffUiInitialState: StaffUiState = {
  viewMode: "cards",
  showDetailsModal: false,
  showDeleteConfirm: false,
  selectedStaffDetail: null,
  staffToDelete: null,
}

function staffUiReducer(
  state: StaffUiState,
  action: StaffUiAction
): StaffUiState {
  switch (action.type) {
    case "setViewMode":
      return { ...state, viewMode: action.viewMode }
    case "showDetails":
      return {
        ...state,
        selectedStaffDetail: action.detail,
        showDetailsModal: true,
      }
    case "closeDetails":
      return { ...state, showDetailsModal: false }
    case "setSelectedStaffDetail":
      return { ...state, selectedStaffDetail: action.detail }
    case "requestDelete":
      return {
        ...state,
        staffToDelete: action.staff,
        showDeleteConfirm: true,
      }
    case "closeDelete":
      return { ...state, staffToDelete: null, showDeleteConfirm: false }
    default:
      return state
  }
}

const StaffSection: React.FC = () => {
  const posData = useRequiredPosData()
  const restaurantId = posData.restaurant._id
  const [staffUi, dispatchStaffUi] = React.useReducer(
    staffUiReducer,
    staffUiInitialState
  )
  const {
    viewMode,
    showDetailsModal,
    showDeleteConfirm,
    selectedStaffDetail,
    staffToDelete,
  } = staffUi

  const {
    staffData,
    isLoadingData,
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
  } = useStaffManagement(restaurantId)

  const {
    showStaffModal,
    setShowStaffModal,
    staffModalMode,
    isSubmitting,
    staffFormData,
    handleFieldChange,
    handleSubmit,
    openAddModal,
    openEditModal,
    resetForm,
  } = useStaffForm(restaurantId, refetch)

  const isCardsView = viewMode === "cards"

  const setSelectedStaffDetail = React.useCallback((detail: StaffDetail) => {
    dispatchStaffUi({ type: "setSelectedStaffDetail", detail })
  }, [])

  const handleViewModeChange = React.useCallback(
    (nextViewMode: StaffViewMode) => {
      dispatchStaffUi({ type: "setViewMode", viewMode: nextViewMode })
    },
    []
  )

  const showStaffDetails = React.useCallback((detail: StaffDetail) => {
    dispatchStaffUi({ type: "showDetails", detail })
  }, [])

  const handleViewDetails = React.useCallback(
    async (staff: StaffSummary) => {
      const fallbackDetail: StaffDetail = {
        _id: staff.id,
        restaurant_id: restaurantId,
        user_id: staff.user_id,
        employee_code: staff.employee_code,
        full_name: staff.full_name,
        phone: staff.phone ?? null,
        email: staff.email ?? null,
        position: staff.position,
        hire_date: staff.hire_date,
        avatar_url: staff.avatar_url,
        status: staff.status,
        permissions: undefined,
        deleted_at: null,
        created_at: staff.created_at,
        updated_at: staff.created_at,
      }

      showStaffDetails(fallbackDetail)

      try {
        const detail = await getRestaurantStaffDetail(restaurantId, staff.id)
        showStaffDetails(detail)
      } catch (error) {
        toast.error(toStaffEndpointError("detail", error).message)
      }
    },
    [restaurantId, showStaffDetails]
  )

  const handleEditStaff = React.useCallback(
    (staff: StaffSummary) => {
      void openEditModal(staff, setSelectedStaffDetail)
    },
    [openEditModal, setSelectedStaffDetail]
  )

  const handleEditStaffFromDetails = React.useCallback(
    (staff: StaffSummary, detail?: StaffDetail | null) => {
      dispatchStaffUi({ type: "closeDetails" })
      void openEditModal(
        staff,
        setSelectedStaffDetail,
        detail ?? selectedStaffDetail
      )
    },
    [openEditModal, selectedStaffDetail, setSelectedStaffDetail]
  )

  const handleDeleteRequest = React.useCallback((staff: StaffSummary) => {
    dispatchStaffUi({ type: "requestDelete", staff })
  }, [])

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!staffToDelete) return
    try {
      await deleteStaff(staffToDelete.id)
    } finally {
      dispatchStaffUi({ type: "closeDelete" })
    }
  }, [deleteStaff, staffToDelete])

  const selectedStaffCard = React.useMemo(
    () =>
      selectedStaffDetail ? mapDetailToSummary(selectedStaffDetail) : null,
    [selectedStaffDetail]
  )

  return (
    <div>
      {isLoadingData ? (
        <div className="flex items-center justify-center gap-3 p-6 text-muted-foreground">
          <Spinner className="size-5" />
          <span className="text-sm">Đang tải danh sách nhân viên...</span>
        </div>
      ) : (
        <div className="p-6">
          <div className="mb-8">
            <StaffHeader onAddStaff={openAddModal} />
            <StaffStatsCards stats={staffStats} />
          </div>

          <StaffFilters
            filterRole={filterRole}
            filterStatus={filterStatus}
            viewMode={viewMode}
            onRoleChange={handleRoleChange}
            onStatusChange={handleStatusChange}
            onViewModeChange={handleViewModeChange}
          />

          {isCardsView ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {staffData.map((staff) => (
                <StaffCard
                  key={staff.id}
                  staff={staff}
                  onEdit={handleEditStaff}
                  onToggleStatus={toggleStatus}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          ) : (
            <StaffTable
              staff={staffData}
              onEdit={handleEditStaff}
              onToggleStatus={toggleStatus}
              onViewDetails={handleViewDetails}
              onDelete={handleDeleteRequest}
            />
          )}

          {total > limit && (
            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page * limit >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                Sau
              </Button>
            </div>
          )}

          {staffData.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                <Icon
                  name="Users"
                  size={32}
                  className="text-muted-foreground"
                />
              </div>
              <h3 className="mb-2 text-lg font-medium text-foreground">
                {filterRole || filterStatus
                  ? "Không tìm thấy kết quả tìm kiếm"
                  : "Chưa có nhân viên nào"}
              </h3>
              <p className="mb-6 text-muted-foreground">
                {filterRole || filterStatus
                  ? "Thử thay đổi bộ lọc hoặc bỏ lọc để xem toàn bộ"
                  : "Thêm nhân viên đầu tiên để bắt đầu quản lý"}
              </p>
              {!filterRole && !filterStatus && (
                <Button
                  variant="default"
                  onClick={openAddModal}
                  iconName="UserPlus"
                  iconPosition="left"
                  className="hover-scale"
                >
                  Thêm nhân viên đầu tiên
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      <StaffFormModal
        isOpen={showStaffModal}
        onClose={() => {
          setShowStaffModal(false)
          resetForm()
        }}
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange}
        formData={staffFormData}
        mode={staffModalMode}
        isLoading={isSubmitting}
      />

      <StaffDetailsModal
        isOpen={showDetailsModal}
        onClose={() => dispatchStaffUi({ type: "closeDetails" })}
        staff={selectedStaffCard}
        detail={selectedStaffDetail}
        onEdit={handleEditStaffFromDetails}
      />

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => dispatchStaffUi({ type: "closeDelete" })}
        onConfirm={handleDeleteConfirm}
        title="Xóa nhân viên"
        message={`Bạn có chắc chắn muốn xóa nhân viên "${staffToDelete?.full_name ?? ""}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        icon="Trash2"
      />
    </div>
  )
}

export default StaffSection
