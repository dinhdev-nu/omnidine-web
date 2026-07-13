import Button from "../../../ui/Button"
import MenuStats from "./MenuStats"
import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuPageHeader({ controller }: MenuSectionViewProps) {
  const { isTableView, dispatchMenuUi, openAddItem, menuStats } = controller
  return (
    <div className="mb-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-pretty text-foreground">
            Quản lý thực đơn
          </h1>
          <p className="mt-1 text-sm text-pretty text-muted-foreground sm:text-base">
            Quản lý món ăn, giá cả và tình trạng kho hàng
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-3 min-[430px]:flex-row sm:shrink-0">
          {/* View mode toggle */}
          <div
            className="flex min-w-0 items-center rounded-lg bg-muted p-1"
            role="group"
            aria-label="Kiểu hiển thị thực đơn"
          >
            <Button
              variant={isTableView ? "default" : "ghost"}
              size="sm"
              onClick={() =>
                dispatchMenuUi({ type: "setViewMode", viewMode: "table" })
              }
              iconName="Table"
              className="min-w-0 flex-1 px-3 min-[430px]:flex-none"
              aria-pressed={isTableView}
            >
              Bảng
            </Button>
            <Button
              variant={isTableView ? "ghost" : "default"}
              size="sm"
              onClick={() =>
                dispatchMenuUi({ type: "setViewMode", viewMode: "grid" })
              }
              iconName="Grid3X3"
              className="min-w-0 flex-1 px-3 min-[430px]:flex-none"
              aria-pressed={!isTableView}
            >
              Lưới
            </Button>
          </div>

          <Button
            variant="default"
            onClick={openAddItem}
            iconName="Plus"
            iconPosition="left"
            className="w-full min-[430px]:w-auto"
          >
            Thêm món mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      <MenuStats stats={menuStats} />
    </div>
  )
}
