import type React from "react"

import {
  useOrderTableController,
  type OrderTableProps,
} from "../hooks/useOrderTableController"
import { OrderTableView } from "./OrderTableView"

const OrderTable: React.FC<OrderTableProps> = (props) => {
  const controller = useOrderTableController(props)

  return <OrderTableView controller={controller} />
}

export default OrderTable
