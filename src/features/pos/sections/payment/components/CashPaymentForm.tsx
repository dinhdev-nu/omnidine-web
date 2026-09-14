import React, { useState } from "react"

import Icon from "@/components/AppIcon"

import Button from "../../../ui/Button"
import Input from "../../../ui/Input"

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

interface CashPaymentFormProps {
  totalAmount?: number
  change?: number
  amountError?: string
  quickAmounts?: number[]
  isProcessing?: boolean
  onAmountChange: (rawDigits: string) => void
  onPaymentComplete: () => void
  onCancel: () => void
}

const EMPTY_QUICK_AMOUNTS: number[] = []

const formatCurrency = (amount: number): string => currencyFormatter.format(amount)

const CashPaymentForm: React.FC<CashPaymentFormProps> = ({
  totalAmount = 0,
  change = 0,
  amountError = "",
  quickAmounts = EMPTY_QUICK_AMOUNTS,
  isProcessing = false,
  onAmountChange,
  onPaymentComplete,
  onCancel,
}) => {
  const [displayValue, setDisplayValue] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "")
    setDisplayValue(digits ? formatCurrency(Number(digits)) : "")
    onAmountChange(digits)
  }

  const handleQuickAmount = (amount: number) => {
    setDisplayValue(formatCurrency(amount))
    onAmountChange(amount.toString())
  }

  const isInsufficient = Boolean(amountError)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Thanh toán tiền mặt
        </h2>
        <p className="text-2xl font-bold text-primary tabular-nums">
          {formatCurrency(totalAmount)}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Số tiền khách đưa"
          name="cash-tendered"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={displayValue}
          onChange={handleChange}
          placeholder="Nhập số tiền…"
          error={amountError}
          className="text-center text-lg tabular-nums"
        />

        <div className="grid grid-cols-1 gap-2 min-[390px]:grid-cols-2 md:grid-cols-3">
          {quickAmounts.slice(0, 6).map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAmount(amount)}
              className="w-full hover-scale tabular-nums"
            >
              {formatCurrency(amount)}
            </Button>
          ))}
        </div>
      </div>

      {change > 0 ? (
        <div className="rounded-lg border border-success/20 bg-success/10 p-4">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Icon
                name="ArrowLeftRight"
                size={20}
                aria-hidden="true"
                className="shrink-0 text-success"
              />
              <span className="font-medium text-success">Tiền thối:</span>
            </div>
            <span className="shrink-0 text-xl font-bold text-success tabular-nums">
              {formatCurrency(change)}
            </span>
          </div>
        </div>
      ) : null}

      <dl className="space-y-2 rounded-lg bg-muted/30 p-4">
        <div className="flex min-w-0 justify-between gap-3 text-sm">
          <dt className="text-muted-foreground">Tổng tiền:</dt>
          <dd className="shrink-0 font-medium text-foreground tabular-nums">
            {formatCurrency(totalAmount)}
          </dd>
        </div>
        <div className="flex min-w-0 justify-between gap-3 text-sm">
          <dt className="text-muted-foreground">Tiền nhận:</dt>
          <dd className="shrink-0 font-medium text-foreground tabular-nums">
            {displayValue || "0 ₫"}
          </dd>
        </div>
        <div className="flex min-w-0 justify-between gap-3 border-t border-border pt-2 text-sm">
          <dt className="text-muted-foreground">Tiền thối:</dt>
          <dd className="shrink-0 font-medium text-success tabular-nums">
            {formatCurrency(change)}
          </dd>
        </div>
      </dl>

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
          variant="success"
          onClick={onPaymentComplete}
          disabled={isInsufficient || !displayValue || isProcessing}
          aria-busy={isProcessing}
          className="w-full min-[390px]:flex-1"
          iconName={isProcessing ? "Loader2" : "Check"}
          iconPosition="left"
        >
          {isProcessing ? "Đang xử lý…" : "Hoàn tất thanh toán"}
        </Button>
      </div>
    </div>
  )
}

export default CashPaymentForm
