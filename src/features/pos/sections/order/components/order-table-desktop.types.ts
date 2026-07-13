import type { AllowedOrderItemStatusUpdate, Order } from "@/types/domain/order"

export interface OrderTableDesktopRowProps {
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
  onCancelOrderItemClick?: (
    order: Order,
    itemId: string,
    returnFocusElement?: HTMLElement | null
  ) => void
  onEditDiscountClick?: (order: Order) => void
}

export type OrderTableDetailItem = NonNullable<Order["items"]>[number]

export type OrderTableDetailItemRowProps = {
  order: Order
  item: OrderTableDetailItem
  isActionable: boolean
  onUpdateOrderItemStatus?: (
    order: Order,
    itemId: string,
    status: AllowedOrderItemStatusUpdate
  ) => void
  onCancelOrderItemClick?: OrderTableDesktopRowProps["onCancelOrderItemClick"]
}

export interface OrderDesktopDetailProps {
  order: Order
  detailOrder: Order
  isActionable: boolean
  discountAmount: number
  discountTypeLabel: string
  onUpdateOrderItemStatus?: OrderTableDesktopRowProps["onUpdateOrderItemStatus"]
  onCancelOrderItemClick?: OrderTableDesktopRowProps["onCancelOrderItemClick"]
  onEditDiscountClick?: OrderTableDesktopRowProps["onEditDiscountClick"]
}

export interface OrderDesktopExpandedRowProps extends Omit<
  OrderDesktopDetailProps,
  "detailOrder"
> {
  detailOrder?: Order | null
  isLoadingDetail?: boolean
}
