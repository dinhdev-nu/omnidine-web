import React, { useState, useEffect } from "react"
import Icon from "@/components/AppIcon"
import Button from "../../../components/Button"
import Image from "@/components/AppImage"
import { Spinner } from "../../../components/Spinner"
import { getMenuItemDetail, toMenuEndpointError } from "@/services/menu"
import type { MenuItem } from "@/types/menu-type"

interface MenuItemDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  restaurantId: string
  itemId: string | null
  categoryName?: string
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  )

const MenuItemDetailsModal: React.FC<MenuItemDetailsModalProps> = ({
  isOpen,
  onClose,
  restaurantId,
  itemId,
  categoryName,
}) => {
  const [item, setItem] = useState<MenuItem | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !itemId || !restaurantId) {
      setItem(null)
      setError(null)
      return
    }

    const fetchItemDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getMenuItemDetail(restaurantId, itemId)
        setItem(data)
      } catch (err) {
        setError(toMenuEndpointError("fetch details", err).message)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchItemDetails()
  }, [isOpen, itemId, restaurantId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="shadow-modal relative mx-4 flex max-h-[90vh] w-full max-w-2xl animate-in flex-col overflow-hidden rounded-lg border border-border bg-card duration-200 zoom-in-95 fade-in">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Icon name="Info" size={20} color="white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Chi tiết món ăn
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover-scale"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Spinner className="size-8 text-primary" />
              <p className="text-sm text-muted-foreground">
                Đang tải chi tiết món ăn...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
              <div className="bg-error/10 text-error flex size-12 items-center justify-center rounded-full">
                <Icon name="AlertCircle" size={24} />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Không thể tải thông tin món ăn
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              </div>
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </div>
          ) : item ? (
            <div className="space-y-6">
              {/* Header Info with Image */}
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="aspect-square w-full flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted md:w-1/3">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0].url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
                      <Icon
                        name="Image"
                        size={48}
                        className="mb-2 opacity-50"
                      />
                      <span className="text-xs">Chưa có ảnh</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {item.name}
                    </h3>
                    {categoryName && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {categoryName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xl font-semibold text-primary">
                      {formatPrice(item.base_price)}
                    </span>
                    <div className="flex gap-2">
                      {item.is_featured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-warning/20 bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
                          <Icon name="Star" size={12} />
                          Nổi bật
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${
                          item.is_available
                            ? "border-success/20 bg-success/10 text-success"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon
                          name={item.is_available ? "CheckCircle" : "XCircle"}
                          size={12}
                        />
                        {item.is_available ? "Đang bán" : "Tạm ngưng"}
                      </span>
                    </div>
                  </div>

                  {item.description && (
                    <div className="border-t border-border pt-4">
                      <h4 className="mb-2 text-sm font-medium text-foreground">
                        Mô tả:
                      </h4>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery */}
              {item.images && item.images.length > 1 && (
                <div className="border-t border-border pt-4">
                  <h4 className="mb-3 text-sm font-medium text-foreground">
                    Hình ảnh khác:
                  </h4>
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
                    {item.images.slice(1).map((img, index) => (
                      <div
                        key={index}
                        className="aspect-square overflow-hidden rounded-md border border-border bg-muted"
                      >
                        <Image
                          src={img.url}
                          alt={`${item.name} - ${index + 2}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="rounded-lg border-t border-border bg-muted/30 p-4 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="mb-1 block text-muted-foreground">
                      Ngày tạo:
                    </span>
                    <span className="font-medium text-foreground">
                      {new Date(item.created_at).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div>
                    <span className="mb-1 block text-muted-foreground">
                      Cập nhật lần cuối:
                    </span>
                    <span className="font-medium text-foreground">
                      {new Date(item.updated_at).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-border bg-muted/10 p-6">
          <Button variant="default" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MenuItemDetailsModal
