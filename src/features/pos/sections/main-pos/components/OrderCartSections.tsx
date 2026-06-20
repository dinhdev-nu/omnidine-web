import { type ChangeEvent } from "react"

import Icon from "@/components/AppIcon"

import Button from "../../../ui/Button"
import Input from "../../../ui/Input"
import Select from "../../../ui/Select"
import { Switch } from "../../../ui/Switch"

import type { CartItem, TableOption } from "./order-cart.types"

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

const formatPrice = (price: number): string => currencyFormatter.format(price)

export function EmptyOrderCart() {
  return (
    <div className="flex h-64 flex-col items-center justify-center text-center">
      <Icon
        name="ShoppingCart"
        size={48}
        className="mb-4 text-muted-foreground"
      />
      <h3 className="mb-2 text-lg font-medium text-muted-foreground">
        Giỏ hàng trống
      </h3>
      <p className="text-sm text-muted-foreground">
        Thêm món ăn từ thực đơn để bắt đầu đơn hàng
      </p>
    </div>
  )
}

interface OrderCartHeaderProps {
  itemCount: number
  orderNumber: string | null
  onClearCart: () => void
}

export function OrderCartHeader({
  itemCount,
  orderNumber,
  onClearCart,
}: OrderCartHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Đơn hàng ({itemCount} món)
        </h2>
        {orderNumber ? (
          <p className="text-xs text-muted-foreground">
            Mã:{" "}
            <span className="font-mono font-medium text-foreground">
              {orderNumber}
            </span>
          </p>
        ) : null}
      </div>
      <Button
        variant="ghost"
        size="sm"
        iconName="Trash2"
        onClick={onClearCart}
        className="text-error hover:text-error"
      >
        Xóa tất cả
      </Button>
    </div>
  )
}

interface OrderContextFieldsProps {
  selectedOrderType: "" | "dine_in" | "takeaway" | "delivery"
  onOrderTypeChange?: (value: string) => void
  selectedOrderSource: "pos" | "phone"
  onOrderSourceChange?: (value: string) => void
  selectedTable: string | null
  onTableChange?: (value: string) => void
  tableOptions: TableOption[]
}

export function OrderContextFields({
  selectedOrderType,
  onOrderTypeChange,
  selectedOrderSource,
  onOrderSourceChange,
  selectedTable,
  onTableChange,
  tableOptions,
}: OrderContextFieldsProps) {
  return (
    <>
      {onOrderSourceChange && (
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Loại đơn</p>
            <Select
              value={selectedOrderType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onOrderTypeChange?.(e.target.value)
              }
              options={[
                { value: "", label: "Chọn loại đơn" },
                { value: "dine_in", label: "Tại chỗ" },
                { value: "takeaway", label: "Mang về" },
                { value: "delivery", label: "Giao hàng" },
              ]}
            />
          </div>

          <div className="w-36 flex-shrink-0">
            <p className="text-sm font-medium text-foreground">Nguồn đơn</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="mr-2 text-xs text-muted-foreground">
                Khách gọi điện
              </p>
              <Switch
                checked={selectedOrderSource === "phone"}
                onCheckedChange={(checked: boolean) =>
                  onOrderSourceChange?.(checked ? "phone" : "pos")
                }
                size="default"
              />
            </div>
          </div>
        </div>
      )}

      {selectedOrderType === "dine_in" && onTableChange && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Chọn bàn</p>
          <Select
            value={selectedTable ?? ""}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onTableChange(e.target.value)
            }
            placeholder="-- Chọn bàn --"
            options={tableOptions}
          />
        </div>
      )}
    </>
  )
}

interface CartItemsListProps {
  cartItems: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onUpdateNote: (id: string, note: string) => void
}

