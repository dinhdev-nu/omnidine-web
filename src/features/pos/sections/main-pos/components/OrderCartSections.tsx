import { type ChangeEvent, useId } from "react"

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
    <div className="flex min-h-64 flex-col items-center justify-center p-4 text-center">
      <Icon
        name="ShoppingCart"
        size={48}
        aria-hidden="true"
        className="mb-4 text-muted-foreground"
      />
      <h3 className="mb-2 text-lg font-medium text-muted-foreground">
        Giỏ hàng trống
      </h3>
      <p className="max-w-xs text-sm text-muted-foreground text-pretty">
        Thêm món ăn từ thực đơn để bắt đầu đơn hàng.
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
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-lg font-semibold text-foreground">
          Đơn hàng ({itemCount} món)
        </p>
        {orderNumber ? (
          <p className="text-xs text-muted-foreground">
            Mã: <span className="font-mono font-medium text-foreground">{orderNumber}</span>
          </p>
        ) : null}
      </div>
      <Button
        variant="ghost"
        size="sm"
        iconName="Trash2"
        iconPosition="left"
        onClick={onClearCart}
        className="shrink-0 text-error hover:text-error"
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
  isLoadingTables: boolean
  tablesError: unknown | null
}

export function OrderContextFields({
  selectedOrderType,
  onOrderTypeChange,
  selectedOrderSource,
  onOrderSourceChange,
  selectedTable,
  onTableChange,
  tableOptions,
  isLoadingTables,
  tablesError,
}: OrderContextFieldsProps) {
  const phoneOrderSourceId = useId()
  const tableError = tablesError ? "Không thể tải danh sách bàn." : undefined
  const tableDescription = isLoadingTables
    ? "Đang tải danh sách bàn…"
    : !tablesError && tableOptions.length === 0
      ? "Không có bàn trống."
      : undefined

  return (
    <div className="flex flex-col gap-3">
      {onOrderSourceChange ? (
        <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-[minmax(0,1fr)_auto] min-[390px]:items-end">
          <Select
            label="Loại đơn"
            name="pos-order-type"
            value={selectedOrderType}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              onOrderTypeChange?.(event.target.value)
            }
            placeholder="Chọn loại đơn"
            options={[
              { value: "dine_in", label: "Tại chỗ" },
              { value: "takeaway", label: "Mang về" },
              { value: "delivery", label: "Giao hàng" },
            ]}
          />

          <div className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-border px-3 min-[390px]:w-40">
            <label htmlFor={phoneOrderSourceId} className="text-sm text-muted-foreground">
              Khách gọi điện
            </label>
            <Switch
              id={phoneOrderSourceId}
              aria-label="Nguồn đơn là khách gọi điện"
              checked={selectedOrderSource === "phone"}
              onCheckedChange={(checked: boolean) =>
                onOrderSourceChange(checked ? "phone" : "pos")
              }
              size="default"
            />
          </div>
        </div>
      ) : null}

      {selectedOrderType === "dine_in" && onTableChange ? (
        <Select
          label="Chọn bàn"
          name="pos-order-table"
          value={selectedTable ?? ""}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            onTableChange(event.target.value)
          }
          placeholder="Chọn bàn"
          options={tableOptions}
          disabled={isLoadingTables || Boolean(tablesError)}
          error={tableError}
          description={tableDescription}
        />
      ) : null}
    </div>
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
    <div className="flex flex-col gap-3">
      {cartItems.map((item) => (
        <article key={item._id} className="min-w-0 rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex flex-col gap-2 min-[390px]:flex-row min-[390px]:items-start min-[390px]:justify-between">
            <div className="min-w-0">
              <h3 className="break-words text-sm font-medium text-foreground">
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground tabular-nums">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                aria-label={`Giảm số lượng ${item.name}`}
                onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Icon name="Minus" size={16} aria-hidden="true" />
              </Button>
              <span className="min-w-10 text-center text-sm font-medium tabular-nums">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label={`Tăng số lượng ${item.name}`}
                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
              >
                <Icon name="Plus" size={16} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                onClick={() => onRemoveItem(item._id)}
                className="text-error hover:text-error"
              >
                <Icon name="X" size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              type="text"
              name={`pos-item-note-${item._id}`}
              aria-label={`Ghi chú cho ${item.name}`}
              autoComplete="off"
              placeholder="Ghi chú cho món này…"
              value={item.note ?? ""}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onUpdateNote(item._id, event.target.value)
              }
              className="text-xs"
            />
            <span className="shrink-0 text-right font-semibold text-primary tabular-nums sm:text-left">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </article>
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
    <div className="flex flex-col gap-3">
      {onCustomerNameChange ? (
        <Input
          label="Tên khách hàng"
          name="pos-customer-name"
          type="text"
          autoComplete="name"
          placeholder="Nhập tên khách…"
          value={customerName}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onCustomerNameChange(event.target.value)
          }
        />
      ) : null}

      {onCustomerPhoneChange ? (
        <Input
          label="Số điện thoại"
          name="pos-customer-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Nhập số điện thoại…"
          value={customerPhone}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onCustomerPhoneChange(event.target.value)
          }
        />
      ) : null}

      {onOrderNotesChange ? (
        <Input
          label="Ghi chú đơn hàng"
          name="pos-order-notes"
          type="text"
          autoComplete="off"
          placeholder="Nhập ghi chú đơn hàng…"
          value={orderNotes}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onOrderNotesChange(event.target.value)
          }
        />
      ) : null}
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
    <div className="flex flex-col gap-3 border-t border-border pt-4">
      {!hideDiscount ? (
        <div className="flex flex-col gap-2 rounded-lg bg-muted/20 p-3">
          <p className="text-sm font-medium text-foreground">Giảm giá</p>
          <div className="flex flex-col gap-2 min-[390px]:flex-row">
            <Input
              type="number"
              name="pos-discount"
              aria-label="Giảm giá"
              autoComplete="off"
              placeholder="Nhập giảm giá…"
              value={discountValue || ""}
              min="0"
              max={discountType === "percent" ? 100 : subtotal}
              readOnly
            />
            <Select
              aria-label="Loại giảm giá"
              value={discountType}
              onChange={() => {}}
              options={[
                { value: "percent", label: "%" },
                { value: "amount", label: "VNĐ" },
              ]}
              className="min-[390px]:w-24"
            />
          </div>
          {discountValue > 0 ? (
            <p className="flex items-center text-xs text-success">
              <Icon name="Tag" size={12} aria-hidden="true" className="mr-1" />
              Tiết kiệm: {formatPrice(discount)}
            </p>
          ) : null}
        </div>
      ) : null}

      <dl className="flex flex-col gap-2">
        <div className="flex min-w-0 justify-between gap-3 text-sm">
          <dt className="text-muted-foreground">Tạm tính:</dt>
          <dd className="shrink-0 text-foreground tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        {discountValue > 0 ? (
          <div className="flex min-w-0 justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">Giảm giá:</dt>
            <dd className="shrink-0 text-success tabular-nums">-{formatPrice(discount)}</dd>
          </div>
        ) : null}
        <div className="flex min-w-0 justify-between gap-3 text-sm">
          <dt className="text-muted-foreground">VAT ({(taxRate * 100).toFixed(0)}%):</dt>
          <dd className="shrink-0 text-foreground tabular-nums">{formatPrice(tax)}</dd>
        </div>
        <div className="flex min-w-0 justify-between gap-3 text-sm">
          <dt className="text-muted-foreground">
            Phí phục vụ ({(serviceChargeRate * 100).toFixed(0)}%):
          </dt>
          <dd className="shrink-0 text-foreground tabular-nums">{formatPrice(serviceCharge)}</dd>
        </div>
        <div className="flex min-w-0 justify-between gap-3 border-t border-border pt-2 text-lg font-semibold">
          <dt className="text-foreground">Tổng cộng:</dt>
          <dd className="shrink-0 text-primary tabular-nums">{formatPrice(finalTotal)}</dd>
        </div>
      </dl>
    </div>
  )
}
