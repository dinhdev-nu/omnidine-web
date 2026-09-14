import { useNavigate, useParams } from "react-router-dom"

import Image from "@/components/AppImage"
import Icon from "@/components/AppIcon"
import { POS_BASE_PATH } from "@/routes/pos-route-config"

import Button from "../../../ui/Button"

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

interface MenuItem {
  _id: string
  name: string
  price: number
  image?: string
  description?: string
  stock_quantity?: number
  status?: "available" | "unavailable"
}

interface MenuGridProps {
  menuItems: MenuItem[]
  onAddToCart: (item: MenuItem) => void
  isLoading: boolean
  error: unknown | null
}

const formatPrice = (price: number): string => currencyFormatter.format(price)

const getStockStatusColor = (stock: number): string => {
  if (stock === 0) return "bg-error text-error-foreground"
  if (stock <= 5) return "bg-warning text-warning-foreground"
  return "bg-success text-success-foreground"
}

const getStockStatusText = (stock: number): string => {
  if (stock === 0) return "Hết hàng"
  if (stock <= 5) return "Sắp hết"
  return "Còn hàng"
}

function MenuLoadingState() {
  return (
    <output
      aria-live="polite"
      className="grid min-h-64 place-items-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground"
    >
      Đang tải thực đơn…
    </output>
  )
}

function MenuErrorState() {
  return (
    <div
      role="alert"
      className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
    >
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-foreground">
          Không thể tải thực đơn
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Kiểm tra kết nối rồi thử tải lại.
        </p>
      </div>
      <Button
        variant="outline"
        iconName="RefreshCw"
        iconPosition="left"
        onClick={() => window.location.reload()}
      >
        Tải lại
      </Button>
    </div>
  )
}

function EmptyMenuState({ onNavigateToMenu }: { onNavigateToMenu: () => void }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-muted/30 sm:size-32">
        <Icon
          name="UtensilsCrossed"
          size={56}
          aria-hidden="true"
          className="text-muted-foreground/50"
        />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        Không có món nào
      </h2>
      <p className="mb-6 max-w-md text-sm text-muted-foreground text-pretty">
        Danh mục này hiện chưa có món ăn. Chọn danh mục khác hoặc thêm món mới.
      </p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button
          variant="outline"
          iconName="Plus"
          iconPosition="left"
          onClick={onNavigateToMenu}
        >
          Thêm món mới
        </Button>
        <Button
          variant="default"
          iconName="RefreshCw"
          iconPosition="left"
          onClick={() => window.location.reload()}
        >
          Tải lại
        </Button>
      </div>
    </div>
  )
}

const MenuGrid = ({
  menuItems,
  onAddToCart,
  isLoading,
  error,
}: MenuGridProps) => {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()

  const handleNavigateToMenu = () => {
    const normalizedSlug = slug?.trim()
    if (!normalizedSlug) {
      navigate(POS_BASE_PATH)
      return
    }

    navigate(`${POS_BASE_PATH}/${normalizedSlug}/menu`)
  }

  if (isLoading) return <MenuLoadingState />
  if (error) return <MenuErrorState />
  if (menuItems.length === 0) {
    return <EmptyMenuState onNavigateToMenu={handleNavigateToMenu} />
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,11.25rem),1fr))] gap-3 sm:gap-4">
      {menuItems.map((item) => {
        const stock = item.stock_quantity ?? 0
        const isUnavailable = stock === 0 || item.status === "unavailable"

        return (
          <article
            key={item._id}
            className={`min-w-0 overflow-hidden rounded-lg border border-border bg-card transition-[opacity,transform,box-shadow] duration-150 motion-reduce:transition-none ${
              isUnavailable ? "opacity-60" : "hover-scale"
            }`}
          >
            <div className="relative">
              <div className="h-32 overflow-hidden bg-muted sm:h-36">
                <Image
                  src={item.image ?? "/assets/images/placeholder.png"}
                  alt={item.name}
                  width={360}
                  height={144}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
              <span
                className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium ${getStockStatusColor(stock)}`}
              >
                {getStockStatusText(stock)}
              </span>
            </div>

            <div className="flex min-w-0 flex-col gap-2 p-3">
              <div className="min-w-0">
                <h2 className="line-clamp-2 text-sm font-medium text-card-foreground">
                  {item.name}
                </h2>
                {item.description ? (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
              <div className="mt-auto flex min-w-0 items-center justify-between gap-2">
                <span className="min-w-0 truncate font-semibold text-primary tabular-nums">
                  {formatPrice(item.price)}
                </span>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  aria-label={`Thêm ${item.name} vào giỏ hàng`}
                  onClick={() => onAddToCart(item)}
                  disabled={isUnavailable}
                  className="shrink-0 hover-scale"
                >
                  Thêm
                </Button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default MenuGrid
