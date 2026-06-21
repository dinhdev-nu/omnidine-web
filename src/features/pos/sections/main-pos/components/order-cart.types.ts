export interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  note?: string
}

export interface TableOption {
  value: string
  label: string
}

export interface StaffOption {
  value: string
  label: string
}

export interface OrderCartProps {
  cartItems: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onUpdateNote: (id: string, note: string) => void
  onClearCart: () => void
  orderNumber?: string | null
  selectedOrderType?: "" | "dine_in" | "takeaway" | "delivery"
  onOrderTypeChange?: (value: string) => void
  selectedOrderSource?: "pos" | "phone"
  onOrderSourceChange?: (value: string) => void
  customerName?: string
  onCustomerNameChange?: (value: string) => void
  customerPhone?: string
  onCustomerPhoneChange?: (value: string) => void
  orderNotes?: string
  onOrderNotesChange?: (value: string) => void
  selectedTable?: string | null
  onTableChange?: (value: string) => void
  onSummaryChange?: (summary: {
    subtotal: number
    discount: number
    tax: number
    total: number
  }) => void
  selectedStaff?: string | null
  onStaffChange?: (value: string) => void
  tableOptions?: TableOption[]
  staffOptions?: StaffOption[]
  /** When true, hide discount UI (used by MainPos new-order flow) */
  hideDiscount?: boolean
  discountType?: "percent" | "amount"
  discountValue?: number
}
