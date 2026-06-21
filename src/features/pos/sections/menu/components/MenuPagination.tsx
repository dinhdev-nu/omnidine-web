import Button from "../../../ui/Button"
import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuPagination({ controller }: MenuSectionViewProps) {
  const { page, setPage, pagination } = controller
  return (
    <div className="mt-6 flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => setPage((p) => p - 1)}
      >
        TrÆ°á»›c
      </Button>
      <span className="text-sm text-muted-foreground">
        Trang {pagination.page}/{Math.max(pagination.total_pages || 1, 1)}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page >= Math.max(pagination.total_pages || 1, 1)}
        onClick={() => setPage((p) => p + 1)}
      >
        Sau
      </Button>
    </div>
  )
}
