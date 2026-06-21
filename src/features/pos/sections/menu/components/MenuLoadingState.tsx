import { Spinner } from "../../../ui/Spinner"

export function MenuLoadingState() {
  return (
    <div className="flex items-center justify-center gap-3 p-6 text-muted-foreground">
      <Spinner className="size-5" />
      <span className="text-sm">Đang tải danh sách món ăn...</span>
    </div>
  )
}
