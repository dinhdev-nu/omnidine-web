import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import Icon from '@/components/AppIcon';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
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
    returnFocusRef,
}) => {
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
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
            <DialogContent
                showCloseButton={false}
                className="max-h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] gap-0 overflow-hidden p-0 sm:max-w-sm"
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    returnFocusRef?.current?.focus();
                }}
            >
                <DialogHeader className="relative border-b border-border p-4 pr-16">
                    <div className="flex min-w-0 items-start gap-3">
                        <Icon name="QrCode" size={24} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                        <div className="min-w-0">
                            <DialogTitle className="break-words text-lg font-semibold">{title}</DialogTitle>
                            <DialogDescription className="mt-1 break-words leading-relaxed">
                                {subtitle ?? 'Quét mã QR để sử dụng liên kết này'}
                            </DialogDescription>
                        </div>
                    </div>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="absolute right-2 top-2" aria-label="Đóng hộp thoại mã QR">
                            <Icon name="X" size={20} aria-hidden="true" />
                        </Button>
                    </DialogClose>
                </DialogHeader>

                <div className="flex min-h-0 flex-col items-center gap-3 overflow-y-auto p-4 sm:p-5">
                    <div className="flex w-full max-w-56 items-center justify-center rounded-lg bg-white p-3">
                        {hasQrUrl ? (
                            <div role="img" aria-label={`Mã QR cho ${title}`}>
                                <QRCodeSVG value={qrUrl!} size={qrSize} level="H" includeMargin className="h-auto max-w-full" aria-hidden="true" />
                            </div>
                        ) : (
                            <p role="status" className="text-center text-xs text-muted-foreground">{emptyMessage}</p>
                        )}
                    </div>

                    <div className="w-full min-w-0 rounded-lg bg-muted/50 p-3">
                        <p className="break-all text-center text-xs text-muted-foreground">{qrUrl ?? 'Chưa có'}</p>
                    </div>
                </div>

                <DialogFooter className="m-0 rounded-none px-4 py-4">
                    <DialogClose asChild>
                        <Button variant="outline" className="w-full sm:w-auto">{closeLabel}</Button>
                    </DialogClose>
                    <Button
                        variant="default"
                        iconName="Copy"
                        iconPosition="left"
                        onClick={handleCopyUrl}
                        disabled={!hasQrUrl}
                        className="w-full sm:w-auto"
                    >
                        {copyUrlLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default QrDialog;
