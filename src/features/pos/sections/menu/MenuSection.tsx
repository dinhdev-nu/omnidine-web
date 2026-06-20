import React from "react"
import Icon from "@/components/AppIcon"
import Button from "../../ui/Button"
import ConfirmationDialog from "../../ui/ConfirmationDialog"
import Select from "../../ui/Select"
import { Spinner } from "../../ui/Spinner"

// Import components
import MenuItemCard from "./components/MenuItemCard"
import MenuItemModal from "./components/MenuItemModal"
import MenuTable from "./components/MenuTable"
import CategoryFilter from "./components/CategoryFilter"
import MenuStats from "./components/MenuStats"
import CategoryManagerModal from "./components/CategoryManagerModal"
import CategoryFormModal from "./components/CategoryFormModal"

// Import hooks
import { useMenuManagement } from "./hooks/useMenuManagement"
import { useMenuForm } from "./hooks/useMenuForm"
import { useCategoryForm } from "./hooks/useCategoryForm"
import { useRequiredPosData } from "@/features/pos/contexts/usePosContext"

type MenuViewMode = "table" | "grid"

type MenuCategoryToggleTarget = {
  id: string
  name: string
  isActive: boolean
}

type MenuUiState = {
  viewMode: MenuViewMode
  showDeleteDialog: boolean
  itemToDelete: string | null
  showCategoryManager: boolean
  showDeleteCategoryDialog: boolean
  categoryToDelete: string | null
  showToggleCategoryDialog: boolean
  categoryToToggle: MenuCategoryToggleTarget | null
  checkingToggleCategoryId: string | null
}

type MenuUiAction =
  | { type: "setViewMode"; viewMode: MenuViewMode }
  | { type: "requestDeleteItem"; itemId: string }
  | { type: "closeDeleteItem" }
  | { type: "setCategoryManagerOpen"; isOpen: boolean }
  | { type: "requestDeleteCategory"; categoryId: string }
  | { type: "closeDeleteCategory" }
  | { type: "requestToggleCategory"; category: MenuCategoryToggleTarget }
  | { type: "closeToggleCategory" }
  | { type: "setCheckingToggleCategoryId"; categoryId: string | null }

const menuUiInitialState: MenuUiState = {
  viewMode: "table",
  showDeleteDialog: false,
  itemToDelete: null,
  showCategoryManager: false,
  showDeleteCategoryDialog: false,
  categoryToDelete: null,
  showToggleCategoryDialog: false,
  categoryToToggle: null,
  checkingToggleCategoryId: null,
}

function menuUiReducer(state: MenuUiState, action: MenuUiAction): MenuUiState {
  switch (action.type) {
    case "setViewMode":
      return { ...state, viewMode: action.viewMode }
    case "requestDeleteItem":
      return { ...state, itemToDelete: action.itemId, showDeleteDialog: true }
    case "closeDeleteItem":
      return { ...state, itemToDelete: null, showDeleteDialog: false }
    case "setCategoryManagerOpen":
      return { ...state, showCategoryManager: action.isOpen }
    case "requestDeleteCategory":
      return {
        ...state,
        categoryToDelete: action.categoryId,
        showDeleteCategoryDialog: true,
      }
    case "closeDeleteCategory":
      return {
        ...state,
        categoryToDelete: null,
        showDeleteCategoryDialog: false,
      }
    case "requestToggleCategory":
      return {
        ...state,
        categoryToToggle: action.category,
        showToggleCategoryDialog: true,
      }
    case "closeToggleCategory":
      return {
        ...state,
        categoryToToggle: null,
        showToggleCategoryDialog: false,
      }
    case "setCheckingToggleCategoryId":
      return { ...state, checkingToggleCategoryId: action.categoryId }
    default:
      return state
  }
}

