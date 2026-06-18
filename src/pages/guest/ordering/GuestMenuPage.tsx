import { useParams } from 'react-router-dom';
import PublicOrderingScreen from '@/features/guest/ordering/components/PublicOrderingScreen';

export default function GuestMenuPage() {
    const { slug } = useParams();

    // Logic: Có thể dùng useEffect để lấy thông tin chi nhánh dựa trên slug,
    // Hoặc PublicOrderingScreen sẽ tự fetch dữ liệu dựa trên prop restaurantSlug.
    
    return (
        <PublicOrderingScreen 
            restaurantSlug={slug} 
        />
    );
}
