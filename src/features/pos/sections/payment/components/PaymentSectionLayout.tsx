import Icon from "../../../ui/AppIcon"
import Button from "../../../ui/Button"

import CardPaymentForm from "./CardPaymentForm"
import CashPaymentForm from "./CashPaymentForm"
import DigitalWalletForm from "./DigitalWalletForm"
import OrderSummary from "./OrderSummary"
import PaymentMethodSelector from "./PaymentMethodSelector"
import PaymentSuccess from "./PaymentSuccess"

import type {
  PaymentSectionController,
  WalletMethod,
} from "../hooks/usePaymentSectionController"

interface PaymentSectionViewProps {
  controller: PaymentSectionController
}

function PaymentStepContent({ controller }: PaymentSectionViewProps) {
  const {
    resolvedOrderId,
    currentStep,
    selectedMethod,
    paymentResult,
    orderData,
    isLoadingOrderDetails,
    orderDetailError,
    orderItems,
    subtotal,
    discountAmount,
    taxAmount,
    totalAmount,
    tableNumber,
    cashChange,
    cashAmountError,
    quickAmounts,
    qrCodeUrl,
    updateFlow,
    handleLeavePayment,
    handleBackToMethod,
    handleMethodSelect,
    handleCashComplete,
    handleCardComplete,
    handleWalletComplete,
    handleResetFlow,
  } = controller

  if (!resolvedOrderId) {
    return (
      <div className="space-y-4 py-12 text-center">
        <Icon
          name="FileText"
          size={48}
          className="mx-auto text-muted-foreground"
        />
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Chưa chọn đơn hàng
          </h3>
          <p className="text-sm text-muted-foreground">
            Chọn một đơn từ danh sách để chuyển sang thanh toán.
          </p>
        </div>
        <Button
          variant="default"
          onClick={handleLeavePayment}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Quay về danh sách đơn
        </Button>
      </div>
    )
  }

  if (isLoadingOrderDetails) {
    return (
      <div className="py-12 text-center">
        <Icon
          name="Loader"
          size={48}
          className="mx-auto mb-4 animate-spin text-muted-foreground"
        />
        <p className="text-muted-foreground">Đang tải chi tiết đơn hàng...</p>
      </div>
    )
  }

  if (orderDetailError) {
    return (
      <div className="space-y-4 py-12 text-center">
        <Icon
          name="AlertCircle"
          size={48}
          className="mx-auto text-destructive"
        />
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Không thể tải đơn hàng
          </h3>
          <p className="text-sm text-muted-foreground">{orderDetailError}</p>
        </div>
        <Button
          variant="default"
          onClick={handleLeavePayment}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Quay về danh sách đơn
        </Button>
      </div>
    )
  }

  if (orderData && currentStep === "method") {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <OrderSummary
            orderItems={orderItems}
            subtotal={subtotal}
            tax={taxAmount}
            discount={discountAmount}
            discountValue={orderData.discount_value ?? 0}
            discountRef={orderData.discount_ref ?? null}
            discountType={
              orderData.discount_type as "none" | "percent" | "fixed" | "coupon"
            }
            serviceChargeAmount={orderData.service_charge_amount ?? 0}
            serviceChargeRate={orderData.service_charge_rate ?? 0}
            taxRate={orderData.tax_rate ?? 0}
            total={totalAmount}
            orderNumber={orderData.order_number}
            tableNumber={tableNumber}
            customerName={orderData.customer_name ?? null}
            customerPhone={orderData.customer_phone ?? null}
            orderType={
              orderData.order_type as
                | "dine_in"
                | "takeaway"
                | "delivery"
                | "online"
            }
            source={
              orderData.source as "pos" | "online" | "qr" | "app" | "phone"
            }
            notes={orderData.notes ?? null}
          />
        </div>
        <div>
          <PaymentMethodSelector
            selectedMethod={selectedMethod}
            onMethodSelect={handleMethodSelect}
            availableMethods={[
              "cash",
              "card",
              "momo",
              "zalopay",
              "banking",
              "qr",
            ]}
            enabledMethods={["cash"]}
            isLoading={false}
            loadingMethod=""
          />
          <div className="bg-surface mt-6 rounded-lg border border-border p-4">
            <div className="mb-3 text-xs font-semibold text-muted-foreground uppercase">
              Thông tin khách hàng
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-foreground">
                <Icon
                  name="User"
                  size={16}
                  className="flex-shrink-0 text-muted-foreground"
                />
                <span className="font-medium">
                  {orderData.customer_name || "Không xác định"}
                </span>
              </div>
              {orderData.customer_phone && (
                <div className="flex items-center space-x-2 text-foreground">
                  <Icon
                    name="Phone"
                    size={16}
                    className="flex-shrink-0 text-muted-foreground"
                  />
                  <span className="font-medium">
                    {orderData.customer_phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (orderData && currentStep === "payment") {
    return (
      <div className="mx-auto max-w-md">
        {selectedMethod === "cash" && (
          <CashPaymentForm
            totalAmount={totalAmount}
            change={cashChange}
            amountError={cashAmountError}
            quickAmounts={quickAmounts}
            onAmountChange={(value) => updateFlow({ amountDigits: value })}
            onPaymentComplete={handleCashComplete}
            onCancel={handleBackToMethod}
          />
        )}
        {selectedMethod === "card" && (
          <CardPaymentForm
            totalAmount={totalAmount}
            onPaymentSubmit={handleCardComplete}
            onCancel={handleBackToMethod}
          />
        )}
        {["momo", "zalopay", "banking", "qr"].includes(selectedMethod) && (
          <DigitalWalletForm
            totalAmount={totalAmount}
            walletType={selectedMethod as WalletMethod}
            qrCodeUrl={qrCodeUrl}
            onPaymentComplete={handleWalletComplete}
            onCancel={handleBackToMethod}
          />
        )}
      </div>
    )
  }

  if (orderData && currentStep === "success") {
    return (
      <div className="mx-auto max-w-lg">
        <PaymentSuccess
          paymentData={paymentResult}
          orderData={{
            _id: orderData._id,
            customerName: orderData.customer_name ?? undefined,
            tableNumber: orderData.table_id ?? undefined,
            items: orderItems,
            subtotal,
            serviceCharge: orderData.service_charge_amount ?? 0,
            discount: discountAmount,
            tax: taxAmount,
            total: totalAmount,
          }}
          onPrintReceipt={() => {}}
          onSendDigitalReceipt={() => {}}
          onNewOrder={handleResetFlow}
          onBackToDashboard={handleLeavePayment}
        />
      </div>
    )
  }

  return null
}

export function PaymentSectionLayout({ controller }: PaymentSectionViewProps) {
  const {
    currentStep,
    orderData,
    resolvedOrderId,
    tableNumber,
    renderedAt,
    handleLeavePayment,
    handleBackToMethod,
  } = controller

  return (
    <div className="h-full min-h-0 overflow-auto p-4 md:p-5">
      <div className="mb-5">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5 md:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (currentStep === "method") {
                  handleLeavePayment()
                } else if (currentStep === "payment") {
                  handleBackToMethod()
                } else {
                  handleLeavePayment()
                }
              }}
              className="hover-scale"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-xl leading-tight font-bold text-foreground md:text-2xl">
                {currentStep === "method"
                  ? "Chọn phương thức thanh toán"
                  : currentStep === "payment"
                    ? "Xử lý thanh toán"
                    : "Thanh toán thành công"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Xử lý thanh toán an toàn và nhanh chóng
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs whitespace-nowrap text-muted-foreground lg:flex">
            <span>Đơn hàng: {orderData?.order_number ?? resolvedOrderId}</span>
            <span>({orderData?._id ?? resolvedOrderId})</span>
            <span>•</span>
            <span>Bàn: {tableNumber ?? "N/A"}</span>
            <span>•</span>
            <span>{renderedAt}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "method", name: "Phương thức", icon: "CreditCard" },
            { id: "payment", name: "Thanh toán", icon: "DollarSign" },
            { id: "success", name: "Hoàn tất", icon: "CheckCircle" },
          ].map((step, index, steps) => {
            const isActive = step.id === currentStep
            const isCompleted =
              steps.findIndex((s) => s.id === currentStep) > index
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`transition-smooth flex items-center space-x-2 rounded-lg px-2.5 py-1.5 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "text-success-foreground bg-success"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon name={isCompleted ? "Check" : step.icon} size={16} />
                  <span className="hidden text-sm font-medium sm:block">
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <Icon
                    name="ChevronRight"
                    size={14}
                    className="mx-1.5 text-muted-foreground"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border p-4 md:p-5">
        <PaymentStepContent controller={controller} />
      </div>

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 md:p-4">
        <div className="flex items-center gap-3">
          <Icon name="Shield" size={20} className="text-blue-600" />
          <div>
            <h4 className="font-medium text-blue-800">Bảo mật thanh toán</h4>
            <p className="text-sm text-blue-700">
              Tất cả giao dịch được mã hóa và tuân thủ tiêu chuẩn bảo mật PCI
              DSS. Thông tin thanh toán không được lưu trữ trên hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
