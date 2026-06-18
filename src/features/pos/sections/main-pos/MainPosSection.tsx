import React, { useCallback, useMemo, useState } from "react"
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

const fetchAvailableActiveTables = async (
  restaurantId: string
): Promise<TableListResponse> => {
  return listTables(restaurantId, {
    status: "available",
    is_active: true,
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

const noopSummaryChange = () => {}

const MainPosSection: React.FC = () => {
  const { data: posData } = usePosContext()
  const restaurantId = posData?.restaurant._id
  const staff = posData?.current_staff ?? null
  const normalizedRestaurantId = restaurantId ?? ""

  const [cartItems, setCartItems] = useState<
    Array<{
      _id: string
      name: string
      price: number
      quantity: number
      note?: string
    }>
  >([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<string | null>(
    staff?._id ?? null
  )
  const [selectedOrderType, setSelectedOrderType] = useState<PosOrderType>("")
  const [selectedOrderSource, setSelectedOrderSource] =
    useState<PosOrderSource>("pos")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
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
    activeCategory,
    searchQuery,
  })

  const handleAddToCart = useCallback(
    (item: { _id: string; name: string; price: number }) => {
      setCartItems((prev) => {
        const existing = prev.find((i) => i._id === item._id)
        if (existing) {
          return prev.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        }
        return [
          ...prev,
          {
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: 1,
            note: "",
          },
        ]
      })
    },
    []
  )

  const handleUpdateQuantity = useCallback((id: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: Math.max(1, qty) } : i))
    )
  }, [])

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i._id !== id))
  }, [])

  const handleUpdateNote = useCallback((id: string, note: string) => {
    setCartItems((prev) => prev.map((i) => (i._id === id ? { ...i, note } : i)))
  }, [])

  const onClearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const onTableChange = useCallback((value: string) => {
    setSelectedTable(value || null)
  }, [])

  const onStaffChange = useCallback((value: string) => {
    setSelectedStaff(value || null)
  }, [])

  const onOrderTypeChange = useCallback((value: string) => {
    const nextType = (value || "dine_in") as PosOrderType
    setSelectedOrderType(nextType)
    if (nextType !== "dine_in") {
      setSelectedTable(null)
    }
  }, [])

  const onOrderSourceChange = useCallback((value: string) => {
    const nextSource = (value || "pos") as PosOrderSource
    setSelectedOrderSource(nextSource)
  }, [])

  const tableOptions = useMemo(() => {
    const tables = availableTablesData?.data ?? []
    return tables.map((table) => {
      // Ensure we have a valid ID
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
      setCartItems([])
      setCustomerName("")
      setCustomerPhone("")
      setOrderNotes("")
      if (selectedOrderType === "dine_in") {
        setSelectedTable(null)
      }
    },
  })

  const onCreateOrder = () => {
    createOrder({
      selectedOrderType,
      selectedOrderSource,
      selectedTable,
      customerName,
      customerPhone,
      orderNotes,
      cartItems,
    })
  }

  // Get order number from hook
  const orderNumber = hookOrderNumber

  const [showMobileCart, setShowMobileCart] = useState(false)
  const [showClearCartDialog, setShowClearCartDialog] = useState(false)

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {/* ── Two-panel split ───────────────────────────────────────────────── */}
      <div className="relative flex h-full min-h-0 flex-col lg:flex-row">
        {/* ── Left Panel: Menu ─────────────────────────────────────────────── */}
        <div
          className={[
            "bg-surface flex-1 flex-col overflow-hidden border-r border-border",
            showMobileCart ? "hidden lg:flex" : "flex",
          ].join(" ")}
        >
          <>
            <div className="border-b border-border p-4">
              <h1 className="mb-4 text-xl font-semibold text-foreground">
                Thực đơn
              </h1>

              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Tìm món theo tên..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full pr-10"
                />
                <Icon
                  name="Search"
                  size={18}
                  className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                />
              </div>

              <p className="mb-2 text-sm font-medium text-foreground">
                Danh mục
              </p>
              <MenuCategory
                categories={uiCategories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <MenuGrid menuItems={uiMenuItems} onAddToCart={handleAddToCart} />
            </div>
          </>
        </div>

        {/* ── Right Panel: Cart ────────────────────────────────────────────── */}
        <div
          className={[
            "bg-surface w-full flex-col overflow-hidden border-l border-border lg:w-96",
            showMobileCart ? "flex" : "hidden lg:flex",
          ].join(" ")}
        >
          <div className="flex flex-shrink-0 items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold text-foreground">Đơn hàng</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileCart(false)}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <OrderCart
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onUpdateNote={handleUpdateNote}
              onClearCart={() => setShowClearCartDialog(true)}
              orderNumber={orderNumber}
              selectedTable={selectedTable}
              onTableChange={onTableChange}
              selectedStaff={selectedStaff}
              onStaffChange={onStaffChange}
              selectedOrderType={selectedOrderType}
              onOrderTypeChange={onOrderTypeChange}
              selectedOrderSource={selectedOrderSource}
              onOrderSourceChange={onOrderSourceChange}
              customerName={customerName}
              onCustomerNameChange={setCustomerName}
              customerPhone={customerPhone}
              onCustomerPhoneChange={setCustomerPhone}
              orderNotes={orderNotes}
              onOrderNotesChange={setOrderNotes}
              tableOptions={tableOptions}
              staffOptions={staffOptions}
            onSummaryChange={noopSummaryChange}
              hideDiscount={true}
            />
          </div>

          {cartItems.length > 0 && (
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
      </div>

      {/* ── Mobile Cart FAB ───────────────────────────────────────────────────── */}
      <div className="absolute right-4 bottom-4 z-20 lg:hidden">
        <Button
          variant="default"
          size="lg"
          onClick={() => setShowMobileCart(true)}
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

      {/* ── Clear cart dialog ─────────────────────────────────────────────────── */}
      <ConfirmationDialog
        isOpen={showClearCartDialog}
        onClose={() => setShowClearCartDialog(false)}
        onConfirm={() => {
          onClearCart?.()
          setShowClearCartDialog(false)
        }}
        title="Xóa giỏ hàng"
        message="Bạn có chắc chắn muốn xóa tất cả món trong giỏ hàng?"
        confirmText="Xóa tất cả"
        cancelText="Hủy"
        variant="danger"
        icon="Trash2"
      />
    </>
  )
}

export default MainPosSection
