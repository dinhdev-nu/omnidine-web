import React from "react"

import { useRequiredPosData } from "@/features/pos/contexts/usePosContext"

import { useCategoryForm } from "./useCategoryForm"
import { useMenuForm } from "./useMenuForm"
import { useMenuManagement } from "./useMenuManagement"

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

export function useMenuSectionController() {
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

export type MenuSectionController = ReturnType<typeof useMenuSectionController>
