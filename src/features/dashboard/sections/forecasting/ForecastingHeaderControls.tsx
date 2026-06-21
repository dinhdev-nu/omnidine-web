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
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Dự báo bán hàng
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Dự đoán dựa trên AI từ dữ liệu lịch sử và phân tích quy trình
        </p>
      </div>
      <div className="relative z-20 flex items-center gap-3">
        <Select defaultValue="quarterly">
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Theo tháng</SelectItem>
            <SelectItem value="quarterly">Theo quý</SelectItem>
            <SelectItem value="annual">Theo năm</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>
    </div>
  )
}
