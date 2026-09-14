import type { PublicRestaurantDetail } from './restaurant';

export interface MenuImage {
    url: string;
    alt?: string;
}

export interface MenuCategory {
    id: string;
    restaurant_id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface MenuCategoryWithCount extends MenuCategory {
    item_count: number;
}

export interface MenuItem {
    id: string;
    restaurant_id: string;
    category_id: string;
    name: string;
    description: string | null;
    base_price: number;
    images: MenuImage[];
    is_available: boolean;
    is_featured: boolean;
    sort_order: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

// ----------------------------------------------------------------------
// Queries
// ----------------------------------------------------------------------

export interface ListMenuCategoryQuery {
    include_inactive?: boolean;
}

export interface ListMenuItemsQuery {
    category_id?: string;
    is_available?: boolean;
    is_featured?: boolean;
    page?: number;
    limit?: number;
}

export interface MenuItemPaginationMeta {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface MenuItemListResponse {
    data: MenuItem[];
    pagination: MenuItemPaginationMeta;
}

// ----------------------------------------------------------------------
// Payloads DTOs
// ----------------------------------------------------------------------

export interface CreateMenuCategoryPayload {
    name: string;
    description?: string;
    image_url?: string;
    sort_order?: number;
}

export interface UpdateMenuCategoryPayload {
    name?: string;
    description?: string;
    image_url?: string;
}

export interface ReorderCommandPayload {
    order: string[]; // List of ObjectIds
}

export interface CreateMenuItemPayload {
    category_id: string;
    name: string;
    description?: string;
    base_price: number;
    is_available?: boolean;
    is_featured?: boolean;
    sort_order?: number;
}

export interface UpdateMenuItemPayload {
    category_id?: string;
    name?: string;
    description?: string;
    base_price?: number;
}

export interface AddMenuItemImagePayload {
    url: string;
    alt?: string;
}

// ----------------------------------------------------------------------
// Public Responses
// ----------------------------------------------------------------------

export interface PublicMenuItem {
    id: string;
    name: string;
    description: string | null;
    base_price: number;
    images: MenuImage[];
    is_featured: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface PublicMenuCategory {
    name: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    items: PublicMenuItem[];
}

export type PublicMenuRestaurant = Omit<PublicRestaurantDetail, 'created_at' | 'updated_at'>;

export interface PublicMenuResponse {
    restaurant: PublicMenuRestaurant;
    categories: PublicMenuCategory[];
}

export interface PublicMenuSearchItem {
    id: string;
    name: string;
    description: string | null;
    base_price: number;
    is_featured: boolean;
    images: MenuImage[];
    category: {
        id: string;
        name: string;
    };
    score: number;
}

export interface PublicMenuSearchResponse {
    query: string;
    data: PublicMenuSearchItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}
