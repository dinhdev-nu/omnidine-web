import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../ui/AppIcon';
import Button from '../../ui/Button';
import { POS_BASE_PATH } from '@/routes/pos-route-config';
import { useRequiredPosData } from '@/features/pos/contexts/usePosContext';
import { createCashPayment, toPaymentEndpointError } from '@/services/payments';
import type { PaymentMethodId } from './components/PaymentMethodSelector';
import type { PaymentData } from './components/PaymentSuccess';

import PaymentMethodSelector from './components/PaymentMethodSelector';
import OrderSummary from './components/OrderSummary';
import CashPaymentForm from './components/CashPaymentForm';
import CardPaymentForm from './components/CardPaymentForm';
import DigitalWalletForm from './components/DigitalWalletForm';
import PaymentSuccess from './components/PaymentSuccess';

import { useIdempotencyKey } from './hooks/useIdempotencyKey';
import { useOrderData } from './hooks/useOrderData';
import { toast } from 'sonner';
import { mapOrderItemsToSummaryItems, generateQRCodeUrl } from './utils/payment';

type Step = 'method' | 'payment' | 'success';
type WalletMethod = Extract<PaymentMethodId, 'momo' | 'zalopay' | 'banking' | 'qr'>;

interface PaymentSectionProps {
    orderId?: string | null;
}

const WALLET_METHODS: WalletMethod[] = ['momo', 'zalopay', 'banking', 'qr'];

const isWalletMethod = (method: PaymentMethodId | ''): method is WalletMethod =>
    WALLET_METHODS.includes(method as WalletMethod);

interface PaymentFlowState {
    orderId: string;
    currentStep: Step;
    selectedMethod: PaymentMethodId | '';
    amountDigits: string;
    paymentResult: PaymentData;
}

const createPaymentFlowState = (orderId: string): PaymentFlowState => ({
    orderId,
    currentStep: 'method',
    selectedMethod: '',
    amountDigits: '',
    paymentResult: {},
});

