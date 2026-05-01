import { useParams } from 'react-router-dom';
import PublicOrderingScreen from '@/features/public/ordering/components/PublicOrderingScreen';

export default function TableOrderingPage() {
    const { qrCode } = useParams();

    // Logic: Giải mã qrCode để lấy ID bàn, hoặc truyền thẳng qrCode xuống PublicOrderingScreen
    // PublicOrderingScreen sẽ tự thiết lập state bàn (initialTable) và khoá chọn bàn (isTableFixed).
    
    return (
        <PublicOrderingScreen 
            tableQrCode={qrCode} 
        />
    );
}
