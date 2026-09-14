import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateRestaurant } from '@/features/restaurant-onboarding/FormProvider';
import { RegistrationForm } from '@/features/restaurant-onboarding/RegistrationForm';
import { PrivacyDialog } from '@/features/restaurant-onboarding/PrivacyDialog';
import { REQUIRED_FIELDS, isFieldFilled } from '@/features/restaurant-onboarding/constants';
import { SettingsHeader } from '@/layouts/settings/SettingsHeader';

const CANCEL_FALLBACK_PATH = '/settings/manage/restaurants';

type RestaurantOnboardingLocationState = {
    from?: string;
};

function LayoutFooter({ onOpenPreview, onCancel }: { onOpenPreview: () => void; onCancel: () => void }) {
    const { formData } = useCreateRestaurant();

    const filledCount = REQUIRED_FIELDS.filter((field) => isFieldFilled(formData, field)).length;

    const hasStarted = REQUIRED_FIELDS.some(
        (field) => field !== 'operating_hours' && isFieldFilled(formData, field)
    );

    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-[calc(1rem+env(safe-area-inset-left))] py-3 pr-[calc(1rem+env(safe-area-inset-right))] pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur sm:px-8">
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
                    disabled={!hasStarted}
                    className="w-full bg-foreground px-8 font-bold text-background hover:bg-foreground/90 sm:w-auto"
                >
                    <Eye data-icon="inline-start" />
                    Xem thông tin
                </Button>
            </div>
        </div>
    );
}

export function RestaurantOnboardingLayout() {
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
        const from = (location.state as RestaurantOnboardingLocationState | null)?.from;

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
        <div className="flex min-h-dvh w-full flex-col bg-background pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] font-sans">
            <a
                href="#create-restaurant-form"
                className="fixed -top-16 left-4 z-50 flex min-h-11 touch-manipulation items-center rounded-md bg-background px-4 text-sm font-medium text-foreground shadow-lg transition-[top] motion-reduce:transition-none focus:top-4 focus:outline-none focus:ring-3 focus:ring-ring/50"
            >
                Bỏ qua đến biểu mẫu đăng ký
            </a>
            <SettingsHeader isDark={isDark} onToggle={() => setIsDark((value) => !value)} />

            <main className="min-h-0 flex-1 w-full overflow-y-auto scrollbar-hide custom-scrollbar">
                <div className="flex min-h-full">
                    <div className="hidden sm:block flex-1 border-r border-border" />
                    <div className="w-full max-w-3xl px-4 pt-6 pb-40 sm:px-8 sm:pb-24">
                        <form id="create-restaurant-form" tabIndex={-1} className="outline-none" onSubmit={handleSubmit}>
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
