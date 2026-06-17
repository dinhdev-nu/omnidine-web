import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateRestaurant } from '@/features/new/FormProvider';
import { RegistrationForm } from '@/features/new/RegistrationForm';
import { PrivacyDialog } from '@/features/new/PrivacyDialog';
import { REQUIRED_FIELDS, isFieldFilled } from '@/features/new/constants';
import { SettingsHeader } from '@/layouts/settings/SettingsHeader';

const CANCEL_FALLBACK_PATH = '/settings/manage/restaurants';

type NewRestaurantLocationState = {
    from?: string;
};

function LayoutFooter({ onOpenPreview, onCancel }: { onOpenPreview: () => void; onCancel: () => void }) {
    const { formData } = useCreateRestaurant();

    const filledCount = REQUIRED_FIELDS.filter((field) => isFieldFilled(formData, field)).length;

    // For showcase, we allow click even if not 100% complete, but in real app we'd check `progress === 100`
    const isComplete = filledCount > 0;

    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur sm:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-between gap-4 sm:justify-start">
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={onCancel}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft data-icon="inline-start" />
                        <span>Hủy bỏ</span>
                    </Button>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                        {filledCount}/{REQUIRED_FIELDS.length} trường bắt buộc
                    </span>
                </div>
                <Button
                    type="button"
                    onClick={onOpenPreview}
                    disabled={!isComplete}
                    className="w-full bg-foreground px-8 font-bold text-background hover:bg-foreground/90 sm:w-auto"
                >
                    <Eye data-icon="inline-start" />
                    Xem thông tin
                </Button>
            </div>
        </div>
    );
}

export function NewRestaurantLayout() {
    const { handleSubmit } = useCreateRestaurant();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDark, setIsDark] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        html.classList.add('scrollbar-hide');
        body.classList.add('scrollbar-hide');

        return () => {
            html.classList.remove('scrollbar-hide');
            body.classList.remove('scrollbar-hide');
        };
    }, []);

    useEffect(() => {
        const html = document.documentElement;

        if (isDark) html.classList.add('dark');
        else html.classList.remove('dark');

        return () => html.classList.remove('dark');
    }, [isDark]);

    const handleCancel = () => {
        const from = (location.state as NewRestaurantLocationState | null)?.from;

        if (from?.startsWith('/') && from !== location.pathname) {
            navigate(from, { replace: true });
            return;
        }

        const historyIndex = window.history.state?.idx;
        if (typeof historyIndex === 'number' && historyIndex > 0) {
            navigate(-1);
            return;
        }

        navigate(CANCEL_FALLBACK_PATH, { replace: true });
    };

    return (
        <div className="flex min-h-dvh w-full flex-col bg-background font-sans">
            <SettingsHeader isDark={isDark} onToggle={() => setIsDark((value) => !value)} />

            <main className="min-h-0 flex-1 w-full overflow-y-auto scrollbar-hide custom-scrollbar">
                <div className="flex min-h-full">
                    <div className="hidden sm:block flex-1 border-r border-border" />
                    <div className="w-full max-w-3xl px-4 pt-6 pb-28 sm:px-8 sm:pb-24">
                        <form id="create-restaurant-form" onSubmit={handleSubmit}>
                            <RegistrationForm />
                        </form>
                    </div>
                    <div className="hidden sm:block flex-1 border-l border-border" />
                </div>
            </main>

            <LayoutFooter onOpenPreview={() => setIsPrivacyOpen(true)} onCancel={handleCancel} />

            <PrivacyDialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
        </div>
    );
}
