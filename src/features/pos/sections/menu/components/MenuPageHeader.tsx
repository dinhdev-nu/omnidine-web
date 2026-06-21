import Button from "../../../ui/Button"
import MenuStats from "./MenuStats"
import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuPageHeader({ controller }: MenuSectionViewProps) {
  const { isTableView, dispatchMenuUi, openAddItem, menuStats } = controller
  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Quản lý thực đơn
          </h1>
          <p className="text-muted-foreground">
            Quản lý món ăn, giá cả và tình trạng kho hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center rounded-lg bg-muted p-1">
            <Button
              variant={isTableView ? "default" : "ghost"}
              size="sm"
              onClick={() =>
                dispatchMenuUi({ type: "setViewMode", viewMode: "table" })
              }
              iconName="Table"
              className="px-3"
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
              className="px-3"
            >
              Lưới
            </Button>
          </div>

          <Button
            variant="default"
            onClick={openAddItem}
            iconName="Plus"
            iconPosition="left"
            className="hover-scale"
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
