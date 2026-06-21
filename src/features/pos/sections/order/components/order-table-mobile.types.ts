import type { AllowedOrderItemStatusUpdate, Order } from "@/types/domain/order"

export interface OrderTableMobileCardProps {
  order: Order
  detailOrder?: Order | null
  isLoadingDetail?: boolean
  highlighted: boolean
  expanded: boolean
  onToggleExpand: (order: Order) => void
  onPaymentClick: (order: Order) => void
  onUpdateStatusClick: (order: Order) => void
  onCancelOrder: (order: Order) => void
  onUpdateOrderItemStatus?: (
    order: Order,
    itemId: string,
    status: AllowedOrderItemStatusUpdate
  ) => void
  onCancelOrderItemClick?: (order: Order, itemId: string) => void
  onEditDiscountClick?: (order: Order) => void
}

export type MobileOrderItem = NonNullable<Order["items"]>[number]

export interface MobileDetailSectionProps {
  order: Order
  detailOrder: Order
  items: MobileOrderItem[]
  isActionable: boolean
  subtotal: number
  discountAmount: number
  discountTypeLabel: string
  total: number
  onUpdateOrderItemStatus?: OrderTableMobileCardProps["onUpdateOrderItemStatus"]
  onCancelOrderItemClick?: OrderTableMobileCardProps["onCancelOrderItemClick"]
  onEditDiscountClick?: OrderTableMobileCardProps["onEditDiscountClick"]
}

export interface OrderMobileExpandedDetailsProps extends Omit<
  MobileDetailSectionProps,
  "detailOrder"
> {
  detailOrder?: Order | null
  isLoadingDetail?: boolean
}