function useMenuSectionController() {
  const posData = useRequiredPosData()
  const restaurantId = posData.restaurant._id
  console.log("MenuSection rendered with restaurantId:", restaurantId)
  const [menuUi, dispatchMenuUi] = React.useReducer(
    menuUiReducer,
    menuUiInitialState
  )
  const {
    viewMode,
    showDeleteDialog,
    itemToDelete,
    showCategoryManager,
    showDeleteCategoryDialog,
    categoryToDelete,
    showToggleCategoryDialog,
    categoryToToggle,
    checkingToggleCategoryId,
  } = menuUi
  const isTableView = viewMode === "table"

  // Management hooks
  const {
    isLoadingData,
    categories,
    items,
    page,
    setPage,
    pagination,
    filterCategory,
    filterAvailability,
    filterFeatured,
    setLimit,
    handleCategoryChange,
    handleAvailabilityChange,
    handleFeaturedChange,
    menuStats,
    categoryMap,
    refetch,
    isItemActionPending,
    isCategoryActionPending,
    handleToggleAvailability,
    handleToggleFeatured,
    handleReorderItem,
    handleDeleteItem,
    handleReorderCategory,
    handleToggleCategoryActive,
    handleDeleteCategory,
    checkCategoryHasActiveItemsInCategory,
  } = useMenuManagement(restaurantId)

  const {
    showItemModal,
    setShowItemModal,
    isSubmitting: isSubmittingMenu,
    isUploadingImage: isUploadingMenuImage,
    isEditing: isEditingMenuItem,
    formData: itemFormData,
    imagePreviewUrls,
    handleFieldChange,
    handleImageFileChange,
    handleAddImageUrl,
    handleRemoveImageAt,
    handleSubmit: handleSubmitMenu,
    openAddItem,
    openEditItem,
    resetForm: resetMenuForm,
  } = useMenuForm(restaurantId, refetch)

  const {
    showCategoryModal,
    setShowCategoryModal,
    isSubmitting: isSubmittingCategory,
    editingCategoryId,
    openAddCategory,
    openEditCategory,
    categoryName,
    setCategoryName,
    categoryDescription,
    setCategoryDescription,
    categoryImageUrl,
    setCategoryImageUrl,
    categorySortOrder,
    setCategorySortOrder,
    handleSubmitCategory,
    resetForm: resetCategoryForm,
  } = useCategoryForm(restaurantId, refetch)

  // Category filter formatting properties that child expects
  const uiCategories = React.useMemo(
    () =>
      categories.map((cat) => ({
        id: cat._id,
        name: cat.name,
        imageUrl: cat.image_url,
      })),
    [categories]
  )

  const uiItemCounts = React.useMemo(
    () =>
      categories.reduce(
        (acc, cat) => {
          acc[cat._id] = cat.item_count || 0
          return acc
        },
        {} as Record<string, number>
      ),
    [categories]
  )

  const requestToggleCategory = React.useCallback(
    async (categoryId: string, isActive: boolean) => {
      const category = categories.find((cat) => cat._id === categoryId)
      if (!category) return

      if (!isActive) {
        await handleToggleCategoryActive(categoryId, isActive)
        return
      }

      dispatchMenuUi({ type: "setCheckingToggleCategoryId", categoryId })
      try {
        const hasActiveItems =
          await checkCategoryHasActiveItemsInCategory(categoryId)
        if (hasActiveItems) {
          dispatchMenuUi({
            type: "requestToggleCategory",
            category: { id: categoryId, name: category.name, isActive },
          })
          return
        }
        await handleToggleCategoryActive(categoryId, isActive)
      } finally {
        dispatchMenuUi({
          type: "setCheckingToggleCategoryId",
          categoryId: null,
        })
      }
    },
    [
      categories,
      checkCategoryHasActiveItemsInCategory,
      handleToggleCategoryActive,
    ]
  )

  return {
    isLoadingData,
    categories,
    items,
    page,
    setPage,
    pagination,
    filterCategory,
    filterAvailability,
    filterFeatured,
    setLimit,
    handleCategoryChange,
    handleAvailabilityChange,
    handleFeaturedChange,
    menuStats,
    categoryMap,
    isItemActionPending,
    isCategoryActionPending,
    handleToggleAvailability,
    handleToggleFeatured,
    handleReorderItem,
    handleDeleteItem,
    handleReorderCategory,
    handleToggleCategoryActive,
    handleDeleteCategory,
    viewMode,
    showDeleteDialog,
    itemToDelete,
    showCategoryManager,
    showDeleteCategoryDialog,
    categoryToDelete,
    showToggleCategoryDialog,
    categoryToToggle,
    checkingToggleCategoryId,
    isTableView,
    dispatchMenuUi,
    showItemModal,
    setShowItemModal,
    isSubmittingMenu,
    isUploadingMenuImage,
    isEditingMenuItem,
    itemFormData,
    imagePreviewUrls,
    handleFieldChange,
    handleImageFileChange,
    handleAddImageUrl,
    handleRemoveImageAt,
    handleSubmitMenu,
    openAddItem,
    openEditItem,
    resetMenuForm,
    showCategoryModal,
    setShowCategoryModal,
    isSubmittingCategory,
    editingCategoryId,
    openAddCategory,
    openEditCategory,
    categoryName,
    setCategoryName,
    categoryDescription,
    setCategoryDescription,
    categoryImageUrl,
    setCategoryImageUrl,
    categorySortOrder,
    setCategorySortOrder,
    handleSubmitCategory,
    resetCategoryForm,
    uiCategories,
    uiItemCounts,
    requestToggleCategory,
  }
}

