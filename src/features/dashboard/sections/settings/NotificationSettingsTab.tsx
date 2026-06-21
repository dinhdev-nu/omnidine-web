import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { NotificationSettingsTabProps } from "./settings-section.types"

export function NotificationSettingsTab({
  restaurantId,
  publishEnabled,
  onlineOrdersEnabled,
  isPublishing,
  isTogglingOnlineOrders,
  onPublishChange,
  onOnlineOrdersChange,
}: NotificationSettingsTabProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Trạng thái hoạt động
        </CardTitle>
        <CardDescription>
          Điều khiển trạng thái xuất bản và nhận đơn online của nhà hàng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary/20 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">Xuất bản nhà hàng</p>
                <Badge
                  className={
                    publishEnabled
                      ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-600"
                      : "border-border bg-muted text-muted-foreground"
                  }
                >
                  {publishEnabled ? "Đang hiển thị" : "Đang ẩn"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Bật để nhà hàng xuất hiện trên các trang công khai.
              </p>
            </div>
            <Switch
              checked={publishEnabled}
              onCheckedChange={onPublishChange}
              disabled={!restaurantId || isPublishing}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary/20 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">Nhận đơn online</p>
                <Badge
                  className={
                    onlineOrdersEnabled
                      ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-600"
                      : "border-border bg-muted text-muted-foreground"
                  }
                >
                  {onlineOrdersEnabled ? "Đang bật" : "Đang tắt"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Cho phép khách đặt món trực tuyến cho nhà hàng này.
              </p>
            </div>
            <Switch
              checked={onlineOrdersEnabled}
              onCheckedChange={onOnlineOrdersChange}
              disabled={!restaurantId || isTogglingOnlineOrders}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
