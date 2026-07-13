import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Download, Trash2 } from "lucide-react"
import type { SecurityDispatch } from "../../security-section.state"

export function DangerZoneCard({
  deleteConfirm,
  dispatchSecurity,
}: {
  deleteConfirm: string
  dispatchSecurity: SecurityDispatch
}) {
  return (
    <Card className="border-border border-destructive/30 bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <CardTitle className="text-base font-medium text-destructive">
            Vùng nguy hiểm
          </CardTitle>
        </div>
        <CardDescription>
          Các thao tác không thể hoàn tác ảnh hưởng đến tài khoản của bạn
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col items-stretch justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <Download className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Xuất dữ liệu của tôi
              </p>
              <p className="text-xs text-muted-foreground">
                Tải toàn bộ dữ liệu của bạn dưới dạng tệp ZIP
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="self-end sm:self-auto" disabled title="Xuất dữ liệu chưa khả dụng">
            Xuất
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
              <Trash2 className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Xóa tài khoản
              </p>
              <p className="text-xs text-muted-foreground">
                Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu liên quan. Không thể
                hoàn tác.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="deleteConfirm"
              className="text-xs text-muted-foreground"
            >
              Nhập <span className="font-mono text-foreground">DELETE</span> để
              xác nhận
            </Label>
            <InputGroup>
              <InputGroupInput
                id="deleteConfirm"
                disabled
                value={deleteConfirm}
                onChange={(event) =>
                  dispatchSecurity({
                    type: "setDeleteConfirm",
                    value: event.target.value,
                  })
                }
                placeholder="Nhập DELETE để xác nhận"
                className="font-mono"
              />
            </InputGroup>
            <Button
              variant="destructive"
              size="sm"
              disabled
              title="Xóa tài khoản chưa khả dụng"
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa vĩnh viễn tài khoản
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
