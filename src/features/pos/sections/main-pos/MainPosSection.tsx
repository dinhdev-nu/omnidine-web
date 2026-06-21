import { useCallback, useMemo, useReducer } from "react"
import { useFetch } from "@/hooks/useFetch"
import { usePosContext } from "@/features/pos/contexts/usePosContext"
import { ClearCartDialog } from "./components/ClearCartDialog"
import { MainPosCartPanel } from "./components/MainPosCartPanel"
import { MainPosMenuPanel } from "./components/MainPosMenuPanel"
import { MobileCartFab } from "./components/MobileCartFab"
import { useMainPosMenuData } from "./hooks/useMainPosMenuData"
import { useOrderCreation } from "./hooks/useOrderCreation"
import {
  createInitialMainPosState,
  fetchAvailableActiveTables,
  mainPosReducer,
} from "./main-pos.state"
import type {
  PosOrderItemInput,
  PosOrderSource,
  PosOrderType,
} from "./main-pos.state"

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
