import ConfirmationDialog from "../../../ui/ConfirmationDialog"
import CategoryFormModal from "./CategoryFormModal"
import CategoryManagerModal from "./CategoryManagerModal"
import MenuItemModal from "./MenuItemModal"
import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuDialogs({ controller }: MenuSectionViewProps) {
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
