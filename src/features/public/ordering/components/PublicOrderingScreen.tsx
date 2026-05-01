import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useFetch } from '@/hooks/useFetch';
import { getPublicMenu, searchPublicMenu } from '@/services/menu';
import { createPublicOrder } from '@/services/orders';
import { getPublicTableByQrCode, listTables } from '@/services/tables';

import Icon from '@/components/AppIcon';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import RejectToPreviousPage from '@/components/navigation/RejectToPreviousPage';
import Header from './Header';
import MenuCategory from './MenuCategory';
import MenuGrid from './MenuGrid';
import OrderCart from './OrderCart';
import Button from '@/features/pos/components/Button';
import Input from '@/features/pos/components/Input';
import { PublicOrderingLayout } from '@/layouts/public/PublicOrderingLayout';
import '@/layouts/pos/pos.css';
import { useUserStore } from '@/stores/user-store';
import type { CartItem, OrderingMenuItem, OrderingUser } from '@/features/public/ordering';
import type { CreatePublicOrderPayload } from '@/types/order-type';
import type { TableListResponse } from '@/types/table-type';
import type { OperatingHours } from '@/types/restaurant-type';

type PublicOrderType = CreatePublicOrderPayload['order_type'] | '';

const fetchAvailableActiveTables = async (restaurantId: string): Promise<TableListResponse> => {
    return listTables(restaurantId, {
        status: 'available',
        is_active: true,
    });
};



