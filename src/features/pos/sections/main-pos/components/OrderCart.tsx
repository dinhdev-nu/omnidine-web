import { useMemo } from "react"

import { usePosContext } from "@/features/pos/contexts/usePosContext"

import {
  CartItemsList,
  CustomerInfoFields,
  EmptyOrderCart,
  OrderCartHeader,
  OrderContextFields,
  OrderSummary,
} from "./OrderCartSections"
import type { OrderCartProps, TableOption } from "./order-cart.types"

const EMPTY_TABLE_OPTIONS: TableOption[] = []

const OrderCart = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNote,
  onClearCart,
  orderNumber = null,
  selectedOrderType = "",
  onOrderTypeChange,
  selectedOrderSource = "pos",
  onOrderSourceChange,
  customerName = "",
  onCustomerNameChange,
  customerPhone = "",
  onCustomerPhoneChange,
  orderNotes = "",
  onOrderNotesChange,
  selectedTable = null,
  onTableChange,
  tableOptions = EMPTY_TABLE_OPTIONS,
  discountType = "percent",
  discountValue = 0,
  hideDiscount = false,
}: OrderCartProps) => {
  const { data: posData } = usePosContext()
  const taxRate = posData?.restaurant?.tax_rate ?? 0.1
  const serviceChargeRate = posData?.restaurant?.service_charge_rate ?? 0

  const { subtotal, discount, tax, serviceCharge, finalTotal } = useMemo(() => {
    const st =
      cartItems?.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ) ?? 0
    const disc =
      discountType === "percent"
        ? st * (discountValue / 100)
        : Math.min(discountValue, st)
    const tx = (st - disc) * taxRate
    const sc = (st - disc) * serviceChargeRate
    return {
      subtotal: st,
      discount: disc,
      tax: tx,
      serviceCharge: sc,
      finalTotal: st - disc + tx + sc,
    }
  }, [cartItems, discountType, discountValue, taxRate, serviceChargeRate])

  if (cartItems?.length === 0) {
    return <EmptyOrderCart />
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <OrderCartHeader
          itemCount={cartItems?.length ?? 0}
          orderNumber={orderNumber}
          onClearCart={onClearCart}
        />
        <OrderContextFields
          selectedOrderType={selectedOrderType}
          onOrderTypeChange={onOrderTypeChange}
          selectedOrderSource={selectedOrderSource}
          onOrderSourceChange={onOrderSourceChange}
          selectedTable={selectedTable}
          onTableChange={onTableChange}
          tableOptions={tableOptions}
        />
      </div>

      <CartItemsList
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onUpdateNote={onUpdateNote}
      />

      <CustomerInfoFields
        customerName={customerName}
        onCustomerNameChange={onCustomerNameChange}
        customerPhone={customerPhone}
        onCustomerPhoneChange={onCustomerPhoneChange}
        orderNotes={orderNotes}
        onOrderNotesChange={onOrderNotesChange}
      />

      <OrderSummary
        subtotal={subtotal}
        discount={discount}
        tax={tax}
        serviceCharge={serviceCharge}
        finalTotal={finalTotal}
        taxRate={taxRate}
        serviceChargeRate={serviceChargeRate}
        discountType={discountType}
        discountValue={discountValue}
        hideDiscount={hideDiscount}
      />
    </div>
  )
}

export default OrderCart
