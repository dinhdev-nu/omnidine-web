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
        <div className="shrink-0 border-t border-border bg-background/80 px-4 py-3 sm:px-8">
            <div className="mx-auto flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
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
                    className="bg-foreground text-background hover:bg-foreground/90 font-bold px-8"
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

            <main className="min-h-0 flex-1 w-full overflow-y-auto custom-scrollbar">
                <div className="flex min-h-full">
                    <div className="hidden sm:block flex-1 border-r border-border" />
                    <div className="w-full max-w-3xl px-4 sm:px-8 py-6">
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
