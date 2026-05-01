import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MenuCategory from './components/MenuCategory';
import MenuGrid from './components/MenuGrid';
import OrderCart from './components/OrderCart';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Icon from '@/components/AppIcon';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { usePosContext } from '@/features/pos/contexts/usePosContext';
import { useMainPosMenuData } from './hooks/useMainPosMenuData';
import { useOrderCreation } from './hooks/useOrderCreation';
import { useFetch } from '@/hooks/useFetch';
import { listTables } from '@/services/tables';
import type { TableListResponse } from '@/types/table-type';

type PosOrderType = '' | 'dine_in' | 'takeaway' | 'delivery';
type PosOrderSource = 'pos' | 'phone';

const fetchAvailableActiveTables = async (restaurantId: string): Promise<TableListResponse> => {
  return listTables(restaurantId, {
    status: 'available',
    is_active: true,
  });
};

// ─── Component ────────────────────────────────────────────────────────────────

const MainPosSection: React.FC = () => {
  const { data: posData } = usePosContext();
  const restaurantId = posData?.restaurant._id;
  const staff = posData?.current_staff ?? null;
  const normalizedRestaurantId = restaurantId ?? '';

  const [cartItems, setCartItems] = useState<Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
    note?: string;
  }>>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(staff?._id ?? null);
  const [selectedOrderType, setSelectedOrderType] = useState<PosOrderType>('');
  const [selectedOrderSource, setSelectedOrderSource] = useState<PosOrderSource>('pos');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: availableTablesData } = useFetch(fetchAvailableActiveTables, [normalizedRestaurantId], {
    enabled: Boolean(restaurantId),
  });

  const { uiCategories, uiMenuItems } = useMainPosMenuData({
    restaurantId,
    activeCategory,
    searchQuery,
  });

  const handleAddToCart = useCallback((item: { _id: string; name: string; price: number }) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { _id: item._id, name: item.name, price: item.price, quantity: 1, note: '' }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((id: string, qty: number) => {
    setCartItems(prev => prev.map(i => (i._id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
  }, []);

  const handleUpdateNote = useCallback((id: string, note: string) => {
    setCartItems(prev => prev.map(i => (i._id === id ? { ...i, note } : i)));
  }, []);

  const onClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const onTableChange = useCallback((value: string) => {
    setSelectedTable(value || null);
  }, []);

  const onStaffChange = useCallback((value: string) => {
    setSelectedStaff(value || null);
  }, []);

  const onOrderTypeChange = useCallback((value: string) => {
    const nextType = (value || 'dine_in') as PosOrderType;
    setSelectedOrderType(nextType);
  }, []);

  const onOrderSourceChange = useCallback((value: string) => {
    const nextSource = (value || 'pos') as PosOrderSource;
    setSelectedOrderSource(nextSource);
  }, []);

  useEffect(() => {
    if (selectedOrderType !== 'dine_in') {
      setSelectedTable(null);
    }
  }, [selectedOrderType]);

  const tableOptions = useMemo(() => {
    const tables = availableTablesData?.data ?? [];
    return tables.map((table) => {
      // Ensure we have a valid ID
      const tableId = table._id || table.id;
      if (!tableId) {
        console.warn('Table missing ID:', table);
        return {
          value: '',
          label: `${table.table_number} (NO ID)`,
        };
      }
      return {
        value: tableId,
        label: `${table.table_number}${table.name?.trim() ? ` - ${table.name.trim()}` : ''} (${table.capacity})`,
      };
    });
  }, [availableTablesData]);

  const staffOptions = useMemo(() => {
    if (!staff) return [];
    return [{ value: staff._id, label: staff.full_name }];
  }, [staff]);

  // Stubs for functionality not fully implemented
  const onSummaryChange = () => { };

  const { isCreatingOrder, orderNumber: hookOrderNumber, createOrder } = useOrderCreation({
    restaurantId,
    onOrderCreated: () => {
      setCartItems([]);
      setCustomerName('');
      setCustomerPhone('');
      setOrderNotes('');
      if (selectedOrderType === 'dine_in') {
        setSelectedTable(null);
      }
    },
  });

  const onCreateOrder = () => {
    createOrder({
      selectedOrderType,
      selectedOrderSource,
      selectedTable,
      customerName,
      customerPhone,
      orderNotes,
      cartItems,
    });
  };

  // Get order number from hook
  const orderNumber = hookOrderNumber;

  const [showMobileCart, setShowMobileCart] = useState(false);
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate final total with tax and service charge rates from context (already in decimal form)
  const orderSummary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxRate = posData?.restaurant?.tax_rate ?? 0.10;
    const serviceRate = posData?.restaurant?.service_charge_rate ?? 0;
    const tax = subtotal * taxRate;
    const serviceCharge = subtotal * serviceRate;
    return {
      subtotal,
      tax,
      serviceCharge,
      total: subtotal + tax + serviceCharge,
    };
  }, [cartItems, posData?.restaurant?.tax_rate, posData?.restaurant?.service_charge_rate]);

  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(orderSummary.total);

  return (
    <>
      {/* ── Two-panel split ───────────────────────────────────────────────── */}
      <div className="h-full min-h-0 flex flex-col lg:flex-row relative">

        {/* ── Left Panel: Menu ─────────────────────────────────────────────── */}
        <div className={[
          'flex-1 bg-surface border-r border-border overflow-hidden flex-col',
          showMobileCart ? 'hidden lg:flex' : 'flex',
        ].join(' ')}>
          <>
            <div className="p-4 border-b border-border">
              <h1 className="text-xl font-semibold text-foreground mb-4">Thực đơn</h1>

              <div className="mb-4 relative">
                <Input
                  type="text"
                  placeholder="Tìm món theo tên..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full pr-10"
                />
                <Icon
                  name="Search"
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>

              <p className="text-sm font-medium text-foreground mb-2">Danh mục</p>
              <MenuCategory
                categories={uiCategories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <MenuGrid menuItems={uiMenuItems} onAddToCart={handleAddToCart} />
            </div>
          </>
        </div>

        {/* ── Right Panel: Cart ────────────────────────────────────────────── */}
        <div className={[
          'w-full lg:w-96 bg-surface border-l border-border flex-col overflow-hidden',
          showMobileCart ? 'flex' : 'hidden lg:flex',
        ].join(' ')}>

          <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-foreground">Đơn hàng</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileCart(false)}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <OrderCart
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onUpdateNote={handleUpdateNote}
              onClearCart={() => setShowClearCartDialog(true)}
              orderNumber={orderNumber}
              selectedTable={selectedTable}
              onTableChange={onTableChange}
              selectedStaff={selectedStaff}
              onStaffChange={onStaffChange}
              selectedOrderType={selectedOrderType}
              onOrderTypeChange={onOrderTypeChange}
              selectedOrderSource={selectedOrderSource}
              onOrderSourceChange={onOrderSourceChange}
              customerName={customerName}
              onCustomerNameChange={setCustomerName}
              customerPhone={customerPhone}
              onCustomerPhoneChange={setCustomerPhone}
              orderNotes={orderNotes}
              onOrderNotesChange={setOrderNotes}
              tableOptions={tableOptions}
              staffOptions={staffOptions}
              onSummaryChange={onSummaryChange}
              hideDiscount={true}
            />
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-border p-4 flex-shrink-0 bg-surface space-y-2">
              <Button
                variant="default"
                size="default"
                fullWidth
                iconName={isCreatingOrder ? 'Loader2' : 'FileText'}
                iconPosition="left"
                onClick={onCreateOrder}
                disabled={isCreatingOrder}
                className={`hover-scale touch-target ${isCreatingOrder ? 'animate-pulse' : ''}`}
              >
                {isCreatingOrder ? 'Đang tạo đơn...' : 'Tạo đơn hàng'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Cart FAB ───────────────────────────────────────────────────── */}
      <div className="lg:hidden absolute bottom-4 right-4 z-20">
        <Button
          variant="default"
          size="lg"
          onClick={() => setShowMobileCart(true)}
          className="rounded-full shadow-modal hover-scale relative"
        >
          <Icon name="ShoppingCart" size={24} className="mr-2" />
          <span>Giỏ hàng ({totalItems})</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </div>

      {/* ── Clear cart dialog ─────────────────────────────────────────────────── */}
      <ConfirmationDialog
        isOpen={showClearCartDialog}
        onClose={() => setShowClearCartDialog(false)}
        onConfirm={() => { onClearCart?.(); setShowClearCartDialog(false); }}
        title="Xóa giỏ hàng"
        message="Bạn có chắc chắn muốn xóa tất cả món trong giỏ hàng?"
        confirmText="Xóa tất cả"
        cancelText="Hủy"
        variant="danger"
        icon="Trash2"
      />
    </>
  );
};

export default MainPosSection;