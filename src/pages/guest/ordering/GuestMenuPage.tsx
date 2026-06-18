import { useParams } from 'react-router-dom';
import GuestOrderingScreen from '@/features/guest/ordering/components/GuestOrderingScreen';

export default function GuestMenuPage() {
    const { slug } = useParams();

    // Logic: Có thể dùng useEffect để lấy thông tin chi nhánh dựa trên slug,
    // Hoặc GuestOrderingScreen sẽ tự fetch dữ liệu dựa trên prop restaurantSlug.
    
    return (
        <GuestOrderingScreen 
            restaurantSlug={slug} 
        />
    );
}
