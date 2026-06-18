import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PosLayout from '@/layouts/pos/PosLayout';
import MainPosSection from '@/features/pos/sections/main-pos/MainPosSection';
import TableSection from '@/features/pos/sections/table/TableSection';
import { POS_BASE_PATH } from '@/routes/pos-route-config';
import { PosProvider } from '@/features/pos/contexts/PosContext';
import { usePosContext } from '@/features/pos/contexts/usePosContext';
import RejectToPreviousPage from '@/components/navigation/RejectToPreviousPage';
import {
  demoNotifications,
  getRelativeTime,
} from '@/features/pos/mocks/pos-mock';
import PaymentSection from '@/features/pos/sections/payment/PaymentSection';
import OrderSection from '@/features/pos/sections/order/OrderSection';
import MenuSection from '@/features/pos/sections/menu/MenuSection';
import StaffSection from '@/features/pos/sections/staff/StaffSection';

type POSSection = 'main-pos' | 'table' | 'payment' | 'order' | 'menu' | 'staff';

const PAYMENT_ROUTE_PATTERN = /^\/payments\/([^/]+)$/;

const ROUTE_TO_SECTION: Record<string, POSSection> = {
  '': 'main-pos',
  '/': 'main-pos',
  '/tables': 'table',
  '/table': 'table',
  '/payments': 'payment',
  '/payment': 'payment',
  '/orders': 'order',
  '/order': 'order',
  '/menu': 'menu',
  '/staff': 'staff',
};

const SECTION_TO_ROUTE_SUFFIX: Record<POSSection, string> = {
  'main-pos': '',
  table: '/tables',
  payment: '/payments',
  order: '/orders',
  menu: '/menu',
  staff: '/staff',
};

const getPosSubPath = (pathname: string, slug: string) => {
  const posPrefix = `${POS_BASE_PATH}/${slug}`;

  if (!pathname.startsWith(posPrefix)) {
    return pathname;
  }

  const subPath = pathname.slice(posPrefix.length);
  return subPath || '/';
};

const normalizePosSubPath = (subPath: string) => {
  if (PAYMENT_ROUTE_PATTERN.test(subPath)) {
    return '/payments';
  }

  return subPath;
};

const getPaymentOrderIdFromSubPath = (subPath: string) => {
  const match = subPath.match(PAYMENT_ROUTE_PATTERN);
  return match?.[1] ?? null;
};

const PosPageContent: React.FC<{ slug: string }> = ({ slug }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { loading, error } = usePosContext();

  const [isOperational, setIsOperational] = useState(true);
  const subPath = getPosSubPath(pathname, slug);
  const normalizedSubPath = normalizePosSubPath(subPath);
  const paymentOrderId = getPaymentOrderIdFromSubPath(subPath);
  const activeSection = ROUTE_TO_SECTION[normalizedSubPath] ?? 'main-pos';

  useEffect(() => {
    if (!ROUTE_TO_SECTION[normalizedSubPath]) {
      navigate(`${POS_BASE_PATH}/${slug}`, { replace: true });
    }
  }, [navigate, slug, normalizedSubPath]);

  const handleToggleOperational = React.useCallback(() => {
    setIsOperational(prev => !prev);
  }, []);

  const handleSectionChange = React.useCallback((section: string) => {
    const normalizedSection = section as POSSection;

    const targetSuffix = SECTION_TO_ROUTE_SUFFIX[normalizedSection] ?? '';
    const targetPath = `${POS_BASE_PATH}/${slug}${targetSuffix}`;
    if (pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [navigate, pathname, slug]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading POS data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return <RejectToPreviousPage />;
  }

  let sectionContent: React.ReactNode;
  switch (activeSection) {
    case 'main-pos':
      sectionContent = <MainPosSection />;
      break;
    case 'table':
      sectionContent = <TableSection />;
      break;
    case 'payment':
      sectionContent = <PaymentSection orderId={paymentOrderId} />;
      break;
    case 'order':
      sectionContent = <OrderSection />;
      break;
    case 'menu':
      sectionContent = <MenuSection />;
      break;
    case 'staff':
      sectionContent = <StaffSection />;
      break;
    default:
      sectionContent = <MainPosSection />;
      break;
  }

  return (
    <PosLayout
      notifications={demoNotifications}
      isOperational={isOperational}
      onToggleOperational={handleToggleOperational}
      getRelativeTime={getRelativeTime}
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
    >
      {sectionContent}
    </PosLayout>
  );
};

const PosPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const currentSlug = slug?.trim() ?? '';

  if (!currentSlug) {
    return <RejectToPreviousPage />;
  }

  return (
    <PosProvider slug={currentSlug}>
      <PosPageContent slug={currentSlug} />
    </PosProvider>
  );
};

export default PosPage;
