import { CreateRestaurantProvider } from '@/features/restaurant-onboarding/FormProvider';
import { RestaurantOnboardingLayout } from '@/layouts/restaurant-onboarding/RestaurantOnboardingLayout';

export default function RestaurantOnboardingPage() {
    return (
        <CreateRestaurantProvider>
            <RestaurantOnboardingLayout />
        </CreateRestaurantProvider>
    );
}