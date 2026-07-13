import Button from "../../../ui/Button"
import type { MenuSectionViewProps } from "./menu-section-content.types"

export function MenuPagination({ controller }: MenuSectionViewProps) {
  const { page, setPage, pagination } = controller
  const totalPages = Math.max(pagination.total_pages || 1, 1)

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:justify-end"
      aria-label="Phân trang thực đơn"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => setPage((currentPage) => currentPage - 1)}
        aria-label="Đến trang trước"
      >
        Trước
      </Button>
      <span className="min-w-20 text-center text-sm text-muted-foreground">
        Trang <span aria-current="page">{pagination.page}</span>/{totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page >= totalPages}
        onClick={() => setPage((currentPage) => currentPage + 1)}
        aria-label="Đến trang sau"
      >
        Sau
      </Button>
    </nav>
  )
}
