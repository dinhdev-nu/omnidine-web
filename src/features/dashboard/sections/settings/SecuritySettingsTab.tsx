import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { SecuritySettingsTabProps } from "./settings-section.types"

export function SecuritySettingsTab({
  confirmText,
  deleteRestaurantConfirmText,
  isDeleteRestaurantEnabled,
  onConfirmTextChange,
  onDeleteRestaurant,
}: SecuritySettingsTabProps) {
  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-medium text-destructive">
            Xóa nhà hàng
          </CardTitle>
          <CardDescription>
            Hành động này sẽ xóa vĩnh viễn dữ liệu nhà hàng và không thể hoàn
            tác
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-muted-foreground">
              Khi xóa nhà hàng, toàn bộ thông tin hồ sơ, menu, đơn hàng và dữ
              liệu liên quan sẽ bị gỡ bỏ khỏi hệ thống.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Nhập <span className="text-destructive">{confirmText}</span> để
              xác nhận xóa.
            </p>
            <Input
              value={deleteRestaurantConfirmText}
              onChange={(event) => onConfirmTextChange(event.target.value)}
              placeholder={confirmText}
              className="max-w-md border-border bg-background focus-visible:ring-destructive/20"
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={onDeleteRestaurant}
              disabled={!isDeleteRestaurantEnabled}
            >
              Xóa nhà hàng
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
