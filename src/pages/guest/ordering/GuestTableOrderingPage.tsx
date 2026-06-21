import { useParams } from 'react-router-dom';
import GuestOrderingScreen from '@/features/guest/ordering/components/GuestOrderingScreen';

export default function GuestTableOrderingPage() {
    const { qrCode } = useParams();

    // Logic: Giải mã qrCode để lấy ID bàn, hoặc truyền thẳng qrCode xuống GuestOrderingScreen
    // GuestOrderingScreen sẽ tự thiết lập state bàn (initialTable) và khoá chọn bàn (isTableFixed).
    
    return (
        <GuestOrderingScreen 
            tableQrCode={qrCode} 
        />
    );
}