const PaymentSection: React.FC<PaymentSectionProps> = ({ orderId }) => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const { restaurant } = useRequiredPosData();

    const [renderedAt] = useState(() => new Date().toLocaleString('vi-VN'));

    const resolvedOrderId = orderId?.trim() ?? '';
    const restaurantId = restaurant._id;
    const [storedFlow, setStoredFlow] = useState<PaymentFlowState>(() =>
        createPaymentFlowState(resolvedOrderId)
    );
    let flow = storedFlow;

    if (storedFlow.orderId !== resolvedOrderId) {
        flow = createPaymentFlowState(resolvedOrderId);
        setStoredFlow(flow);
    }

    const { currentStep, selectedMethod, amountDigits, paymentResult } = flow;

    const updateFlow = (nextFlow: Partial<Omit<PaymentFlowState, 'orderId'>>) => {
        setStoredFlow((current) => ({
            ...(current.orderId === resolvedOrderId ? current : createPaymentFlowState(resolvedOrderId)),
            ...nextFlow,
        }));
    };

    // Fetch order data
    const { orderData, isLoading: isLoadingOrderDetails, error: orderDetailError } = useOrderData(
        restaurantId,
        resolvedOrderId
    );

    // Generate idempotency key
    const idempotencyKey = useIdempotencyKey(restaurantId, orderData);

    // Derived state
    const orderItems = useMemo(() => mapOrderItemsToSummaryItems(orderData), [orderData]);
    const subtotal = orderData?.subtotal ?? 0;
    const discountAmount = orderData?.discount_amount ?? 0;
    const taxAmount = orderData?.tax_amount ?? 0;
    const totalAmount = orderData?.total_amount ?? 0;
    const tableNumber = orderData?.table_id ?? null;

    const cashPaidAmount = amountDigits ? Number(amountDigits) : 0;
    const cashChange = Math.max(cashPaidAmount - totalAmount, 0);
    const cashAmountError = amountDigits && cashPaidAmount < totalAmount ? 'Số tiền nhận không đủ.' : '';
    const quickAmounts = useMemo(() => [totalAmount, totalAmount + 50000, totalAmount + 100000], [totalAmount]);

    const qrCodeUrl = useMemo(() => {
        if (!isWalletMethod(selectedMethod) || !orderData) return '';
        return generateQRCodeUrl(orderData.order_number, selectedMethod, totalAmount, idempotencyKey);
    }, [idempotencyKey, orderData, selectedMethod, totalAmount]);

    // Handlers
    const handleBackToMethod = () => {
        updateFlow({
            currentStep: 'method',
            selectedMethod: '',
            amountDigits: '',
        });
    };

    const handleMethodSelect = (method: PaymentMethodId) => {
        updateFlow({
            selectedMethod: method,
            currentStep: 'payment',
        });
    };

    const completePayment = (method: PaymentMethodId, paidAmount: number, changeAmount: number) => {
        if (!orderData) return;
        updateFlow({
            paymentResult: {
                _id: idempotencyKey,
                createdAt: new Date().toISOString(),
                method,
                paidAmount,
                orderAmount: totalAmount,
                changeAmount,
            },
            currentStep: 'success',
        });
    };

    const handleCashComplete = async () => {
        if (cashPaidAmount < totalAmount || !orderData) return;
        try {
            await createCashPayment(restaurantId, resolvedOrderId, {
                method: 'cash',
                amount: totalAmount,
                cash_tendered: cashPaidAmount,
                idempotency_key: idempotencyKey,
            });
            completePayment('cash', cashPaidAmount, cashChange);
        } catch (error) {
            const appError = toPaymentEndpointError('create', error);
            console.error('Cash payment error:', appError);
            toast.error(appError.message);
        }
    };

    const handleCardComplete = () => completePayment('card', totalAmount, 0);

    const handleWalletComplete = () => {
        if (!isWalletMethod(selectedMethod)) return;
        completePayment(selectedMethod, totalAmount, 0);
    };

    const handleLeavePayment = () => {
        if (slug) {
            navigate(`${POS_BASE_PATH}/${slug}/orders`);
        } else {
            updateFlow({ currentStep: 'method' });
        }
    };

    const handleResetFlow = () => {
        updateFlow({
            currentStep: 'method',
            selectedMethod: '',
            amountDigits: '',
            paymentResult: {},
        });
        if (slug) navigate(`${POS_BASE_PATH}/${slug}/orders`);
    };

    // Render step content
    const renderStepContent = (): React.ReactNode => {
        if (!resolvedOrderId) {
            return (
                <div className="text-center py-12 space-y-4">
                    <Icon name="FileText" size={48} className="text-muted-foreground mx-auto" />
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Chưa chọn đơn hàng</h3>
                        <p className="text-sm text-muted-foreground">
                            Chọn một đơn từ danh sách để chuyển sang thanh toán.
                        </p>
                    </div>
                    <Button variant="default" onClick={handleLeavePayment} iconName="ArrowLeft" iconPosition="left">
                        Quay về danh sách đơn
                    </Button>
                </div>
            );
        }

        if (isLoadingOrderDetails) {
            return (
                <div className="text-center py-12">
                    <Icon name="Loader" size={48} className="text-muted-foreground mx-auto mb-4 animate-spin" />
                    <p className="text-muted-foreground">Đang tải chi tiết đơn hàng...</p>
                </div>
            );
        }

        if (orderDetailError) {
            return (
                <div className="text-center py-12 space-y-4">
                    <Icon name="AlertCircle" size={48} className="text-destructive mx-auto" />
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Không thể tải đơn hàng</h3>
                        <p className="text-sm text-muted-foreground">{orderDetailError}</p>
                    </div>
                    <Button variant="default" onClick={handleLeavePayment} iconName="ArrowLeft" iconPosition="left">
                        Quay về danh sách đơn
                    </Button>
                </div>
            );
        }

        if (!orderData) {
            return null;
        }

        switch (currentStep) {
            case 'method':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <OrderSummary
                                orderItems={orderItems}
                                subtotal={subtotal}
                                tax={taxAmount}
                                discount={discountAmount}
                                discountValue={orderData.discount_value ?? 0}
                                discountRef={orderData.discount_ref ?? null}
                                discountType={orderData.discount_type as 'none' | 'percent' | 'fixed' | 'coupon'}
                                serviceChargeAmount={orderData.service_charge_amount ?? 0}
                                serviceChargeRate={orderData.service_charge_rate ?? 0}
                                taxRate={orderData.tax_rate ?? 0}
                                total={totalAmount}
                                orderNumber={orderData.order_number}
                                tableNumber={tableNumber}
                                customerName={orderData.customer_name ?? null}
                                customerPhone={orderData.customer_phone ?? null}
                                orderType={orderData.order_type as 'dine_in' | 'takeaway' | 'delivery' | 'online'}
                                source={orderData.source as 'pos' | 'online' | 'qr' | 'app' | 'phone'}
                                notes={orderData.notes ?? null}
                            />
                        </div>
                        <div>
                            <PaymentMethodSelector
                                selectedMethod={selectedMethod}
                                onMethodSelect={handleMethodSelect}
                                availableMethods={['cash', 'card', 'momo', 'zalopay', 'banking', 'qr']}
                                enabledMethods={['cash']}
                                isLoading={false}
                                loadingMethod=""
                            />
                            <div className="mt-6 p-4 bg-surface border border-border rounded-lg">
                                <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Thông tin khách hàng</div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center space-x-2 text-foreground">
                                        <Icon name="User" size={16} className="text-muted-foreground flex-shrink-0" />
                                        <span className="font-medium">{orderData.customer_name || 'Không xác định'}</span>
                                    </div>
                                    {orderData.customer_phone && (
                                        <div className="flex items-center space-x-2 text-foreground">
                                            <Icon name="Phone" size={16} className="text-muted-foreground flex-shrink-0" />
                                            <span className="font-medium">{orderData.customer_phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'payment':
                return (
                    <div className="max-w-md mx-auto">
                        {selectedMethod === 'cash' && (
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
                        {selectedMethod === 'card' && (
                            <CardPaymentForm
                                totalAmount={totalAmount}
                                onPaymentSubmit={handleCardComplete}
                                onCancel={handleBackToMethod}
                            />
                        )}
                        {['momo', 'zalopay', 'banking', 'qr'].includes(selectedMethod) && (
                            <DigitalWalletForm
                                totalAmount={totalAmount}
                                walletType={selectedMethod as WalletMethod}
                                qrCodeUrl={qrCodeUrl}
                                onPaymentComplete={handleWalletComplete}
                                onCancel={handleBackToMethod}
                            />
                        )}
                    </div>
                );

            case 'success':
                return (
                    <div className="max-w-lg mx-auto">
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
                            onPrintReceipt={() => { }}
                            onSendDigitalReceipt={() => { }}
                            onNewOrder={handleResetFlow}
                            onBackToDashboard={handleLeavePayment}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="h-full min-h-0 overflow-auto p-4 md:p-5">
            <div className="mb-5">
                <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2.5 md:gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                if (currentStep === 'method') {
                                    handleLeavePayment();
                                } else if (currentStep === 'payment') {
                                    handleBackToMethod();
                                } else {
                                    handleLeavePayment();
                                }
                            }}
                            className="hover-scale"
                        >
                            <Icon name="ArrowLeft" size={20} />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold leading-tight text-foreground md:text-2xl">
                                {currentStep === 'method'
                                    ? 'Chọn phương thức thanh toán'
                                    : currentStep === 'payment'
                                        ? 'Xử lý thanh toán'
                                        : 'Thanh toán thành công'}
                            </h1>
                            <p className="text-sm text-muted-foreground">Xử lý thanh toán an toàn và nhanh chóng</p>
                        </div>
                    </div>
                    <div className="hidden items-center gap-2 whitespace-nowrap text-xs text-muted-foreground lg:flex">
                        <span>Đơn hàng: {orderData?.order_number ?? resolvedOrderId}</span>
                        <span>({orderData?._id ?? resolvedOrderId})</span>
                        <span>•</span>
                        <span>Bàn: {tableNumber ?? 'N/A'}</span>
                        <span>•</span>
                        <span>{renderedAt}</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { id: 'method', name: 'Phương thức', icon: 'CreditCard' },
                        { id: 'payment', name: 'Thanh toán', icon: 'DollarSign' },
                        { id: 'success', name: 'Hoàn tất', icon: 'CheckCircle' },
                    ].map((step, index, steps) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                        return (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={`flex items-center space-x-2 rounded-lg px-2.5 py-1.5 transition-smooth ${isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : isCompleted
                                            ? 'bg-success text-success-foreground'
                                            : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    <Icon name={isCompleted ? 'Check' : step.icon} size={16} />
                                    <span className="text-sm font-medium hidden sm:block">{step.name}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <Icon name="ChevronRight" size={14} className="mx-1.5 text-muted-foreground" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4 md:p-5">
                {renderStepContent()}
            </div>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 md:p-4">
                <div className="flex items-center gap-3">
                    <Icon name="Shield" size={20} className="text-blue-600" />
                    <div>
                        <h4 className="font-medium text-blue-800">Bảo mật thanh toán</h4>
                        <p className="text-sm text-blue-700">
                            Tất cả giao dịch được mã hóa và tuân thủ tiêu chuẩn bảo mật PCI DSS.
                            Thông tin thanh toán không được lưu trữ trên hệ thống.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSection;
