import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RefreshCw } from "lucide-react"

export function ForecastingHeaderControls() {
  return (
    <div className="flex min-w-0 flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-foreground text-balance">
          Dự báo bán hàng
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Dự đoán dựa trên AI từ dữ liệu lịch sử và phân tích quy trình
        </p>
      </div>
      <div className="relative z-20 flex w-full flex-col items-stretch gap-3 min-[390px]:flex-row sm:w-auto sm:shrink-0">
        <Select defaultValue="quarterly">
          <SelectTrigger aria-label="Khoảng thời gian dự báo" className="w-full min-[390px]:w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Theo tháng</SelectItem>
            <SelectItem value="quarterly">Theo quý</SelectItem>
            <SelectItem value="annual">Theo năm</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="w-full min-[390px]:w-auto" disabled title="Làm mới dự báo chưa khả dụng">
          <RefreshCw aria-hidden="true" className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>
    </div>
  )
}