// Helper to check if restaurant is currently open based on operating_hours
const isRestaurantCurrentlyOpen = (operatingHours: OperatingHours | null): boolean => {
    if (!operatingHours) return false;

    const now = new Date();
    const dayNames: Array<'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'> = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayKey = dayNames[now.getDay()];

    const todayHours = operatingHours[todayKey];
    if (!todayHours || todayHours.closed) return false;

    const [openHour, openMin] = todayHours.open?.split(':').map(Number) || [0, 0];
    const [closeHour, closeMin] = todayHours.close?.split(':').map(Number) || [0, 0];

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

export interface PublicOrderingProps {
    tableQrCode?: string;
    restaurantSlug?: string;
}

const PublicOrderingScreen = ({ tableQrCode, restaurantSlug: propRestaurantSlug }: PublicOrderingProps) => {
    const profile = useUserStore((state) => state.profile);
    const user = profile as OrderingUser | null;

    // --- API Data Fetching ---
    const { data: tableData, error: tableError } = useFetch(
        getPublicTableByQrCode,
        [tableQrCode ?? ''],
        { enabled: !!tableQrCode }
    );

    const isTableFixed = !!tableQrCode;
    const resolvedSlug = tableData?.restaurant?.slug || propRestaurantSlug;
    const initialTable = tableData?.table_id || null;

    const { data: menuData, error: menuError } = useFetch(
        getPublicMenu,
        [resolvedSlug ?? ''],
        { enabled: !!resolvedSlug }
    );

    const restaurantId = menuData?.restaurant?._id ?? null;

    const isOperational = (menuData?.restaurant?.is_published ?? false) &&
        isRestaurantCurrentlyOpen(menuData?.restaurant?.operating_hours ?? null);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showMobileCart, setShowMobileCart] = useState<boolean>(false);
    const [showClearCartDialog, setShowClearCartDialog] = useState<boolean>(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string>('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const { data: searchData } = useFetch(
        searchPublicMenu,
        [resolvedSlug ?? '', debouncedQuery],
        { enabled: !!resolvedSlug && !!debouncedQuery }
    );
    const [selectedOrderType, setSelectedOrderType] = useState<PublicOrderType>(isTableFixed ? 'dine_in' : '');
    const [selectedTableId, setSelectedTableId] = useState<string | null>(initialTable);
    const [customerName, setCustomerName] = useState<string>('');
    const [customerContact, setCustomerContact] = useState<string>('');
    const [orderNotes, setOrderNotes] = useState<string>('');

    const { data: availableTablesData } = useFetch(
        fetchAvailableActiveTables,
        [restaurantId ?? ''],
        { enabled: !!restaurantId && !isTableFixed }
    );

    useEffect(() => {
        if (isTableFixed) {
            setSelectedOrderType('dine_in');
        }
    }, [isTableFixed]);

    useEffect(() => {
        if (initialTable && !selectedTableId) {
            setSelectedTableId(initialTable);
        }
    }, [initialTable, selectedTableId]);

    useEffect(() => {
        if (!customerName && user?.full_name) {
            setCustomerName(user.full_name);
        } else if (!customerName && user?.user_name) {
            setCustomerName(user.user_name);
        }

        if (!customerContact && user?.phone) {
            setCustomerContact(user.phone);
        }
    }, [customerContact, customerName, user]);

    const categories = useMemo(() => {
        if (!menuData?.categories) return [];
        return menuData.categories.map((cat) => ({
            id: cat.name, // or _id if they had one, but public category doesn't expose _id. Using name.
            name: cat.name,
            imageUrl: cat.image_url,
            description: cat.description,
            itemCount: cat.items?.length ?? 0,
        }));
    }, [menuData]);

    const menuItems = useMemo(() => {
        if (!menuData?.categories) return [];
        const allItems: OrderingMenuItem[] = [];
        menuData.categories.forEach((cat) => {
            cat.items.forEach((item) => {
                allItems.push({
                    _id: item._id,
                    name: item.name,
                    description: item.description || '',
                    price: item.base_price,
                    category: cat.name,
                    status: 'available', // public items are always available
                    stock_quantity: 99,
                    image: item.images?.[0]?.url || '/assets/images/placeholder.png',
                });
            });
        });
        return allItems;
    }, [menuData]);

    const tableOptions = useMemo(() => {
        if (isTableFixed && tableData) {
            return [{
                value: tableData.table_id,
                label: `${tableData.table_number}${tableData.name ? ` - ${tableData.name}` : ''} (${tableData.capacity})`,
            }];
        }
        return (availableTablesData?.data ?? [])
            .map((table) => ({
                value: table._id || table.id || '',
                label: `${table.table_number}${table.name ? ` - ${table.name}` : ''} (${table.capacity})`,
            }))
            .filter((option) => option.value);
    }, [availableTablesData?.data, isTableFixed, tableData]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'F4') {
                event.preventDefault();
                if (cartItems.length > 0) {
                    setShowClearCartDialog(true);
                }
            }

            if (event.key === 'Escape') {
                setShowMobileCart(false);
            }

            if (event.key >= '1' && event.key <= '5' && !event.ctrlKey && !event.altKey) {
                const categoryIndex = Number(event.key) - 1;
                if (categories[categoryIndex]) {
                    setActiveCategory(categories[categoryIndex].id);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cartItems.length, categories]);

    const displayedItems = useMemo(() => {
        if (debouncedQuery && searchData?.data) {
            return searchData.data.map((item) => ({
                _id: item._id,
                name: item.name,
                description: item.description || '',
                price: item.base_price,
                category: item.category.name,
                status: 'available',
                stock_quantity: 99,
                image: item.images?.[0]?.url || '/assets/images/placeholder.png',
            } as OrderingMenuItem));
        }

        let filtered = menuItems;
        if (activeCategory !== 'all') {
            filtered = filtered.filter((item) => item.category === activeCategory);
        }

        // Apply local search immediately while debounced query is fetching
        if (searchQuery && !debouncedQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(lowerQuery)
            );
        }

        return filtered;
    }, [menuItems, activeCategory, searchQuery, debouncedQuery, searchData]);

    const handleAddToCart = (item: OrderingMenuItem) => {
        if (item.stock_quantity === 0 || item.status === 'unavailable') {
            toast.error(`${item.name} hiện đã hết hàng`);
            return;
        }

        const existingItem = cartItems.find((cartItem) => cartItem._id === item._id);
        if (existingItem) {
            toast.success(`${item.name} x${existingItem.quantity + 1}`);
        } else {
            toast.success(`Đã thêm ${item.name} vào giỏ`);
        }

        setCartItems((prevItems) => {
            if (existingItem) {
                return prevItems.map((cartItem) =>
                    cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
                );
            }

            return [...prevItems, { ...item, quantity: 1, note: '' }];
        });
    };

    const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
            return;
        }

        setCartItems((prevItems) => prevItems.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)));
    };

    const handleRemoveItem = (itemId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    };

    const handleUpdateNote = (itemId: string, note: string) => {
        setCartItems((prevItems) => prevItems.map((item) => (item._id === itemId ? { ...item, note } : item)));
    };

    const handleClearCart = () => {
        setCartItems([]);
        toast.success('Đã xóa toàn bộ món trong giỏ hàng');
    };

    const handleCreateOrder = async () => {
        if (!isOperational) {
            toast.error('Không thể đặt hàng khi nhà hàng đã đóng cửa.');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Vui lòng thêm món vào giỏ hàng để tạo đơn.');
            return;
        }

        if (!selectedOrderType) {
            toast.error('Vui lòng chọn loại đơn hàng trước khi tạo đơn.');
            return;
        }

        if (selectedOrderType === 'dine_in' && !selectedTableId) {
            toast.error('Vui lòng chọn bàn trước khi tạo đơn.');
            return;
        }

        if (!restaurantId) {
            toast.error('Không thể xác định nhà hàng để tạo đơn.');
            return;
        }

        const orderType: CreatePublicOrderPayload['order_type'] = selectedOrderType;
        const tableId = orderType === 'dine_in' ? selectedTableId ?? undefined : undefined;
        const resolvedCustomerName = customerName.trim();
        const resolvedCustomerContact = customerContact.trim();
        const resolvedNotes = orderNotes.trim();
        const source = isTableFixed ? 'qr' : 'app';

        const payload: CreatePublicOrderPayload = {
            restaurant_id: restaurantId,
            order_type: orderType,
            table_id: tableId,
            source,
            customer_name: resolvedCustomerName || user?.full_name || user?.user_name || null,
            customer_phone: resolvedCustomerContact || user?.phone || null,
            notes: resolvedNotes || null,
            items: cartItems.map((item) => ({
                menu_item_id: item._id,
                quantity: item.quantity,
                notes: item.note ?? null,
            })),
        };

        try {
            setIsCreatingOrder(true);
            const response = await createPublicOrder(payload);

            toast.success(response.message || 'Tạo đơn hàng thành công');
            setCartItems([]);
            setShowMobileCart(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tạo đơn hàng.');
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const totalItems = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

    if (tableError || menuError) {
        return <RejectToPreviousPage />;
    }

    return (
        <PublicOrderingLayout
            header={
                <Header
                    isOperational={isOperational}
                    notifications={[]}
                    user={user}
                    restaurantName={menuData?.restaurant?.name || 'Nhà hàng'}
                    restaurantLogo={menuData?.restaurant?.logo_url || null}
                />
            }
            menuPanel={
                <div
                    className={[
                        'flex-1 bg-surface border-r border-border overflow-hidden flex-col',
                        'pl-4 sm:pl-6 lg:pl-8 xl:pl-12', // Added left padding
                        showMobileCart ? 'hidden lg:flex' : 'flex',
                    ].join(' ')}
                >
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

                        <h2 className="text-lg font-semibold text-foreground mb-3">Danh mục</h2>
                        <MenuCategory
                            categories={[{ id: 'all', name: 'Tất cả', itemCount: menuItems.length }, ...categories]}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <MenuGrid menuItems={displayedItems} onAddToCart={handleAddToCart} />
                    </div>
                </div>
            }
            cartPanel={
                <div
                    className={`
            w-full lg:w-96 bg-surface border-l border-border
            ${showMobileCart ? 'flex' : 'hidden lg:flex'}
            flex-col overflow-hidden
          `}
                >
                    <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
                        <h2 className="text-lg font-semibold text-foreground">Đơn hàng</h2>
                        <Button variant="ghost" size="icon" onClick={() => setShowMobileCart(false)} className="lg:hidden">
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
                            orderType={selectedOrderType}
                            onOrderTypeChange={setSelectedOrderType}
                            selectedTableId={selectedTableId}
                            onTableChange={setSelectedTableId}
                            tableOptions={tableOptions}
                            user={user}
                            customerName={customerName}
                            onCustomerNameChange={setCustomerName}
                            customerContact={customerContact}
                            onCustomerContactChange={setCustomerContact}
                            orderNotes={orderNotes}
                            onOrderNotesChange={setOrderNotes}
                            sourceLabel={isTableFixed ? 'qr' : 'app'}
                            isTableFixed={isTableFixed}
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
                                onClick={handleCreateOrder}
                                disabled={isCreatingOrder || !isOperational}
                                className={`hover-scale touch-target ${isCreatingOrder ? 'animate-pulse' : ''}`}
                            >
                                {isCreatingOrder ? 'Đang tạo đơn...' : 'Tạo đơn hàng'}
                            </Button>
                        </div>
                    )}
                </div>
            }
            mobileCartButton={
                <div className="lg:hidden fixed bottom-4 right-4 z-1000">
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
            }
            clearDialog={
                <ConfirmationDialog
                    isOpen={showClearCartDialog}
                    onClose={() => setShowClearCartDialog(false)}
                    onConfirm={() => {
                        handleClearCart();
                        setShowClearCartDialog(false);
                    }}
                    title="Xóa giỏ hàng"
                    message="Bạn có chắc chắn muốn xóa tất cả món trong giỏ hàng?"
                    confirmText="Xóa tất cả"
                    cancelText="Hủy"
                    variant="danger"
                    icon="Trash2"
                />
            }
        />
    );
};

export default PublicOrderingScreen;
