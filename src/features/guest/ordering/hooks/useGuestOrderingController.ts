import { useCallback, useEffect, useMemo, useReducer } from "react"
import { toast } from "sonner"

import { useFetch } from "@/hooks/useFetch"
import { searchPublicMenu, getPublicMenu } from "@/services/menu"
import { createPublicOrder } from "@/services/orders"
import { getPublicTableByQrCode, listTables } from "@/services/tables"
import { useUserStore } from "@/stores/user-store"
import type { OperatingHours } from "@/types/domain/restaurant"
import type { CreatePublicOrderPayload } from "@/types/domain/order"
import type { TableListResponse } from "@/types/domain/table"
import type {
  CartItem,
  OrderingMenuItem,
  OrderingUser,
} from "@/features/guest/ordering"

export type PublicOrderType = CreatePublicOrderPayload["order_type"] | ""
interface GuestOrderingState {
  activeCategory: string
  cartItems: CartItem[]
  showMobileCart: boolean
  showClearCartDialog: boolean
  isCreatingOrder: boolean
  searchQuery: string
  debouncedQuery: string
  flexibleOrderType: PublicOrderType
  manualSelectedTableId: string | null
  customerNameOverride: string | null
  customerContactOverride: string | null
  orderNotes: string
}

type GuestOrderingAction =
  | { type: "setActiveCategory"; value: string }
  | { type: "setSearchQuery"; value: string }
  | { type: "setDebouncedQuery"; value: string }
  | { type: "setFlexibleOrderType"; value: PublicOrderType }
  | { type: "setManualSelectedTableId"; value: string | null }
  | { type: "setCustomerNameOverride"; value: string | null }
  | { type: "setCustomerContactOverride"; value: string | null }
  | { type: "setOrderNotes"; value: string }
  | { type: "openMobileCart" }
  | { type: "closeMobileCart" }
  | { type: "openClearCartDialog" }
  | { type: "closeClearCartDialog" }
  | { type: "addCartItem"; item: OrderingMenuItem }
  | { type: "updateCartQuantity"; itemId: string; quantity: number }
  | { type: "removeCartItem"; itemId: string }
  | { type: "updateCartNote"; itemId: string; note: string }
  | { type: "clearCart" }
  | { type: "createOrderStarted" }
  | { type: "createOrderSucceeded" }
  | { type: "createOrderFinished" }

const initialGuestOrderingState: GuestOrderingState = {
  activeCategory: "all",
  cartItems: [],
  showMobileCart: false,
  showClearCartDialog: false,
  isCreatingOrder: false,
  searchQuery: "",
  debouncedQuery: "",
  flexibleOrderType: "",
  manualSelectedTableId: null,
  customerNameOverride: null,
  customerContactOverride: null,
  orderNotes: "",
}

function guestOrderingReducer(
  state: GuestOrderingState,
  action: GuestOrderingAction
): GuestOrderingState {
  switch (action.type) {
    case "setActiveCategory":
      return { ...state, activeCategory: action.value }
    case "setSearchQuery":
      return { ...state, searchQuery: action.value }
    case "setDebouncedQuery":
      return { ...state, debouncedQuery: action.value }
    case "setFlexibleOrderType":
      return { ...state, flexibleOrderType: action.value }
    case "setManualSelectedTableId":
      return { ...state, manualSelectedTableId: action.value }
    case "setCustomerNameOverride":
      return { ...state, customerNameOverride: action.value }
    case "setCustomerContactOverride":
      return { ...state, customerContactOverride: action.value }
    case "setOrderNotes":
      return { ...state, orderNotes: action.value }
    case "openMobileCart":
      return { ...state, showMobileCart: true }
    case "closeMobileCart":
      return { ...state, showMobileCart: false }
    case "openClearCartDialog":
      return { ...state, showClearCartDialog: true }
    case "closeClearCartDialog":
      return { ...state, showClearCartDialog: false }
    case "addCartItem": {
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem._id === action.item._id
      )

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((cartItem) =>
            cartItem._id === action.item._id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        }
      }

      return {
        ...state,
        cartItems: [
          ...state.cartItems,
          { ...action.item, quantity: 1, note: "" },
        ],
      }
    }
    case "updateCartQuantity":
      if (action.quantity <= 0) {
        return {
          ...state,
          cartItems: state.cartItems.filter(
            (item) => item._id !== action.itemId
          ),
        }
      }

      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === action.itemId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      }
    case "removeCartItem":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item._id !== action.itemId),
      }
    case "updateCartNote":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === action.itemId ? { ...item, note: action.note } : item
        ),
      }
    case "clearCart":
      return { ...state, cartItems: [] }
    case "createOrderStarted":
      return { ...state, isCreatingOrder: true }
    case "createOrderSucceeded":
      return {
        ...state,
        cartItems: [],
        showMobileCart: false,
        isCreatingOrder: false,
      }
    case "createOrderFinished":
      return { ...state, isCreatingOrder: false }
    default:
      return state
  }
}