type MenuSectionController = ReturnType<typeof useMenuSectionController>

interface MenuSectionViewProps {
  controller: MenuSectionController
}

function MenuLoadingState() {
  return (
    <div className="flex items-center justify-center gap-3 p-6 text-muted-foreground">
      <Spinner className="size-5" />
      <span className="text-sm">Đang tải danh sách món ăn...</span>
    </div>
  )
}

function MenuPageHeader({ controller }: MenuSectionViewProps) {
  const { isTableView, dispatchMenuUi, openAddItem, menuStats } = controller
  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Quản lý thực đơn
          </h1>
          <p className="text-muted-foreground">
            Quản lý món ăn, giá cả và tình trạng kho hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center rounded-lg bg-muted p-1">
            <Button
              variant={isTableView ? "default" : "ghost"}
              size="sm"
              onClick={() =>
                dispatchMenuUi({ type: "setViewMode", viewMode: "table" })
              }
              iconName="Table"
              className="px-3"
            >
              Bảng
            </Button>
            <Button
              variant={isTableView ? "ghost" : "default"}
              size="sm"
              onClick={() =>
                dispatchMenuUi({ type: "setViewMode", viewMode: "grid" })
              }
              iconName="Grid3X3"
              className="px-3"
            >
              Lưới
            </Button>
          </div>

          <Button
            variant="default"
            onClick={openAddItem}
            iconName="Plus"
            iconPosition="left"
            className="hover-scale"
          >
            Thêm món mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      <MenuStats stats={menuStats} />
    </div>
  )
}

