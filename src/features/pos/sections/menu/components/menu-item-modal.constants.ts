import type { Category, MenuItemFormData } from "./menu-item-modal.types"

export const EMPTY_IMAGE_PREVIEW_URLS: string[] = []

export const EMPTY_CATEGORIES: Category[] = []

export const EMPTY_MENU_ITEM_ERRORS: Partial<
  Record<keyof MenuItemFormData, string>
> = {}

export const STATUS_OPTIONS = [
  { value: "available", label: "Có sẵn" },
  { value: "unavailable", label: "Hết hàng" },
]

export const FEATURED_OPTIONS = [
  { value: "normal", label: "Bình thường" },
  { value: "featured", label: "Nổi bật" },
]

export const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200",
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=200",
  "https://images.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_640.jpg",
]

export const DEFAULT_MENU_ITEM: MenuItemFormData = {
  name: "",
  description: "",
  price: "",
  sortOrder: "",
  category: "",
  imageUrls: [],
  status: "available",
  featured: "normal",
}
