import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import Button from '../../../components/Button';
import Image from '@/components/AppImage';
import { Spinner } from '@/components/ui/spinner';
import { getMenuItemDetail, toMenuEndpointError } from '@/services/menu';
import type { MenuItem } from '@/types/menu-type';

interface MenuItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  itemId: string | null;
  categoryName?: string;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const MenuItemDetailsModal: React.FC<MenuItemDetailsModalProps> = ({
  isOpen,
  onClose,
  restaurantId,
  itemId,
  categoryName,
}) => {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !itemId || !restaurantId) {
      setItem(null);
      setError(null);
      return;
    }

    const fetchItemDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMenuItemDetail(restaurantId, itemId);
        setItem(data);
      } catch (err) {
        setError(toMenuEndpointError('fetch details', err).message);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchItemDetails();
  }, [isOpen, itemId, restaurantId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Icon name="Info" size={20} color="white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Chi tiết món ăn
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover-scale">
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Spinner className="size-8 text-primary" />
              <p className="text-sm text-muted-foreground">Đang tải chi tiết món ăn...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
              <div className="size-12 rounded-full bg-error/10 flex items-center justify-center text-error">
                <Icon name="AlertCircle" size={24} />
              </div>
              <div>
                <p className="font-medium text-foreground">Không thể tải thông tin món ăn</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button variant="outline" onClick={onClose}>Đóng</Button>
            </div>
          ) : item ? (
            <div className="space-y-6">
              {/* Header Info with Image */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 aspect-square rounded-lg border border-border bg-muted overflow-hidden flex-shrink-0">
                  {item.images && item.images.length > 0 ? (
                    <Image 
                      src={item.images[0].url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Icon name="Image" size={48} className="mb-2 opacity-50" />
                      <span className="text-xs">Chưa có ảnh</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{item.name}</h3>
                    {categoryName && (
                      <p className="text-sm text-muted-foreground mt-1">{categoryName}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xl font-semibold text-primary">
                      {formatPrice(item.base_price)}
                    </span>
                    <div className="flex gap-2">
                      {item.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium border border-warning/20">
                          <Icon name="Star" size={12} />
                          Nổi bật
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                        item.is_available 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-muted text-muted-foreground border-border'
                      }`}>
                        <Icon name={item.is_available ? 'CheckCircle' : 'XCircle'} size={12} />
                        {item.is_available ? 'Đang bán' : 'Tạm ngưng'}
                      </span>
                    </div>
                  </div>

                  {item.description && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="text-sm font-medium text-foreground mb-2">Mô tả:</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery */}
              {item.images && item.images.length > 1 && (
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">Hình ảnh khác:</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {item.images.slice(1).map((img, index) => (
                      <div key={index} className="aspect-square rounded-md border border-border bg-muted overflow-hidden">
                        <Image 
                          src={img.url} 
                          alt={`${item.name} - ${index + 2}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t border-border bg-muted/30 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">Ngày tạo:</span>
                    <span className="font-medium text-foreground">
                      {new Date(item.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Cập nhật lần cuối:</span>
                    <span className="font-medium text-foreground">
                      {new Date(item.updated_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border flex-shrink-0 bg-muted/10">
          <Button variant="default" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetailsModal;
