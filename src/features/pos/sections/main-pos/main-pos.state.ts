import { listTables } from "@/services/tables"
import type { TableListResponse } from "@/types/domain/table"

export type PosOrderType = "" | "dine_in" | "takeaway" | "delivery"

export type PosOrderSource = "pos" | "phone"

export type PosCartItem = {
  _id: string
  name: string
  price: number
  quantity: number
  note?: string
}

export type PosOrderItemInput = {
  _id: string
  name: string
  price: number
}

export type PosOption = {
  value: string
  label: string
}

export type MainPosState = {
  cartItems: PosCartItem[]
  selectedTable: string | null
  selectedStaff: string | null
  selectedOrderType: PosOrderType
  selectedOrderSource: PosOrderSource
  customerName: string
  customerPhone: string
  orderNotes: string
  searchQuery: string
  activeCategory: string
  showMobileCart: boolean
  showClearCartDialog: boolean
}

export type MainPosAction =
  | { type: "addToCart"; item: PosOrderItemInput }
  | { type: "updateQuantity"; id: string; quantity: number }
  | { type: "removeItem"; id: string }
  | { type: "updateNote"; id: string; note: string }
  | { type: "clearCart" }
  | { type: "setSelectedTable"; tableId: string | null }
  | { type: "setSelectedStaff"; staffId: string | null }
  | { type: "setOrderType"; orderType: PosOrderType }
  | { type: "setOrderSource"; orderSource: PosOrderSource }
  | { type: "setCustomerName"; value: string }
  | { type: "setCustomerPhone"; value: string }
  | { type: "setOrderNotes"; value: string }
  | { type: "setSearchQuery"; value: string }
  | { type: "setActiveCategory"; value: string }
  | { type: "setShowMobileCart"; value: boolean }
  | { type: "setShowClearCartDialog"; value: boolean }
  | { type: "orderCreated" }

export const fetchAvailableActiveTables = async (
  restaurantId: string
): Promise<TableListResponse> => {
  return listTables(restaurantId, {
    status: "available",
    is_active: true,
  })
}

export const noopSummaryChange = () => {}

export const createInitialMainPosState = (
  selectedStaff: string | null
): MainPosState => ({
  cartItems: [],
  selectedTable: null,
  selectedStaff,
  selectedOrderType: "",
  selectedOrderSource: "pos",
  customerName: "",
  customerPhone: "",
  orderNotes: "",
  searchQuery: "",
  activeCategory: "all",
  showMobileCart: false,
  showClearCartDialog: false,
})

export function mainPosReducer(
  state: MainPosState,
  action: MainPosAction
): MainPosState {
  switch (action.type) {
    case "addToCart": {
      const existing = state.cartItems.find(
        (item) => item._id === action.item._id
      )
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item._id === action.item._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
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
    case "updateQuantity":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === action.id
            ? { ...item, quantity: Math.max(1, action.quantity) }
            : item
        ),
      }
    case "removeItem":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item._id !== action.id),
      }
    case "updateNote":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === action.id ? { ...item, note: action.note } : item
        ),
      }
    case "clearCart":
      return { ...state, cartItems: [] }
    case "setSelectedTable":
      return { ...state, selectedTable: action.tableId }
    case "setSelectedStaff":
      return { ...state, selectedStaff: action.staffId }
    case "setOrderType": {
      const nextOrderType = action.orderType || "dine_in"
      return {
        ...state,
        selectedOrderType: nextOrderType,
        selectedTable: nextOrderType === "dine_in" ? state.selectedTable : null,
      }
    }
    case "setOrderSource":
      return { ...state, selectedOrderSource: action.orderSource }
    case "setCustomerName":
      return { ...state, customerName: action.value }
    case "setCustomerPhone":
      return { ...state, customerPhone: action.value }
    case "setOrderNotes":
      return { ...state, orderNotes: action.value }
    case "setSearchQuery":
      return { ...state, searchQuery: action.value }
    case "setActiveCategory":
      return { ...state, activeCategory: action.value }
    case "setShowMobileCart":
      return { ...state, showMobileCart: action.value }
    case "setShowClearCartDialog":
      return { ...state, showClearCartDialog: action.value }
    case "orderCreated":
      return {
        ...state,
        cartItems: [],
        customerName: "",
        customerPhone: "",
        orderNotes: "",
        selectedTable:
          state.selectedOrderType === "dine_in" ? null : state.selectedTable,
      }
    default:
      return state
  }
}
