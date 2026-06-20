import type React from "react"

import { PaymentSectionLayout } from "./components/PaymentSectionLayout"
import {
  usePaymentSectionController,
  type PaymentSectionProps,
} from "./hooks/usePaymentSectionController"

const PaymentSection: React.FC<PaymentSectionProps> = ({ orderId }) => {
  const controller = usePaymentSectionController(orderId)

  return <PaymentSectionLayout controller={controller} />
}

export default PaymentSection
