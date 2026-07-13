import React from 'react';
import { toast } from 'sonner';
import {
    createMenuCategory,
    updateMenuCategory,
    toMenuEndpointError,
} from '@/services/menu';
import type { MenuCategoryWithCount } from '@/types/domain/menu';

export function useCategoryForm(restaurantId: string, onSuccess: () => void) {
    const [showCategoryModal, setShowCategoryModal] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const [editingCategoryId, setEditingCategoryId] = React.useState<string | null>(null);
    const [categoryName, setCategoryNameValue] = React.useState('');
    const [categoryDescription, setCategoryDescription] = React.useState('');
    const [categoryImageUrl, setCategoryImageUrl] = React.useState('');
    const [categorySortOrder, setCategorySortOrderValue] = React.useState('');
    const [categoryNameError, setCategoryNameError] = React.useState<string | null>(null);
    const [categorySortOrderError, setCategorySortOrderError] = React.useState<string | null>(null);
    const categoryModalTriggerRef = React.useRef<HTMLElement | null>(null);

    const setCategoryName = React.useCallback((value: string) => {
        setCategoryNameValue(value);
        setCategoryNameError(null);
    }, []);

    const setCategorySortOrder = React.useCallback((value: string) => {
        setCategorySortOrderValue(value);
        setCategorySortOrderError(null);
    }, []);

    const resetForm = () => {
        setEditingCategoryId(null);
        setCategoryNameValue('');
        setCategoryDescription('');
        setCategoryImageUrl('');
        setCategorySortOrderValue('');
        setCategoryNameError(null);
        setCategorySortOrderError(null);
    };

    const openAddCategory = () => {
        categoryModalTriggerRef.current = document.activeElement as HTMLElement | null;
        resetForm();
        setShowCategoryModal(true);
    };

    const openEditCategory = (category: MenuCategoryWithCount) => {
        categoryModalTriggerRef.current = document.activeElement as HTMLElement | null;
        setEditingCategoryId(category._id);
        setCategoryNameValue(category.name);
        setCategoryDescription(category.description || '');
        setCategoryImageUrl(category.image_url || '');
        setCategorySortOrderValue(String(category.sort_order));
        setShowCategoryModal(true);
    };

    const handleSubmitCategory = async () => {
        const normalizedName = categoryName.trim();
        const normalizedSortOrder = categorySortOrder.trim();
        let hasError = false;

        if (!normalizedName) {
            setCategoryNameError('Vui lòng nhập tên danh mục');
            hasError = true;
        }

        if (normalizedSortOrder) {
            const parsed = Number(normalizedSortOrder);
            if (!Number.isInteger(parsed) || parsed < 0) {
                setCategorySortOrderError('Thứ tự hiển thị phải là số nguyên lớn hơn hoặc bằng 0');
                hasError = true;
            }
        }

        if (hasError) {
            toast.error('Vui lòng kiểm tra lại thông tin danh mục');
            return;
        }

        setCategoryNameError(null);
        setCategorySortOrderError(null);

        setIsSubmitting(true);
        try {
            if (editingCategoryId) {
                await updateMenuCategory(restaurantId, editingCategoryId, {
                    name: normalizedName,
                    description: categoryDescription.trim() || undefined,
                    image_url: categoryImageUrl.trim() || undefined,
                });
                toast.success('Cập nhật danh mục thành công');
            } else {
                await createMenuCategory(restaurantId, {
                    name: normalizedName,
                    description: categoryDescription.trim() || undefined,
                    image_url: categoryImageUrl.trim() || undefined,
                    sort_order: normalizedSortOrder ? Number(normalizedSortOrder) : undefined,
                });
                toast.success('Thêm danh mục thành công');
            }

            setShowCategoryModal(false);
            resetForm();
            onSuccess();
        } catch (error) {
            toast.error(toMenuEndpointError(editingCategoryId ? 'update category' : 'create category', error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        showCategoryModal,
        setShowCategoryModal,
        isSubmitting,
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
        categoryNameError,
        categorySortOrderError,
        handleSubmitCategory,
        resetForm,
        categoryModalTriggerRef,
    };
}
