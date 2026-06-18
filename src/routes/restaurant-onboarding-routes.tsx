import { Route } from 'react-router-dom';
import RestaurantOnboardingPage from '@/pages/restaurant-onboarding/RestaurantOnboardingPage';
import { RESTAURANT_ONBOARDING_ROUTE_PATH } from '@/routes/restaurant-onboarding-route-config';

export { RESTAURANT_ONBOARDING_ROUTE_PATH };

export function RestaurantOnboardingRoute() {
    return <Route path={RESTAURANT_ONBOARDING_ROUTE_PATH} element={<RestaurantOnboardingPage />} />;
}
