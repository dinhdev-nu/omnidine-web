import { useMemo } from 'react';
import { listMenuCategories, listMenuItems } from '@/services/menu';
import { useFetch } from '@/hooks/useFetch';
import { buildSearchTarget, matchesLooseSearch } from '@/lib/search-utils';
import type { MenuCategoryWithCount, MenuItemListResponse } from '@/types/domain/menu';

interface UseMainPosMenuDataParams {
  restaurantId?: string;
  activeCategory: string;
  searchQuery: string;
}

const fetchActiveCategories = async (restaurantId: string) => {
  return listMenuCategories(restaurantId, { include_inactive: false });
};

const fetchMenuItemsByCategory = async (restaurantId: string, activeCategory: string): Promise<MenuItemListResponse> => {
  return listMenuItems(restaurantId, {
    category_id: activeCategory === 'all' ? undefined : activeCategory,
    page: 1,
    limit: 100,
  });
};

const EMPTY_CATEGORIES: MenuCategoryWithCount[] = [];
const EMPTY_MENU_ITEMS: MenuItemListResponse['data'] = [];

export function useMainPosMenuData({ restaurantId, activeCategory, searchQuery }: UseMainPosMenuDataParams) {
  const normalizedRestaurantId = restaurantId ?? '';
  const enabled = Boolean(restaurantId);
  const categoriesFetchArgs = useMemo<[string]>(
    () => [normalizedRestaurantId],
    [normalizedRestaurantId]
  );
  const itemsFetchArgs = useMemo<[string, string]>(
    () => [normalizedRestaurantId, activeCategory],
    [activeCategory, normalizedRestaurantId]
  );

  const categoriesFetch = useFetch(fetchActiveCategories, categoriesFetchArgs, { enabled });
  const itemsFetch = useFetch(fetchMenuItemsByCategory, itemsFetchArgs, { enabled });

  const activeCategories = categoriesFetch.data?.data ?? EMPTY_CATEGORIES;
  const categoryMenuItems = itemsFetch.data?.data ?? EMPTY_MENU_ITEMS;

  const uiCategories = useMemo(() => {
    const mapped = activeCategories.map((category) => ({
      id: category._id,
      name: category.name,
      description: category.description,
      itemCount: category.item_count,
      imageUrl: category.image_url,
    }));

    const totalActiveItems = activeCategories.reduce((sum, category) => sum + category.item_count, 0);

    return [
      {
        id: 'all',
        name: 'Tất cả',
        icon: 'LayoutGrid',
        description: 'Hiển thị toàn bộ món ăn',
        itemCount: totalActiveItems,
        imageUrl: null,
      },
      ...mapped,
    ];
  }, [activeCategories]);

  const uiMenuItems = useMemo(() => {
    const filteredItems = categoryMenuItems.filter((item) => {
      const target = buildSearchTarget(item.name, item.description);
      return matchesLooseSearch(target, searchQuery);
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
      if (a.is_available === b.is_available) {
        return a.sort_order - b.sort_order;
      }
      return a.is_available ? -1 : 1;
    });

    return sortedItems.map((item) => ({
      _id: item._id,
      name: item.name,
      price: item.base_price,
      image: item.images?.[0]?.url,
      description: item.description ?? undefined,
      status: item.is_available ? 'available' as const : 'unavailable' as const,
      stock_quantity: item.is_available ? 99 : 0,
    }));
  }, [categoryMenuItems, searchQuery]);

  return {
    uiCategories,
    uiMenuItems,
    isLoadingMenuData: categoriesFetch.isLoading || itemsFetch.isLoading,
    menuError: categoriesFetch.error ?? itemsFetch.error,
  };
}
