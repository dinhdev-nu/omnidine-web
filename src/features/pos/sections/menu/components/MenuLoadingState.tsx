import { Spinner } from "../../../ui/Spinner"

export function MenuLoadingState() {
  return (
    <div
      className="flex min-h-48 items-center justify-center gap-3 p-4 text-muted-foreground sm:p-6"
      role="status"
      aria-live="polite"
    >
      <h1 className="sr-only">Quản lý thực đơn</h1>
      <Spinner className="size-5" />
      <span className="text-sm">Đang tải danh sách món ăn...</span>
    </div>
  )
}
