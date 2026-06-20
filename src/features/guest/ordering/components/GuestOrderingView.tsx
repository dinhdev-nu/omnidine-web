import Icon from "@/components/AppIcon"
import ConfirmationDialog from "@/components/ui/ConfirmationDialog"
import { GuestOrderingLayout } from "@/layouts/guest/GuestOrderingLayout"
import Button from "@/features/pos/ui/Button"
import Input from "@/features/pos/ui/Input"

import Header from "./Header"
import MenuCategory from "./MenuCategory"
import MenuGrid from "./MenuGrid"
import OrderCart from "./OrderCart"

import type { GuestOrderingController } from "../hooks/useGuestOrderingController"

interface GuestOrderingViewProps {
  controller: GuestOrderingController
}

function GuestOrderingHeader({ controller }: GuestOrderingViewProps) {
  const { isOperational, user, menuData, resolvedSlug } = controller
  return (
    <Header
      isOperational={isOperational}
      notifications={[]}
      user={user}
      restaurantName={menuData?.restaurant?.name || "Nhà hàng"}
      restaurantLogo={menuData?.restaurant?.logo_url || null}
      restaurantSlug={resolvedSlug}
    />
  )
}

function GuestOrderingMenuPanel({ controller }: GuestOrderingViewProps) {
  const {
    showMobileCart,
    searchQuery,
    dispatchOrdering,
    menuItems,
    categories,
    activeCategory,
    displayedItems,
    handleAddToCart,
  } = controller
  return (
    <div
      className={[
        "bg-surface flex-1 flex-col overflow-hidden border-r border-border",
        "pl-4 sm:pl-6 lg:pl-8 xl:pl-12", // Added left padding
        showMobileCart ? "hidden lg:flex" : "flex",
      ].join(" ")}
    >
      <div className="border-b border-border p-4">
        <h1 className="mb-4 text-xl font-semibold text-foreground">Thực đơn</h1>

        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Tìm món theo tên..."
            value={searchQuery}
            onChange={(event) =>
              dispatchOrdering({
                type: "setSearchQuery",
                value: event.target.value,
              })
            }
            className="w-full pr-10"
          />
          <Icon
            name="Search"
            size={18}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          />
        </div>

        <h2 className="mb-3 text-lg font-semibold text-foreground">Danh mục</h2>
        <MenuCategory
          categories={[
            { id: "all", name: "Tất cả", itemCount: menuItems.length },
            ...categories,
          ]}
          activeCategory={activeCategory}
          onCategoryChange={(value) =>
            dispatchOrdering({ type: "setActiveCategory", value })
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <MenuGrid menuItems={displayedItems} onAddToCart={handleAddToCart} />
      </div>
    </div>
  )
}

function GuestOrderingCartPanel({ controller }: GuestOrderingViewProps) {
  const {
    showMobileCart,
    dispatchOrdering,
    cartItems,
    handleUpdateQuantity,
    handleRemoveItem,
    handleUpdateNote,
    handleOpenClearCartDialog,
    selectedOrderType,
    handleOrderTypeChange,
    selectedTableId,
    handleTableChange,
    tableOptions,
    user,
    customerName,
    customerContact,
    orderNotes,
    isTableFixed,
    isCreatingOrder,
    isOperational,
    handleCreateOrder,
  } = controller
  return (
    <div
      className={`bg-surface w-full border-l border-border lg:w-96 ${showMobileCart ? "flex" : "hidden lg:flex"} flex-col overflow-hidden`}
    >
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Đơn hàng</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatchOrdering({ type: "closeMobileCart" })}
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
          onClearCart={handleOpenClearCartDialog}
          orderType={selectedOrderType}
          onOrderTypeChange={handleOrderTypeChange}
          selectedTableId={selectedTableId}
          onTableChange={handleTableChange}
          tableOptions={tableOptions}
          user={user}
          customerName={customerName}
          onCustomerNameChange={(value) =>
            dispatchOrdering({ type: "setCustomerNameOverride", value })
          }
          customerContact={customerContact}
          onCustomerContactChange={(value) =>
            dispatchOrdering({
              type: "setCustomerContactOverride",
              value,
            })
          }
          orderNotes={orderNotes}
          onOrderNotesChange={(value) =>
            dispatchOrdering({ type: "setOrderNotes", value })
          }
          sourceLabel={isTableFixed ? "qr" : "app"}
          isTableFixed={isTableFixed}
        />
      </div>

      {cartItems.length > 0 && (
        <div className="bg-surface flex-shrink-0 space-y-2 border-t border-border p-4">
          <Button
            variant="default"
            size="default"
            fullWidth
            iconName={isCreatingOrder ? "Loader2" : "FileText"}
            iconPosition="left"
            onClick={handleCreateOrder}
            disabled={isCreatingOrder || !isOperational}
            className={`hover-scale touch-target ${isCreatingOrder ? "animate-pulse" : ""}`}
          >
            {isCreatingOrder ? "Đang tạo đơn..." : "Tạo đơn hàng"}
          </Button>
        </div>
      )}
    </div>
  )
}

function GuestOrderingMobileCartButton({ controller }: GuestOrderingViewProps) {
  const { dispatchOrdering, totalItems, cartItems } = controller
  return (
    <div className="fixed right-4 bottom-4 z-1000 lg:hidden">
      <Button
        variant="default"
        size="lg"
        onClick={() => dispatchOrdering({ type: "openMobileCart" })}
        className="shadow-modal hover-scale relative rounded-full"
      >
        <Icon name="ShoppingCart" size={24} className="mr-2" />
        <span>Giỏ hàng ({totalItems})</span>
        {cartItems.length > 0 && (
          <span className="bg-error text-error-foreground absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs">
            {totalItems}
          </span>
        )}
      </Button>
    </div>
  )
}

function GuestOrderingClearCartDialog({ controller }: GuestOrderingViewProps) {
  const {
    showClearCartDialog,
    handleCloseClearCartDialog,
    handleConfirmClearCart,
  } = controller
  return (
    <ConfirmationDialog
      isOpen={showClearCartDialog}
      onClose={handleCloseClearCartDialog}
      onConfirm={handleConfirmClearCart}
      title="Xóa giỏ hàng"
      message="Bạn có chắc chắn muốn xóa tất cả món trong giỏ hàng?"
      confirmText="Xóa tất cả"
      cancelText="Hủy"
      variant="danger"
      icon="Trash2"
    />
  )
}

export function GuestOrderingView({ controller }: GuestOrderingViewProps) {
  return (
    <>
      <GuestOrderingLayout
        header={<GuestOrderingHeader controller={controller} />}
        menuPanel={<GuestOrderingMenuPanel controller={controller} />}
        cartPanel={<GuestOrderingCartPanel controller={controller} />}
        mobileCartButton={
          <GuestOrderingMobileCartButton controller={controller} />
        }
      />

      <GuestOrderingClearCartDialog controller={controller} />
    </>
  )
}
