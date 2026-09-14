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
  const [isDetailLoading, setIsDetailLoading] = React.useState(false)
  const detailRequestIdRef = React.useRef(0)
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
  } = useStaffManagement(restaurantId)

  const {
    showStaffModal,
    setShowStaffModal,
    staffModalMode,
    isSubmitting,
    isInitializing,
    staffFormData,
    handleFieldChange,
    handleSubmit,
    openAddModal,
    openEditModal,
    resetForm,
    staffModalTriggerRef,
  } = useStaffForm(restaurantId, refetch)
  const staffDetailsTriggerRef = React.useRef<HTMLElement | null>(null)

  const isCardsView = viewMode === "cards"
  const isStaffBusy = React.useCallback(
    (staffId: string) => pendingStaffIds.has(staffId),
    [pendingStaffIds]
  )

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

  const handleCloseDetails = React.useCallback(() => {
    detailRequestIdRef.current += 1
    setIsDetailLoading(false)
    dispatchStaffUi({ type: "closeDetails" })
  }, [])

  const handleViewDetails = React.useCallback(
    async (staff: StaffSummary) => {
      staffDetailsTriggerRef.current = document.activeElement as HTMLElement | null
      const requestId = detailRequestIdRef.current + 1
      detailRequestIdRef.current = requestId
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

      setIsDetailLoading(true)
      showStaffDetails(fallbackDetail)

      try {
        const detail = await getRestaurantStaffDetail(restaurantId, staff.id)
        if (detailRequestIdRef.current === requestId) {
          showStaffDetails(detail)
        }
      } catch (error) {
        if (detailRequestIdRef.current === requestId) {
          toast.error(toStaffEndpointError("detail", error).message)
        }
      } finally {
        if (detailRequestIdRef.current === requestId) {
          setIsDetailLoading(false)
        }
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
      handleCloseDetails()
      void openEditModal(
        staff,
        setSelectedStaffDetail,
        detail ?? selectedStaffDetail
      )
    },
    [handleCloseDetails, openEditModal, selectedStaffDetail, setSelectedStaffDetail]
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
    <section aria-labelledby="staff-section-title">
      <div className="p-4 sm:p-6">
        <StaffHeader onAddStaff={openAddModal} />

        {isLoadingData ? (
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-48 items-center justify-center gap-3 rounded-lg border border-border bg-card p-6 text-muted-foreground"
          >
            <Spinner className="size-5" aria-hidden="true" />
            <span className="text-sm">Đang tải danh sách nhân viên…</span>
          </div>
        ) : listError ? (
          <div
            role="alert"
            className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-lg border border-error/30 bg-error/5 p-6 text-center"
          >
            <Icon name="CircleAlert" size={32} className="text-error" aria-hidden="true" />
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-foreground">
                Không thể tải danh sách nhân viên
              </h2>
              <p className="mt-1 break-words text-muted-foreground">
                {listError}
              </p>
            </div>
            <Button
              variant="outline"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={() => void retry()}
            >
              Thử lại
            </Button>
          </div>
        ) : (
          <>
            <StaffStatsCards stats={staffStats} />

            <StaffFilters
              filterRole={filterRole}
              filterStatus={filterStatus}
              viewMode={viewMode}
              onRoleChange={handleRoleChange}
              onStatusChange={handleStatusChange}
              onViewModeChange={handleViewModeChange}
            />

            {staffData.length > 0 &&
              (isCardsView ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                  {staffData.map((staff) => (
                    <StaffCard
                      key={staff.id}
                      staff={staff}
                      isBusy={isStaffBusy(staff.id)}
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
                  isStaffBusy={isStaffBusy}
                  onEdit={handleEditStaff}
                  onToggleStatus={toggleStatus}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteRequest}
                />
              ))}

            {total > limit && (
              <nav
                aria-label="Phân trang danh sách nhân viên"
                className="mt-6 flex items-center justify-between gap-3 sm:justify-end"
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                >
                  Trước
                </Button>
                <span aria-live="polite" className="text-sm text-muted-foreground">
                  Trang {page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page * limit >= total}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                >
                  Sau
                </Button>
              </nav>
            )}

            {staffData.length === 0 && (
              <div role="status" className="py-10 text-center sm:py-12">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                  <Icon
                    name="Users"
                    size={32}
                    className="text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-lg font-medium text-foreground">
                  {filterRole || filterStatus
                    ? "Không tìm thấy nhân viên phù hợp"
                    : "Chưa có nhân viên nào"}
                </h2>
                <p className="mx-auto mt-2 mb-6 max-w-xl text-muted-foreground">
                  {filterRole || filterStatus
                    ? "Hãy thay đổi hoặc xóa bộ lọc để xem toàn bộ danh sách."
                    : "Thêm nhân viên đầu tiên để bắt đầu quản lý đội ngũ."}
                </p>
                {!filterRole && !filterStatus && (
                  <Button
                    variant="default"
                    onClick={() => openAddModal()}
                    iconName="UserPlus"
                    iconPosition="left"
                  >
                    Thêm nhân viên đầu tiên
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

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
        isInitializing={isInitializing}
        returnFocusRef={staffModalTriggerRef}
      />

      <StaffDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        staff={selectedStaffCard}
        detail={selectedStaffDetail}
        isLoading={isDetailLoading}
        onEdit={handleEditStaffFromDetails}
        returnFocusRef={staffDetailsTriggerRef}
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
        isLoading={Boolean(staffToDelete && isStaffBusy(staffToDelete.id))}
      />
    </section>
  )
}

export default StaffSection