const fetchAvailableActiveTables = async (
  restaurantId: string
): Promise<TableListResponse> => {
  return listTables(restaurantId, {
    status: "available",
    is_active: true,
  })
}

// Helper to check if restaurant is currently open based on operating_hours
const isRestaurantCurrentlyOpen = (
  operatingHours: OperatingHours | null
): boolean => {
  if (!operatingHours) return false

  const now = new Date()
  const dayNames: Array<"sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"> =
    ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
  const todayKey = dayNames[now.getDay()]

  const todayHours = operatingHours[todayKey]
  if (!todayHours || todayHours.closed) return false

  const [openHour, openMin] = todayHours.open?.split(":").map(Number) || [0, 0]
  const [closeHour, closeMin] = todayHours.close?.split(":").map(Number) || [
    0, 0,
  ]

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = openHour * 60 + openMin
  const closeMinutes = closeHour * 60 + closeMin

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}

export interface GuestOrderingProps {
  tableQrCode?: string
  restaurantSlug?: string
}

export function useGuestOrderingController({
  tableQrCode,
  restaurantSlug: propRestaurantSlug,
}: GuestOrderingProps) {
  const profile = useUserStore((state) => state.profile)
  const user = profile as OrderingUser | null
  const tableFetchArgs = useMemo<[string]>(
    () => [tableQrCode ?? ""],
    [tableQrCode]
  )

  // --- API Data Fetching ---
  const {
    data: tableData,
    error: tableError,
    isLoading: isTableLoading,
  } = useFetch(
    getPublicTableByQrCode,
    tableFetchArgs,
    { enabled: !!tableQrCode }
  )

  const isTableFixed = !!tableQrCode
  const resolvedSlug = tableData?.restaurant?.slug || propRestaurantSlug
  const initialTable = tableData?.table_id || null
  const menuFetchArgs = useMemo<[string]>(
    () => [resolvedSlug ?? ""],
    [resolvedSlug]
  )

  const {
    data: menuData,
    error: menuError,
    isLoading: isMenuLoading,
  } = useFetch(
    getPublicMenu,
    menuFetchArgs,
    { enabled: !!resolvedSlug }
  )

  const restaurantId = menuData?.restaurant?._id ?? null

  const isOperational =
    (menuData?.restaurant?.is_published ?? false) &&
    isRestaurantCurrentlyOpen(menuData?.restaurant?.operating_hours ?? null)
  const [orderingState, dispatchOrdering] = useReducer(
    guestOrderingReducer,
    initialGuestOrderingState
  )
  const {
    activeCategory,
    cartItems,
    showMobileCart,
    showClearCartDialog,
    isCreatingOrder,
    searchQuery,
    debouncedQuery,
    flexibleOrderType,
    manualSelectedTableId,
    customerNameOverride,
    customerContactOverride,
    orderNotes,
  } = orderingState

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatchOrdering({ type: "setDebouncedQuery", value: searchQuery })
    }, 500)
    return () => clearTimeout(handler)
  }, [searchQuery])

  const searchFetchArgs = useMemo<[string, string]>(
    () => [resolvedSlug ?? "", debouncedQuery],
    [debouncedQuery, resolvedSlug]
  )

  const { data: searchData } = useFetch(searchPublicMenu, searchFetchArgs, {
    enabled: !!resolvedSlug && !!debouncedQuery,
  })
  const defaultCustomerName = user?.full_name || user?.user_name || ""
  const defaultCustomerContact = user?.phone || ""
  const selectedOrderType = isTableFixed ? "dine_in" : flexibleOrderType
  const selectedTableId = isTableFixed ? initialTable : manualSelectedTableId
  const customerName = customerNameOverride ?? defaultCustomerName
  const customerContact = customerContactOverride ?? defaultCustomerContact

  const handleOrderTypeChange = useCallback(
    (value: PublicOrderType) => {
      if (!isTableFixed) {
        dispatchOrdering({ type: "setFlexibleOrderType", value })
      }
    },
    [isTableFixed]
  )

  const handleTableChange = useCallback(
    (value: string) => {
      if (!isTableFixed) {
        dispatchOrdering({
          type: "setManualSelectedTableId",
          value: value || null,
        })
      }
    },
    [isTableFixed]
  )

  const availableTablesFetchArgs = useMemo<[string]>(
    () => [restaurantId ?? ""],
    [restaurantId]
  )

  const { data: availableTablesData } = useFetch(
    fetchAvailableActiveTables,
    availableTablesFetchArgs,
    { enabled: !!restaurantId && !isTableFixed }
  )

  const categories = useMemo(() => {
    if (!menuData?.categories) return []
    return menuData.categories.map((cat) => ({
      id: cat.name, // or _id if they had one, but public category doesn't expose _id. Using name.
      name: cat.name,
      imageUrl: cat.image_url,
      description: cat.description,
      itemCount: cat.items?.length ?? 0,
    }))
  }, [menuData])

  const menuItems = useMemo(() => {
    if (!menuData?.categories) return []
    const allItems: OrderingMenuItem[] = []
    menuData.categories.forEach((cat) => {
      cat.items.forEach((item) => {
        allItems.push({
          _id: item._id,
          name: item.name,
          description: item.description || "",
          price: item.base_price,
          category: cat.name,
          status: "available", // public items are always available
          stock_quantity: 99,
          image: item.images?.[0]?.url || "/assets/images/placeholder.png",
        })
      })
    })
    return allItems
  }, [menuData])

  const tableOptions = useMemo(() => {
    if (isTableFixed && tableData) {
      return [
        {
          value: tableData.table_id,
          label: `${tableData.table_number}${tableData.name ? ` - ${tableData.name}` : ""} (${tableData.capacity})`,
        },
      ]
    }
    return (availableTablesData?.data ?? []).reduce<
      Array<{ value: string; label: string }>
    >((options, table) => {
      const value = table._id || table.id || ""
      if (!value) {
        return options
      }

      options.push({
        value,
        label: `${table.table_number}${table.name ? ` - ${table.name}` : ""} (${table.capacity})`,
      })
      return options
    }, [])
  }, [availableTablesData?.data, isTableFixed, tableData])

  useEffect(() => {
    const handleClearCartShortcut = (event: KeyboardEvent) => {
      if (event.key === "F4") {
        event.preventDefault()
        if (cartItems.length > 0) {
          dispatchOrdering({ type: "openClearCartDialog" })
        }
      }
    }

    window.addEventListener("keydown", handleClearCartShortcut)
    return () => window.removeEventListener("keydown", handleClearCartShortcut)
  }, [cartItems.length])

  useEffect(() => {
    const handleMobileCartShortcut = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return

      const eventTarget = event.target
      if (
        showClearCartDialog ||
        (eventTarget instanceof Element && eventTarget.closest('[role="dialog"]'))
      ) {
        return
      }

      dispatchOrdering({ type: "closeMobileCart" })
    }

    window.addEventListener("keydown", handleMobileCartShortcut)
    return () => window.removeEventListener("keydown", handleMobileCartShortcut)
  }, [showClearCartDialog])

  useEffect(() => {
    const handleCategoryShortcut = (event: KeyboardEvent) => {
      if (
        event.key >= "1" &&
        event.key <= "5" &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        const categoryIndex = Number(event.key) - 1
        if (categories[categoryIndex]) {
          dispatchOrdering({
            type: "setActiveCategory",
            value: categories[categoryIndex].id,
          })
        }
      }
    }

    window.addEventListener("keydown", handleCategoryShortcut)
    return () => window.removeEventListener("keydown", handleCategoryShortcut)
  }, [categories])

  const displayedItems = useMemo(() => {
    if (debouncedQuery && searchData?.data) {
      return searchData.data.map(
        (item) =>
          ({
            _id: item._id,
            name: item.name,
            description: item.description || "",
            price: item.base_price,
            category: item.category.name,
            status: "available",
            stock_quantity: 99,
            image: item.images?.[0]?.url || "/assets/images/placeholder.png",
          }) as OrderingMenuItem
      )
    }

    let filtered = menuItems
    if (activeCategory !== "all") {
      filtered = filtered.filter((item) => item.category === activeCategory)
    }

    // Apply local search immediately while debounced query is fetching
    if (searchQuery && !debouncedQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery)
      )
    }

    return filtered
  }, [menuItems, activeCategory, searchQuery, debouncedQuery, searchData])

  const handleAddToCart = (item: OrderingMenuItem) => {
    if (item.stock_quantity === 0 || item.status === "unavailable") {
      toast.error(`${item.name} hiện đã hết hàng`)
      return
    }

    const existingItem = cartItems.find((cartItem) => cartItem._id === item._id)
    if (existingItem) {
      toast.success(`${item.name} x${existingItem.quantity + 1}`)
    } else {
      toast.success(`Đã thêm ${item.name} vào giỏ`)
    }

    dispatchOrdering({ type: "addCartItem", item })
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    dispatchOrdering({
      type: "updateCartQuantity",
      itemId,
      quantity: newQuantity,
    })
  }

  const handleRemoveItem = (itemId: string) => {
    dispatchOrdering({ type: "removeCartItem", itemId })
  }

  const handleUpdateNote = (itemId: string, note: string) => {
    dispatchOrdering({ type: "updateCartNote", itemId, note })
  }

  const handleClearCart = useCallback(() => {
    dispatchOrdering({ type: "clearCart" })
    toast.success("Đã xóa toàn bộ món trong giỏ hàng")
  }, [])

  const handleOpenClearCartDialog = useCallback(() => {
    dispatchOrdering({ type: "openClearCartDialog" })
  }, [])

  const handleCloseClearCartDialog = useCallback(() => {
    dispatchOrdering({ type: "closeClearCartDialog" })
  }, [])

  const handleConfirmClearCart = useCallback(() => {
    handleClearCart()
    dispatchOrdering({ type: "closeClearCartDialog" })
  }, [handleClearCart])

  const handleCreateOrder = async () => {
    if (!isOperational) {
      toast.error("Không thể đặt hàng khi nhà hàng đã đóng cửa.")
      return
    }

    if (cartItems.length === 0) {
      toast.error("Vui lòng thêm món vào giỏ hàng để tạo đơn.")
      return
    }

    if (!selectedOrderType) {
      toast.error("Vui lòng chọn loại đơn hàng trước khi tạo đơn.")
      return
    }

    if (selectedOrderType === "dine_in" && !selectedTableId) {
      toast.error("Vui lòng chọn bàn trước khi tạo đơn.")
      return
    }

    if (!restaurantId) {
      toast.error("Không thể xác định nhà hàng để tạo đơn.")
      return
    }

    const orderType: CreatePublicOrderPayload["order_type"] = selectedOrderType
    const tableId =
      orderType === "dine_in" ? (selectedTableId ?? undefined) : undefined
    const resolvedCustomerName = customerName.trim()
    const resolvedCustomerContact = customerContact.trim()
    const resolvedNotes = orderNotes.trim()
    const source = isTableFixed ? "qr" : "app"

    const payload: CreatePublicOrderPayload = {
      restaurant_id: restaurantId,
      order_type: orderType,
      table_id: tableId,
      source,
      customer_name:
        resolvedCustomerName || user?.full_name || user?.user_name || null,
      customer_phone: resolvedCustomerContact || user?.phone || null,
      notes: resolvedNotes || null,
      items: cartItems.map((item) => ({
        menu_item_id: item._id,
        quantity: item.quantity,
        notes: item.note ?? null,
      })),
    }

    try {
      dispatchOrdering({ type: "createOrderStarted" })
      const response = await createPublicOrder(payload)

      toast.success(response.message || "Tạo đơn hàng thành công")
      dispatchOrdering({ type: "createOrderSucceeded" })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tạo đơn hàng."
      )
      dispatchOrdering({ type: "createOrderFinished" })
    }
  }

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  )

  return {
    tableError,
    menuError,
    isLoading:
      isTableLoading ||
      isMenuLoading ||
      Boolean(resolvedSlug && !menuData && !menuError),
    isOperational,
    user,
    menuData,
    resolvedSlug,
    showMobileCart,
    searchQuery,
    dispatchOrdering,
    menuItems,
    categories,
    activeCategory,
    displayedItems,
    handleAddToCart,
    cartItems,
    handleUpdateQuantity,
    handleRemoveItem,
    handleUpdateNote,
    handleOpenClearCartDialog,
    selectedOrderType,
    handleOrderTypeChange,
    selectedTableId,
    handleTableChange,
    tableOptions,
    customerName,
    customerContact,
    orderNotes,
    isTableFixed,
    isCreatingOrder,
    handleCreateOrder,
    totalItems,
    showClearCartDialog,
    handleCloseClearCartDialog,
    handleConfirmClearCart,
  }
}

export type GuestOrderingController = ReturnType<
  typeof useGuestOrderingController
>
