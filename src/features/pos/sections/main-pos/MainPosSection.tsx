import { useCallback, useMemo, useReducer, type ComponentProps } from "react"
import MenuCategory from "./components/MenuCategory"
import MenuGrid from "./components/MenuGrid"
import OrderCart from "./components/OrderCart"
import Button from "../../ui/Button"
import Input from "../../ui/Input"
import Icon from "@/components/AppIcon"
import ConfirmationDialog from "../../ui/ConfirmationDialog"
import { usePosContext } from "@/features/pos/contexts/usePosContext"
import { useMainPosMenuData } from "./hooks/useMainPosMenuData"
import { useOrderCreation } from "./hooks/useOrderCreation"
import { useFetch } from "@/hooks/useFetch"
import { listTables } from "@/services/tables"
import type { TableListResponse } from "@/types/domain/table"

type PosOrderType = "" | "dine_in" | "takeaway" | "delivery"
type PosOrderSource = "pos" | "phone"

type PosCartItem = {
  _id: string
  name: string
  price: number
  quantity: number
  note?: string
}

type PosOrderItemInput = {
  _id: string
  name: string
  price: number
}

type PosOption = {
  value: string
  label: string
}

type MainPosState = {
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

type MainPosAction =
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

const fetchAvailableActiveTables = async (
  restaurantId: string
): Promise<TableListResponse> => {
  return listTables(restaurantId, {
    status: "available",
    is_active: true,
  })
}

const noopSummaryChange = () => {}

const createInitialMainPosState = (
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

function mainPosReducer(
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

type MainPosMenuPanelProps = {
  showMobileCart: boolean
  searchQuery: string
  activeCategory: string
  uiCategories: ComponentProps<typeof MenuCategory>["categories"]
  uiMenuItems: ComponentProps<typeof MenuGrid>["menuItems"]
  onSearchQueryChange: (value: string) => void
  onActiveCategoryChange: (value: string) => void
  onAddToCart: ComponentProps<typeof MenuGrid>["onAddToCart"]
}

function MainPosMenuPanel({
  showMobileCart,
  searchQuery,
  activeCategory,
  uiCategories,
  uiMenuItems,
  onSearchQueryChange,
  onActiveCategoryChange,
  onAddToCart,
}: MainPosMenuPanelProps) {
  return (
    <div
      className={[
        "bg-surface flex-1 flex-col overflow-hidden border-r border-border",
        showMobileCart ? "hidden lg:flex" : "flex",
      ].join(" ")}
    >
      <div className="border-b border-border p-4">
        <h1 className="mb-4 text-xl font-semibold text-foreground">Thực đơn</h1>

        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Tìm món theo tên..."
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="w-full pr-10"
          />
          <Icon
            name="Search"
            size={18}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          />
        </div>

        <p className="mb-2 text-sm font-medium text-foreground">Danh mục</p>
        <MenuCategory
          categories={uiCategories}
          activeCategory={activeCategory}
          onCategoryChange={onActiveCategoryChange}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <MenuGrid menuItems={uiMenuItems} onAddToCart={onAddToCart} />
      </div>
    </div>
  )
}

type MainPosCartPanelProps = {
  state: MainPosState
  tableOptions: PosOption[]
  staffOptions: PosOption[]
  orderNumber?: string | null
  isCreatingOrder: boolean
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onUpdateNote: (id: string, note: string) => void
  onRequestClearCart: () => void
  onTableChange: (value: string) => void
  onStaffChange: (value: string) => void
  onOrderTypeChange: (value: string) => void
  onOrderSourceChange: (value: string) => void
  onCustomerNameChange: (value: string) => void
  onCustomerPhoneChange: (value: string) => void
  onOrderNotesChange: (value: string) => void
  onCreateOrder: () => void
  onHideMobileCart: () => void
}

function MainPosCartPanel({
  state,
  tableOptions,
  staffOptions,
  orderNumber,
  isCreatingOrder,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNote,
  onRequestClearCart,
  onTableChange,
  onStaffChange,
  onOrderTypeChange,
  onOrderSourceChange,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onOrderNotesChange,
  onCreateOrder,
  onHideMobileCart,
}: MainPosCartPanelProps) {
  return (
    <div
      className={[
        "bg-surface w-full flex-col overflow-hidden border-l border-border lg:w-96",
        state.showMobileCart ? "flex" : "hidden lg:flex",
      ].join(" ")}
    >
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Đơn hàng</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onHideMobileCart}
          className="lg:hidden"
        >
          <Icon name="X" size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <OrderCart
          cartItems={state.cartItems}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onUpdateNote={onUpdateNote}
          onClearCart={onRequestClearCart}
          orderNumber={orderNumber}
          selectedTable={state.selectedTable}
          onTableChange={onTableChange}
          selectedStaff={state.selectedStaff}
          onStaffChange={onStaffChange}
          selectedOrderType={state.selectedOrderType}
          onOrderTypeChange={onOrderTypeChange}
          selectedOrderSource={state.selectedOrderSource}
          onOrderSourceChange={onOrderSourceChange}
          customerName={state.customerName}
          onCustomerNameChange={onCustomerNameChange}
          customerPhone={state.customerPhone}
          onCustomerPhoneChange={onCustomerPhoneChange}
          orderNotes={state.orderNotes}
          onOrderNotesChange={onOrderNotesChange}
          tableOptions={tableOptions}
          staffOptions={staffOptions}
          onSummaryChange={noopSummaryChange}
          hideDiscount={true}
        />
      </div>

      {state.cartItems.length > 0 && (
        <div className="bg-surface flex-shrink-0 space-y-2 border-t border-border p-4">
          <Button
            variant="default"
            size="default"
            fullWidth
            iconName={isCreatingOrder ? "Loader2" : "FileText"}
            iconPosition="left"
            onClick={onCreateOrder}
            disabled={isCreatingOrder}
            className={`hover-scale touch-target ${isCreatingOrder ? "animate-pulse" : ""}`}
          >
            {isCreatingOrder ? "Đang tạo đơn..." : "Tạo đơn hàng"}
          </Button>
        </div>
      )}
    </div>
  )
}

function MobileCartFab({
  cartItems,
  totalItems,
  onOpen,
}: {
  cartItems: PosCartItem[]
  totalItems: number
  onOpen: () => void
}) {
  return (
    <div className="absolute right-4 bottom-4 z-20 lg:hidden">
      <Button
        variant="default"
        size="lg"
        onClick={onOpen}
        className="shadow-modal hover-scale relative rounded-full"
      >
        <Icon name="ShoppingCart" size={24} className="mr-2" />
        <span>Giỏ hàng ({totalItems})</span>
        {cartItems.length > 0 && (
          <span className="bg-error text-error-foreground absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs">
            {totalItems}
          </span>
        )}
      </Button>
    </div>
  )
}

function ClearCartDialog({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa giỏ hàng"
      message="Bạn có chắc chắn muốn xóa tất cả món trong giỏ hàng?"
      confirmText="Xóa tất cả"
      cancelText="Hủy"
      variant="danger"
      icon="Trash2"
    />
  )
}

function MainPosSection() {
  const { data: posData } = usePosContext()
  const restaurantId = posData?.restaurant._id
  const staff = posData?.current_staff ?? null
  const normalizedRestaurantId = restaurantId ?? ""

  const [state, dispatch] = useReducer(
    mainPosReducer,
    staff?._id ?? null,
    createInitialMainPosState
  )

  const availableTablesFetchArgs = useMemo<[string]>(
    () => [normalizedRestaurantId],
    [normalizedRestaurantId]
  )

  const { data: availableTablesData } = useFetch(
    fetchAvailableActiveTables,
    availableTablesFetchArgs,
    {
      enabled: Boolean(restaurantId),
    }
  )

  const { uiCategories, uiMenuItems } = useMainPosMenuData({
    restaurantId,
    activeCategory: state.activeCategory,
    searchQuery: state.searchQuery,
  })

  const handleAddToCart = useCallback((item: PosOrderItemInput) => {
    dispatch({ type: "addToCart", item })
  }, [])

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "updateQuantity", id, quantity })
  }, [])

  const handleRemoveItem = useCallback((id: string) => {
    dispatch({ type: "removeItem", id })
  }, [])

  const handleUpdateNote = useCallback((id: string, note: string) => {
    dispatch({ type: "updateNote", id, note })
  }, [])

  const onTableChange = useCallback((value: string) => {
    dispatch({ type: "setSelectedTable", tableId: value || null })
  }, [])

  const onStaffChange = useCallback((value: string) => {
    dispatch({ type: "setSelectedStaff", staffId: value || null })
  }, [])

  const onOrderTypeChange = useCallback((value: string) => {
    dispatch({
      type: "setOrderType",
      orderType: (value || "dine_in") as PosOrderType,
    })
  }, [])

  const onOrderSourceChange = useCallback((value: string) => {
    dispatch({
      type: "setOrderSource",
      orderSource: (value || "pos") as PosOrderSource,
    })
  }, [])

  const tableOptions = useMemo(() => {
    const tables = availableTablesData?.data ?? []
    return tables.map((table) => {
      const tableId = table._id || table.id
      if (!tableId) {
        console.warn("Table missing ID:", table)
        return {
          value: "",
          label: `${table.table_number} (NO ID)`,
        }
      }
      return {
        value: tableId,
        label: `${table.table_number}${table.name?.trim() ? ` - ${table.name.trim()}` : ""} (${table.capacity})`,
      }
    })
  }, [availableTablesData])

  const staffOptions = useMemo(() => {
    if (!staff) return []
    return [{ value: staff._id, label: staff.full_name }]
  }, [staff])

  const {
    isCreatingOrder,
    orderNumber: hookOrderNumber,
    createOrder,
  } = useOrderCreation({
    restaurantId,
    onOrderCreated: () => {
      dispatch({ type: "orderCreated" })
    },
  })

  const onCreateOrder = () => {
    createOrder({
      selectedOrderType: state.selectedOrderType,
      selectedOrderSource: state.selectedOrderSource,
      selectedTable: state.selectedTable,
      customerName: state.customerName,
      customerPhone: state.customerPhone,
      orderNotes: state.orderNotes,
      cartItems: state.cartItems,
    })
  }

  const totalItems = state.cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <>
      <div className="relative flex h-full min-h-0 flex-col lg:flex-row">
        <MainPosMenuPanel
          showMobileCart={state.showMobileCart}
          searchQuery={state.searchQuery}
          activeCategory={state.activeCategory}
          uiCategories={uiCategories}
          uiMenuItems={uiMenuItems}
          onSearchQueryChange={(value) =>
            dispatch({ type: "setSearchQuery", value })
          }
          onActiveCategoryChange={(value) =>
            dispatch({ type: "setActiveCategory", value })
          }
          onAddToCart={handleAddToCart}
        />

        <MainPosCartPanel
          state={state}
          tableOptions={tableOptions}
          staffOptions={staffOptions}
          orderNumber={hookOrderNumber}
          isCreatingOrder={isCreatingOrder}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onUpdateNote={handleUpdateNote}
          onRequestClearCart={() =>
            dispatch({ type: "setShowClearCartDialog", value: true })
          }
          onTableChange={onTableChange}
          onStaffChange={onStaffChange}
          onOrderTypeChange={onOrderTypeChange}
          onOrderSourceChange={onOrderSourceChange}
          onCustomerNameChange={(value) =>
            dispatch({ type: "setCustomerName", value })
          }
          onCustomerPhoneChange={(value) =>
            dispatch({ type: "setCustomerPhone", value })
          }
          onOrderNotesChange={(value) =>
            dispatch({ type: "setOrderNotes", value })
          }
          onCreateOrder={onCreateOrder}
          onHideMobileCart={() =>
            dispatch({ type: "setShowMobileCart", value: false })
          }
        />
      </div>

      <MobileCartFab
        cartItems={state.cartItems}
        totalItems={totalItems}
        onOpen={() => dispatch({ type: "setShowMobileCart", value: true })}
      />

      <ClearCartDialog
        isOpen={state.showClearCartDialog}
        onClose={() =>
          dispatch({ type: "setShowClearCartDialog", value: false })
        }
        onConfirm={() => {
          dispatch({ type: "clearCart" })
          dispatch({ type: "setShowClearCartDialog", value: false })
        }}
      />
    </>
  )
}

export default MainPosSection
