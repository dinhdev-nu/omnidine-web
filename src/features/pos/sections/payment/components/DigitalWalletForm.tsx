import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '@/components/AppIcon';
import Button from '../../../ui/Button';

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

type WalletType = 'momo' | 'zalopay' | 'banking' | 'qr';

interface DigitalWalletFormProps {
  totalAmount?: number;
  walletType?: WalletType;
  qrCodeUrl?: string;
  isConfirming?: boolean;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

interface WalletInfo {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  instructions: string;
}

interface QrImageState {
  src: string;
  isLoaded: boolean;
  isLoading: boolean;
  retryCount: number;
}

const WALLET_INFO: Record<WalletType, WalletInfo> = {
  momo: {
    name: 'MoMo', icon: 'Smartphone',
    color: 'text-pink-600', bgColor: 'bg-pink-50', borderColor: 'border-pink-200',
    instructions: 'Mở ứng dụng MoMo và quét mã QR để thanh toán',
  },
  zalopay: {
    name: 'ZaloPay', icon: 'Wallet',
    color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200',
    instructions: 'Mở ứng dụng ZaloPay và quét mã QR để thanh toán',
  },
  banking: {
    name: 'Internet Banking', icon: 'Building2',
    color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200',
    instructions: 'Sử dụng ứng dụng ngân hàng để quét mã QR',
  },
  qr: {
    name: 'VietQR', icon: 'QrCode',
    color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200',
    instructions: 'Quét mã QR bằng ứng dụng ngân hàng bất kỳ',
  },
};

const MAX_RETRIES = 10;

const formatCurrency = (amount: number): string =>
  currencyFormatter.format(amount);

const DigitalWalletForm: React.FC<DigitalWalletFormProps> = ({
  totalAmount = 0,
  walletType = 'momo',
  qrCodeUrl = '',
  isConfirming = false,
  onPaymentComplete,
  onCancel,
}) => {
  const [imageState, setImageState] = useState<QrImageState>({
    src: '',
    isLoaded: false,
    isLoading: true,
    retryCount: 0,
  });
  const [renderedAt] = useState(() => new Date().toLocaleString('vi-VN'));
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRetryTimeout = useCallback(() => {
    const timeoutId = retryTimeoutRef.current;
    if (timeoutId) {
      clearTimeout(timeoutId);
      retryTimeoutRef.current = null;
    }
  }, []);

  const currentWallet = WALLET_INFO[walletType] ?? WALLET_INFO.momo;
  const currentImageState =
    imageState.src === qrCodeUrl
      ? imageState
      : {
          src: qrCodeUrl,
          isLoaded: false,
          isLoading: Boolean(qrCodeUrl),
          retryCount: 0,
        };
  const { isLoaded: isImageLoaded, isLoading: isImageLoading, retryCount } = currentImageState;

  // Cleanup on unmount
  useEffect(() => {
    return clearRetryTimeout;
  }, [clearRetryTimeout]);

  const handleImageLoad = () => {
    setImageState({
      src: qrCodeUrl,
      isLoaded: true,
      isLoading: false,
      retryCount: 0,
    });
    clearRetryTimeout();
  };

  const handleImageError = () => {
    if (retryCount < MAX_RETRIES) {
      const delay = Math.min(1000 * (retryCount + 1), 3000);
      retryTimeoutRef.current = setTimeout(() => {
        setImageState((prev) => ({
          src: qrCodeUrl,
          isLoaded: false,
          isLoading: true,
          retryCount: prev.src === qrCodeUrl ? prev.retryCount + 1 : 1,
        }));
      }, delay);
    } else {
      setImageState({
        src: qrCodeUrl,
        isLoaded: false,
        isLoading: false,
        retryCount,
      });
    }
  };

  const handleManualRetry = () => {
    setImageState({
      src: qrCodeUrl,
      isLoaded: false,
      isLoading: true,
      retryCount: retryCount + 1,
    });
  };

  return (
    <div className="space-y-4 p-3 sm:p-4">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 ${currentWallet.bgColor} ${currentWallet.borderColor}`}>
          <Icon name={currentWallet.icon} size={18} aria-hidden="true" className={currentWallet.color} />
          <h2 className="text-base font-semibold text-foreground">{currentWallet.name}</h2>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-2.5">
          <p className="mb-0.5 text-xs text-muted-foreground">Số tiền thanh toán</p>
          <p className="text-xl font-bold text-primary tabular-nums">{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="flex justify-center">
        <div className="relative rounded-lg border border-gray-200 bg-white p-4">
          {qrCodeUrl ? (
            <div className="relative size-48 max-w-full">
              {/* Loading overlay */}
              {isImageLoading && !isImageLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                  <div role="status" aria-live="polite" className="space-y-1.5 text-center">
                    <Icon name="Loader" size={32} aria-hidden="true" className="mx-auto animate-spin text-primary motion-reduce:animate-none" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">Đang tải mã QR...</p>
                      {retryCount > 0 && (
                          <p className="mt-1 text-xs text-gray-500">
                          Thử lại {retryCount}/{MAX_RETRIES}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* QR image */}
              <img
                key={`${qrCodeUrl}:${retryCount}`}
                src={`${qrCodeUrl}${qrCodeUrl.includes('?') ? '&' : '?'}t=${retryCount}`}
                alt={`Mã QR thanh toán ${currentWallet.name}`}
                width={192}
                height={192}
                className={`size-full rounded-lg object-contain transition-opacity duration-300 motion-reduce:transition-none ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />

              {/* Error state */}
              {!isImageLoading && !isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg border border-dashed border-red-300 bg-red-50">
                  <div className="space-y-1.5 text-center">
                    <Icon name="AlertCircle" size={32} aria-hidden="true" className="mx-auto text-red-500" />
                    <div>
                      <p className="text-xs font-medium text-red-700">Không thể tải mã QR</p>
                      <Button
                        variant="error"
                        size="sm"
                        onClick={handleManualRetry}
                        className="mt-2"
                      >
                        Thử lại
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex size-48 max-w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
              <div role="status" aria-live="polite" className="space-y-1.5 text-center">
                <Icon name="Loader" size={36} aria-hidden="true" className="mx-auto animate-spin text-gray-400 motion-reduce:animate-none" />
                <p className="text-xs font-medium text-gray-600">Đang tạo mã QR…</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-2.5">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-blue-600" />
          <p className="text-xs text-blue-900">
            {currentWallet.instructions}. Sau khi thanh toán, nhấn <strong>"Xác nhận"</strong> bên dưới
          </p>
        </div>
      </div>

      {/* Payment Details */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
        <div className="space-y-2">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <Icon name="Wallet" size={14} aria-hidden="true" className="shrink-0 text-gray-600" />
              <span className="text-xs text-muted-foreground">Phương thức</span>
            </div>
            <span className="text-xs font-semibold text-foreground">{currentWallet.name}</span>
          </div>
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <Icon name="DollarSign" size={14} aria-hidden="true" className="shrink-0 text-gray-600" />
              <span className="text-xs text-muted-foreground">Số tiền</span>
            </div>
            <span className="text-xs font-semibold text-foreground">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <Icon name="Clock" size={14} aria-hidden="true" className="shrink-0 text-gray-600" />
              <span className="text-xs text-muted-foreground">Thời gian</span>
            </div>
            <span className="text-xs font-medium text-foreground">
              {renderedAt}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-2 pt-1 min-[390px]:flex-row">
        <Button variant="outline" onClick={onCancel} className="w-full min-[390px]:flex-1" disabled={isConfirming}>
          Hủy
        </Button>
        <Button
          variant="default"
          onClick={onPaymentComplete}
          className="w-full min-[390px]:flex-1"
          iconName={isConfirming ? 'Loader' : 'CheckCircle'}
          iconPosition="left"
          disabled={!isImageLoaded || isConfirming}
        >
          {isConfirming ? 'Đang xử lý…' : isImageLoaded ? 'Xác nhận thanh toán' : 'Đang tải QR…'}
        </Button>
      </div>
    </div>
  );
};

export default DigitalWalletForm;
