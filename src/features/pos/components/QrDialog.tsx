import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import Icon from '@/components/AppIcon';
import Button from './Button';

interface QrDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    qrUrl?: string | null;
    emptyMessage?: string;
    copyUrlLabel?: string;
    closeLabel?: string;
    qrSize?: number;
}

const QrDialog: React.FC<QrDialogProps> = ({
    open,
    onClose,
    title,
    subtitle,
    qrUrl,
    emptyMessage = 'Chưa có dữ liệu QR để hiển thị.',
    copyUrlLabel = 'Sao chép link',
    closeLabel = 'Đóng',
    qrSize = 196,
}) => {
    if (!open) return null;

    const hasQrUrl = Boolean(qrUrl);

    const handleCopyUrl = async () => {
        if (!qrUrl) {
            toast.error('Không có link QR để sao chép');
            return;
        }

        try {
            await navigator.clipboard.writeText(qrUrl);
            toast.success('Đã sao chép link QR');
        } catch {
            toast.error('Không thể sao chép link QR');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[1300] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-modal max-w-sm w-full max-h-[82vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Icon name="QrCode" size={24} className="text-primary shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover-scale" aria-label="Dong QR dialog">
                        <Icon name="X" size={20} />
                    </Button>
                </div>

                <div className="p-5 flex flex-col items-center">
                    <div className="bg-white p-3 rounded-lg">
                        {hasQrUrl ? (
                            <QRCodeSVG value={qrUrl!} size={qrSize} level="H" includeMargin />
                        ) : (
                            <p className="text-xs text-muted-foreground text-center">{emptyMessage}</p>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground mt-3 text-center">{subtitle ?? 'Quét mã QR để sử dụng liên kết này'}</p>
                    <div className="mt-3 p-2.5 bg-muted/50 rounded-lg w-full">
                        <p className="text-xs text-muted-foreground text-center break-all">{qrUrl ?? 'Chưa có'}</p>
                    </div>
                </div>

                <div className="p-4 border-t border-border flex items-center justify-between gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        iconName="Copy"
                        iconPosition="left"
                        onClick={handleCopyUrl}
                        disabled={!hasQrUrl}
                    >
                        {copyUrlLabel}
                    </Button>
                    <Button variant="default" size="sm" onClick={onClose}>{closeLabel}</Button>
                </div>
            </div>
        </div>
    );
};

export default QrDialog;