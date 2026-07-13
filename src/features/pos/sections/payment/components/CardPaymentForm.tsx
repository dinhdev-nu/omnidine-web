import React, { useState } from "react"
import Icon from "@/components/AppIcon"
import Input from "../../../ui/Input"
import Button from "../../../ui/Button"

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

interface CardPaymentFormProps {
  totalAmount?: number
  isProcessing?: boolean
  errors?: Partial<
    Record<"cardNumber" | "expiryDate" | "cvv" | "cardholderName", string>
  >
  onPaymentSubmit: (cardData: CardFormData) => void
  onCancel: () => void
}

const EMPTY_CARD_ERRORS: NonNullable<CardPaymentFormProps["errors"]> = {}

export interface CardFormData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

const CARD_TYPES = [
  { name: "Visa", icon: "CreditCard", color: "text-blue-600" },
  { name: "Mastercard", icon: "CreditCard", color: "text-red-600" },
  { name: "JCB", icon: "CreditCard", color: "text-green-600" },
]

const formatCurrency = (amount: number): string =>
  currencyFormatter.format(
    amount
  )

/** Format card number to groups of 4: "1234 5678 9012 3456" */
const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
  const match = v.match(/\d{4,16}/g)
  const digits = (match && match[0]) || ""
  const parts: string[] = []
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.substring(i, i + 4))
  }
  return parts.length ? parts.join(" ") : v
}

/** Format expiry to "MM/YY" */
const formatExpiryDate = (value: string): string => {
  const v = value.replace(/\D/g, "")
  return v.length >= 2 ? v.substring(0, 2) + "/" + v.substring(2, 4) : v
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  totalAmount = 0,
  isProcessing = false,
  errors = EMPTY_CARD_ERRORS,
  onPaymentSubmit,
  onCancel,
}) => {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Thanh toán thẻ tín dụng/ghi nợ
        </h2>
        <p className="text-2xl font-bold text-primary tabular-nums">
          {formatCurrency(totalAmount)}
        </p>
      </div>

      {/* Supported Cards */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 rounded-lg bg-muted/30 p-4">
        <span className="text-sm text-muted-foreground">Hỗ trợ:</span>
        {CARD_TYPES.map((card) => (
          <div key={card.name} className="flex items-center gap-1">
            <Icon name={card.icon} size={20} aria-hidden="true" className={card.color} />
            <span className="text-sm font-medium text-foreground">
              {card.name}
            </span>
          </div>
        ))}
      </div>

      {/* Card Form */}
      <div className="space-y-4">
        <Input
          label="Số thẻ"
          name="card-number"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          spellCheck={false}
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          error={errors.cardNumber}
        />

        <div className="grid grid-cols-1 gap-4 min-[390px]:grid-cols-2">
          <Input
            label="Ngày hết hạn"
            name="card-expiry"
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            spellCheck={false}
            value={expiryDate}
            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
            placeholder="MM/YY"
            maxLength={5}
            error={errors.expiryDate}
          />
          <Input
            label="Mã CVV"
            name="card-cvv"
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
            spellCheck={false}
            value={cvv}
            onChange={(e) =>
              setCvv(e.target.value.replace(/\D/g, "").substring(0, 4))
            }
            placeholder="123"
            maxLength={4}
            error={errors.cvv}
          />
        </div>

        <Input
          label="Tên chủ thẻ"
          name="cardholder-name"
          type="text"
          autoComplete="cc-name"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
          placeholder="NGUYEN VAN A"
          error={errors.cardholderName}
        />
      </div>

      {/* Security Notice */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="flex items-center gap-2">
          <Icon name="Shield" size={16} aria-hidden="true" className="shrink-0 text-blue-600" />
          <span className="text-sm text-blue-800">
            Thông tin thẻ được mã hóa và bảo mật tuyệt đối
          </span>
        </div>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin motion-reduce:animate-none">
              <Icon name="Loader2" size={20} aria-hidden="true" className="text-primary" />
            </div>
            <span className="font-medium text-primary">
              Đang xử lý thanh toán…
            </span>
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Vui lòng không tắt trình duyệt hoặc rời khỏi trang
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-3 min-[390px]:flex-row">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full min-[390px]:flex-1"
        >
          Hủy
        </Button>
        <Button
          variant="default"
          onClick={() =>
            onPaymentSubmit({ cardNumber, expiryDate, cvv, cardholderName })
          }
          disabled={isProcessing}
          className="w-full min-[390px]:flex-1"
          iconName={isProcessing ? "Loader2" : "CreditCard"}
          iconPosition="left"
        >
          {isProcessing ? "Đang xử lý…" : "Thanh toán"}
        </Button>
      </div>
    </div>
  )
}

export default CardPaymentForm