function MenuFiltersPanel({ controller }: MenuSectionViewProps) {
  const {
    filterAvailability,
    handleAvailabilityChange,
    filterFeatured,
    handleFeaturedChange,
    uiCategories,
    filterCategory,
    handleCategoryChange,
    pagination,
    setPage,
    setLimit,
    uiItemCounts,
    openAddCategory,
    dispatchMenuUi,
  } = controller
  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-6">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Select
            placeholder="Lọc trạng thái bán"
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "available", label: "Đang bán" },
              { value: "unavailable", label: "Tạm ngưng" },
            ]}
            value={filterAvailability}
            onChange={(e) =>
              handleAvailabilityChange(
                e.target.value as "all" | "available" | "unavailable"
              )
            }
          />

          <Select
            placeholder="Lọc nổi bật"
            options={[
              { value: "all", label: "Tất cả" },
              { value: "featured", label: "Nổi bật" },
              { value: "normal", label: "Bình thường" },
            ]}
            value={filterFeatured}
            onChange={(e) =>
              handleFeaturedChange(
                e.target.value as "all" | "featured" | "normal"
              )
            }
          />

          <Select
            placeholder="Lọc danh mục"
            options={[
              { value: "all", label: "Tất cả danh mục" },
              ...uiCategories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
            value={filterCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          />

          <Select
            placeholder="Số món mỗi trang"
            options={[
              { value: "10", label: "10 món" },
              { value: "25", label: "25 món" },
              { value: "50", label: "50 món" },
              { value: "100", label: "100 món" },
            ]}
            value={String(pagination.limit || 50)}
            onChange={(e) => {
              setPage(1)
              setLimit(Number(e.target.value))
            }}
          />
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={uiCategories}
          selectedCategory={filterCategory}
          onCategoryChange={handleCategoryChange}
          itemCounts={uiItemCounts}
          onAddCategory={openAddCategory}
          onManageCategories={() =>
            dispatchMenuUi({
              type: "setCategoryManagerOpen",
              isOpen: true,
            })
          }
        />
      </div>
    </div>
  )
}

function MenuResultsSummary({ controller }: MenuSectionViewProps) {
  const { items, filterCategory, categoryMap } = controller
  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Hiển thị {items.length} món ăn
      </p>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {items.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Filter" size={16} />
            <span>
              {filterCategory !== "all" &&
                `Danh mục: ${categoryMap[filterCategory] ?? ""}`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function MenuContent({ controller }: MenuSectionViewProps) {
  const {
    isTableView,
    items,
    categoryMap,
    openEditItem,
    dispatchMenuUi,
    handleToggleAvailability,
    handleToggleFeatured,
    handleReorderItem,
    isItemActionPending,
  } = controller
  return (
    <>
      {isTableView ? (
        <MenuTable
          items={items}
          categoryMap={categoryMap}
          onEdit={openEditItem}
          onDelete={(id) =>
            dispatchMenuUi({ type: "requestDeleteItem", itemId: id })
          }
          onToggleAvailability={handleToggleAvailability}
          onToggleFeatured={handleToggleFeatured}
          onMoveItem={handleReorderItem}
          isItemActionPending={isItemActionPending}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              categoryName={categoryMap[item.category_id] ?? "Không rõ"}
              onEdit={openEditItem}
              onDelete={(id) =>
                dispatchMenuUi({ type: "requestDeleteItem", itemId: id })
              }
              onToggleAvailability={handleToggleAvailability}
              onToggleFeatured={handleToggleFeatured}
              onMoveItem={handleReorderItem}
              isItemActionPending={isItemActionPending}
            />
          ))}

          {items.length === 0 && (
            <div className="col-span-full p-12 text-center">
              <Icon
                name="Search"
                size={48}
                className="mx-auto mb-4 text-muted-foreground"
              />
              <h3 className="mb-2 text-lg font-medium text-foreground">
                Không tìm thấy món ăn nào
              </h3>
              <p className="mb-4 text-muted-foreground">
                Thử thay đổi bộ lọc hoặc thêm món mới
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

function MenuPagination({ controller }: MenuSectionViewProps) {
  const { page, setPage, pagination } = controller
  return (
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
        Trang {pagination.page}/{Math.max(pagination.total_pages || 1, 1)}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page >= Math.max(pagination.total_pages || 1, 1)}
        onClick={() => setPage((p) => p + 1)}
      >
        Sau
      </Button>
    </div>
  )
}

function MenuDialogs({ controller }: MenuSectionViewProps) {
  const {
    showItemModal,
    isSubmittingMenu,
    isUploadingMenuImage,
    isEditingMenuItem,
    setShowItemModal,
    resetMenuForm,
    handleSubmitMenu,
    handleFieldChange,
    handleImageFileChange,
    handleAddImageUrl,
    handleRemoveImageAt,
    imagePreviewUrls,
    itemFormData,
    uiCategories,
    showDeleteDialog,
    dispatchMenuUi,
    itemToDelete,
    handleDeleteItem,
    isItemActionPending,
    showDeleteCategoryDialog,
    categoryToDelete,
    handleDeleteCategory,
    isCategoryActionPending,
    showToggleCategoryDialog,
    categoryToToggle,
    handleToggleCategoryActive,
    showCategoryManager,
    categories,
    openEditCategory,
    requestToggleCategory,
    handleReorderCategory,
    checkingToggleCategoryId,
    showCategoryModal,
    isSubmittingCategory,
    editingCategoryId,
    categoryName,
    categoryDescription,
    categoryImageUrl,
    categorySortOrder,
    setShowCategoryModal,
    resetCategoryForm,
    handleSubmitCategory,
    setCategoryName,
    setCategoryDescription,
    setCategoryImageUrl,
    setCategorySortOrder,
  } = controller
  return (
    <>
      <MenuItemModal
        isOpen={showItemModal}
        isLoading={isSubmittingMenu || isUploadingMenuImage}
        isEditing={isEditingMenuItem}
        onClose={() => {
          setShowItemModal(false)
          resetMenuForm()
        }}
        onSave={handleSubmitMenu}
        onFieldChange={handleFieldChange}
        onImageFileChange={handleImageFileChange}
        onAddImageUrl={handleAddImageUrl}
        onRemoveImageAt={handleRemoveImageAt}
        imagePreviewUrls={imagePreviewUrls}
        item={itemFormData}
        categories={uiCategories}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => dispatchMenuUi({ type: "closeDeleteItem" })}
        onConfirm={async () => {
          if (itemToDelete) {
            const ok = await handleDeleteItem(itemToDelete)
            if (ok) {
              dispatchMenuUi({ type: "closeDeleteItem" })
            }
          }
        }}
        title="Xóa món ăn"
        message={
          "Bạn có chắc chắn muốn xóa món này? Hành động này thao tác vĩnh viễn trên cơ sở dữ liệu."
        }
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        icon="Trash2"
        isLoading={
          itemToDelete ? isItemActionPending(itemToDelete, "delete") : false
        }
      />

      <ConfirmationDialog
        isOpen={showDeleteCategoryDialog}
        onClose={() => dispatchMenuUi({ type: "closeDeleteCategory" })}
        onConfirm={async () => {
          if (categoryToDelete) {
            const ok = await handleDeleteCategory(categoryToDelete)
            if (ok) {
              dispatchMenuUi({ type: "closeDeleteCategory" })
            }
          }
        }}
        title="Xóa danh mục"
        message={
          "Danh mục chỉ có thể xóa khi không còn món. Bạn có chắc chắn muốn tiếp tục?"
        }
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        icon="Trash2"
        isLoading={
          categoryToDelete
            ? isCategoryActionPending(categoryToDelete, "delete")
            : false
        }
      />

      <ConfirmationDialog
        isOpen={showToggleCategoryDialog}
        onClose={() => dispatchMenuUi({ type: "closeToggleCategory" })}
        onConfirm={async () => {
          if (categoryToToggle) {
            const ok = await handleToggleCategoryActive(
              categoryToToggle.id,
              categoryToToggle.isActive
            )
            if (ok) {
              dispatchMenuUi({ type: "closeToggleCategory" })
            }
          }
        }}
        title="Ẩn danh mục còn món đang bán"
        message={`Danh mục "${categoryToToggle?.name ?? ""}" vẫn còn món đang ở trạng thái active. Bạn có muốn tiếp tục ẩn danh mục này không?`}
        confirmText="Vẫn ẩn"
        cancelText="Hủy"
        variant="warning"
        icon="AlertTriangle"
        isLoading={
          categoryToToggle
            ? isCategoryActionPending(categoryToToggle.id, "toggle-active")
            : false
        }
      />

      <CategoryManagerModal
        isOpen={showCategoryManager}
        categories={categories}
        onClose={() =>
          dispatchMenuUi({
            type: "setCategoryManagerOpen",
            isOpen: false,
          })
        }
        onEdit={(category) => {
          openEditCategory(category)
          dispatchMenuUi({
            type: "setCategoryManagerOpen",
            isOpen: false,
          })
        }}
        onToggleActive={requestToggleCategory}
        onDelete={(categoryId) =>
          dispatchMenuUi({
            type: "requestDeleteCategory",
            categoryId,
          })
        }
        onMove={handleReorderCategory}
        checkingToggleCategoryId={checkingToggleCategoryId}
        isCategoryActionPending={isCategoryActionPending}
      />

      <CategoryFormModal
        isOpen={showCategoryModal}
        isSubmitting={isSubmittingCategory}
        isEditing={Boolean(editingCategoryId)}
        categoryName={categoryName}
        categoryDescription={categoryDescription}
        categoryImageUrl={categoryImageUrl}
        categorySortOrder={categorySortOrder}
        onClose={() => {
          setShowCategoryModal(false)
          resetCategoryForm()
        }}
        onSubmit={handleSubmitCategory}
        onCategoryNameChange={setCategoryName}
        onCategoryDescriptionChange={setCategoryDescription}
        onCategoryImageUrlChange={setCategoryImageUrl}
        onCategorySortOrderChange={setCategorySortOrder}
      />
    </>
  )
}

function MenuSectionContent({ controller }: MenuSectionViewProps) {
  if (controller.isLoadingData) {
    return <MenuLoadingState />
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <MenuPageHeader controller={controller} />
      <MenuFiltersPanel controller={controller} />
      <MenuResultsSummary controller={controller} />
      <MenuContent controller={controller} />
      <MenuPagination controller={controller} />
      <MenuDialogs controller={controller} />
    </div>
  )
}

const MenuSection: React.FC = () => {
  const controller = useMenuSectionController()

  return (
    <div>
      <MenuSectionContent controller={controller} />
    </div>
  )
}

export default MenuSection