export function CartItemsList({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNote,
}: CartItemsListProps) {
  return (
    <div className="space-y-3">
      {cartItems?.map((item) => (
        <div
          key={item?._id}
          className="rounded-lg border border-border bg-muted/30 p-3"
        >
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground">
                {item?.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {formatPrice(item?.price)} x {item?.quantity}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdateQuantity(item?._id, item?.quantity - 1)}
                disabled={item?.quantity <= 1}
                className="touch-target h-9 w-9 sm:h-8 sm:w-8"
              >
                <Icon name="Minus" size={16} className="sm:h-3.5 sm:w-3.5" />
              </Button>
              <span className="w-10 text-center text-sm font-medium sm:w-8">
                {item?.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdateQuantity(item?._id, item?.quantity + 1)}
                className="touch-target h-9 w-9 sm:h-8 sm:w-8"
              >
                <Icon name="Plus" size={16} className="sm:h-3.5 sm:w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(item?._id)}
                className="text-error hover:text-error touch-target ml-1 h-9 w-9 sm:h-8 sm:w-8"
              >
                <Icon name="X" size={16} className="sm:h-3.5 sm:w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Input
              type="text"
              placeholder="Ghi chú cho món này..."
              value={item?.note ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onUpdateNote(item?._id, e.target.value)
              }
              className="text-xs"
            />
            <span className="ml-2 font-semibold text-primary">
              {formatPrice(item?.price * item?.quantity)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

interface CustomerInfoFieldsProps {
  customerName: string
  onCustomerNameChange?: (value: string) => void
  customerPhone: string
  onCustomerPhoneChange?: (value: string) => void
  orderNotes: string
  onOrderNotesChange?: (value: string) => void
}

export function CustomerInfoFields({
  customerName,
  onCustomerNameChange,
  customerPhone,
  onCustomerPhoneChange,
  orderNotes,
  onOrderNotesChange,
}: CustomerInfoFieldsProps) {
  return (
    <div className="space-y-2">
      {onCustomerNameChange && (
        <Input
          label="Tên khách hàng"
          type="text"
          placeholder="Nhập tên khách"
          value={customerName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onCustomerNameChange(e.target.value)
          }
        />
      )}

      {onCustomerPhoneChange && (
        <Input
          label="Số điện thoại"
          type="tel"
          placeholder="Nhập số điện thoại"
          value={customerPhone}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onCustomerPhoneChange(e.target.value)
          }
        />
      )}

      {onOrderNotesChange && (
        <Input
          label="Ghi chú đơn hàng"
          type="text"
          placeholder="Nhập ghi chú đơn hàng"
          value={orderNotes}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onOrderNotesChange(e.target.value)
          }
        />
      )}
    </div>
  )
}

interface OrderSummaryProps {
  subtotal: number
  discount: number
  tax: number
  serviceCharge: number
  finalTotal: number
  taxRate: number
  serviceChargeRate: number
  discountType: "percent" | "amount"
  discountValue: number
  hideDiscount: boolean
}

export function OrderSummary({
  subtotal,
  discount,
  tax,
  serviceCharge,
  finalTotal,
  taxRate,
  serviceChargeRate,
  discountType,
  discountValue,
  hideDiscount,
}: OrderSummaryProps) {
  return (
    <div className="space-y-3 border-t border-border pt-4">
      {!hideDiscount && (
        <div className="space-y-2 rounded-lg bg-muted/20 p-3">
          <p className="text-sm font-medium text-foreground">Giảm giá</p>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Nhập giảm giá"
                value={discountValue || ""}
                min="0"
                max={discountType === "percent" ? 100 : subtotal}
                readOnly
              />
            </div>
            <Select
              value={discountType}
              onChange={() => {}}
              options={[
                { value: "percent", label: "%" },
                { value: "amount", label: "VNĐ" },
              ]}
              className="w-24"
            />
          </div>
          {discountValue > 0 && (
            <p className="flex items-center text-xs text-success">
              <Icon name="Tag" size={12} className="mr-1" />
              Tiết kiệm: {formatPrice(discount)}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tạm tính:</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
        {discountValue > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Giảm giá:</span>
            <span className="text-success">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            VAT ({(taxRate * 100).toFixed(0)}%):
          </span>
          <span className="text-foreground">{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Phí phục vụ ({(serviceChargeRate * 100).toFixed(0)}%):
          </span>
          <span className="text-foreground">{formatPrice(serviceCharge)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-lg font-semibold">
          <span className="text-foreground">Tổng cộng:</span>
          <span className="text-primary">{formatPrice(finalTotal)}</span>
        </div>
      </div>
    </div>
  )
}
