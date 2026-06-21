import Button from "../../../ui/Button"
import Icon from "@/components/AppIcon"
import OrderCart from "./OrderCart"
import { noopSummaryChange } from "../main-pos.state"
import type { MainPosState, PosOption } from "../main-pos.state"

export type MainPosCartPanelProps = {
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

export function MainPosCartPanel({
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
