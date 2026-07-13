import type { RefObject } from "react"

import Icon from "@/components/AppIcon"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

import Button from "../../../ui/Button"
import { noopSummaryChange } from "../main-pos.state"
import type { MainPosState, PosOption } from "../main-pos.state"
import OrderCart from "./OrderCart"

export type MainPosCartPanelProps = {
  state: MainPosState
  tableOptions: PosOption[]
  isLoadingTables: boolean
  tablesError: unknown | null
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
  mobileCartTriggerRef: RefObject<HTMLButtonElement | null>
}

type CartPanelContentProps = Omit<MainPosCartPanelProps, "mobileCartTriggerRef"> & {
  isMobileDialog?: boolean
}

function CartPanelContent({
  state,
  tableOptions,
  isLoadingTables,
  tablesError,
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
  isMobileDialog = false,
}: CartPanelContentProps) {
  return (
    <>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border py-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:py-4 sm:pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))]">
        {isMobileDialog ? (
          <div>
            <DialogTitle>Đơn hàng</DialogTitle>
            <DialogDescription className="sr-only">
              Xem và cập nhật giỏ hàng hiện tại.
            </DialogDescription>
          </div>
        ) : (
          <h2 className="text-lg font-semibold text-foreground">Đơn hàng</h2>
        )}
        {isMobileDialog ? (
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Đóng giỏ hàng"
              onClick={onHideMobileCart}
            >
              <Icon name="X" size={20} aria-hidden="true" />
            </Button>
          </DialogClose>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:py-4 sm:pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))]">
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
          isLoadingTables={isLoadingTables}
          tablesError={tablesError}
          onSummaryChange={noopSummaryChange}
          hideDiscount
        />
      </div>

      {state.cartItems.length > 0 ? (
        <div className="shrink-0 border-t border-border bg-surface pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:pt-4 sm:pb-[max(1rem,env(safe-area-inset-bottom))] sm:pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))]">
          <Button
            variant="default"
            size="default"
            fullWidth
            iconName={isCreatingOrder ? "Loader2" : "FileText"}
            iconPosition="left"
            onClick={onCreateOrder}
            disabled={isCreatingOrder}
            aria-busy={isCreatingOrder}
            className={isCreatingOrder ? "animate-pulse motion-reduce:animate-none" : "hover-scale"}
          >
            {isCreatingOrder ? "Đang tạo đơn…" : "Tạo đơn hàng"}
          </Button>
        </div>
      ) : null}
    </>
  )
}

export function MainPosCartPanel({
  state,
  tableOptions,
  isLoadingTables,
  tablesError,
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
  mobileCartTriggerRef,
}: MainPosCartPanelProps) {
  const contentProps = {
    state,
    tableOptions,
    isLoadingTables,
    tablesError,
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
  }

  return (
    <>
      <aside
        aria-label="Giỏ hàng"
        className="hidden min-h-0 w-96 shrink-0 flex-col border-l border-border bg-surface lg:flex"
      >
        <CartPanelContent {...contentProps} />
      </aside>

      <Dialog
        open={state.showMobileCart}
        onOpenChange={(open) => {
          if (!open) onHideMobileCart()
        }}
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="z-[1300] bg-black/45 backdrop-blur-sm lg:hidden"
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            mobileCartTriggerRef.current?.focus()
          }}
          className="fixed top-0 left-0 z-[1301] flex h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-surface p-0 ring-0 sm:max-w-none lg:hidden"
        >
          <CartPanelContent {...contentProps} isMobileDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}
