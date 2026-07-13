import { type ChangeEvent } from "react"

import Icon from "@/components/AppIcon"
import { Textarea } from "@/components/ui/textarea"
import Button from "@/features/pos/ui/Button"
import Input from "@/features/pos/ui/Input"
import Select from "@/features/pos/ui/Select"

import type { CartItem, OrderingUser, TableOption } from "../types"

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
})

interface OrderCartProps {
    cartItems: CartItem[]
    onUpdateQuantity: (itemId: string, quantity: number) => void
    onRemoveItem: (itemId: string) => void
    onUpdateNote: (itemId: string, note: string) => void
    onClearCart: () => void
    orderType?: "" | "dine_in" | "takeaway" | "delivery"
    onOrderTypeChange?: (value: "" | "dine_in" | "takeaway" | "delivery") => void
    selectedTableId?: string | null
    onTableChange?: (value: string) => void
    tableOptions?: TableOption[]
    user?: OrderingUser | null
    customerName?: string
    onCustomerNameChange?: (value: string) => void
    customerContact?: string
    onCustomerContactChange?: (value: string) => void
    orderNotes?: string
    onOrderNotesChange?: (value: string) => void
    sourceLabel?: "qr" | "app"
    isTableFixed?: boolean
}

const EMPTY_TABLE_OPTIONS: TableOption[] = []

const formatPrice = (price: number): string =>
    currencyFormatter.format(price)

const OrderCart = ({
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    onUpdateNote,
    onClearCart,
    orderType = "",
    onOrderTypeChange,
    selectedTableId = null,
    onTableChange,
    tableOptions = EMPTY_TABLE_OPTIONS,
    customerName = "",
    onCustomerNameChange,
    customerContact = "",
    onCustomerContactChange,
    orderNotes = "",
    onOrderNotesChange,
    sourceLabel = "app",
    isTableFixed = false,
}: OrderCartProps) => {
    if (cartItems.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center text-center">
                <Icon name="ShoppingCart" size={48} className="mb-4 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium text-muted-foreground">Giỏ hàng trống</h3>
                <p className="text-sm text-muted-foreground">Thêm món ăn từ thực đơn để bắt đầu đơn hàng</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Đơn hàng ({cartItems.length} món)</h3>
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

                <div className="grid gap-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Select
                            name="order-type"
                            label="Loại đơn hàng"
                            value={orderType}
                            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                                onOrderTypeChange?.(event.target.value as "" | "dine_in" | "takeaway" | "delivery")
                            }}
                            options={[
                                { value: "dine_in", label: "Ăn tại bàn" },
                                { value: "takeaway", label: "Mang đi" },
                                { value: "delivery", label: "Giao hàng" },
                            ]}
                            placeholder="Chọn loại đơn hàng..."
                            disabled={isTableFixed}
                        />

                        <div>
                            <p className="mb-1 text-sm font-medium text-foreground">Nguồn đơn</p>
                            <div className="flex min-h-11 items-center rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">{sourceLabel === "qr" ? "QR" : "App"}</span>
                            </div>
                        </div>
                    </div>

                    {onTableChange && (
                        <Select
                            name="table-id"
                            label="Chọn bàn"
                            value={selectedTableId ?? ""}
                            onChange={(event: ChangeEvent<HTMLSelectElement>) => onTableChange(event.target.value)}
                            options={tableOptions}
                            placeholder="Chọn bàn..."
                            disabled={isTableFixed}
                            description={orderType === "dine_in" ? "Bắt buộc khi đặt dine_in" : "Có thể bỏ trống nếu không dùng bàn"}
                        />
                    )}

                </div>
            </div>

            <div className="flex flex-col gap-3">
                {cartItems.map((item) => (
                    <div key={item._id} className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="mb-2 flex flex-col gap-2">
                            <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-medium text-foreground">{item.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                    {formatPrice(item.price)} x {item.quantity}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label={`Giảm số lượng ${item.name}`}
                                    onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="touch-target h-9 w-9 sm:h-8 sm:w-8"
                                >
                                    <Icon name="Minus" size={16} className="sm:h-3.5 sm:w-3.5" />
                                </Button>
                                <span className="w-10 text-center text-sm font-medium sm:w-8">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label={`Tăng số lượng ${item.name}`}
                                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                                    className="touch-target h-9 w-9 sm:h-8 sm:w-8"
                                >
                                    <Icon name="Plus" size={16} className="sm:h-3.5 sm:w-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                                    onClick={() => onRemoveItem(item._id)}
                                    className="touch-target ml-1 h-9 w-9 text-destructive hover:text-destructive sm:h-8 sm:w-8"
                                >
                                    <Icon name="X" size={16} className="sm:h-3.5 sm:w-3.5" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                            <Input
                                type="text"
                                name={`item-note-${item._id}`}
                                aria-label={`Ghi chú cho ${item.name}`}
                                placeholder="Ghi chú cho món này..."
                                value={item.note ?? ""}
                                onChange={(event) => onUpdateNote(item._id, event.target.value)}
                                className="text-xs"
                            />
                            <span className="text-right font-semibold text-primary">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-foreground">Thông tin khách hàng</p>

                <div className="flex flex-col gap-2">
                    <Input
                        type="text"
                        name="customer-name"
                        aria-label="Tên khách hàng"
                        autoComplete="name"
                        placeholder="Nhập tên khách hàng..."
                        value={customerName}
                        onChange={(event) => onCustomerNameChange?.(event.target.value)}
                    />
                    <Input
                        type="tel"
                        name="customer-phone"
                        aria-label="Số điện thoại"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="Nhập số điện thoại..."
                        value={customerContact}
                        onChange={(event) => onCustomerContactChange?.(event.target.value)}
                    />
                </div>

                <Textarea
                    name="order-notes"
                    aria-label="Ghi chú cho toàn bộ đơn hàng"
                    value={orderNotes}
                    onChange={(event) => onOrderNotesChange?.(event.target.value)}
                    placeholder="Ghi chú cho toàn bộ đơn hàng..."
                    rows={3}
                />
            </div>
        </div>
    )
}

export default OrderCart
