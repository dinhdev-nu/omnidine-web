import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Key, Lock, RefreshCw } from "lucide-react"
import type { SecurityDispatch, SecurityState } from "../../security-section.state"

export function TwoFactorCard({
  state,
  twoFactorEnabled,
  dispatchSecurity,
  onToggle2fa,
}: {
  state: SecurityState
  twoFactorEnabled: boolean
  dispatchSecurity: SecurityDispatch
  onToggle2fa: () => void
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Xác thực hai lớp
        </CardTitle>
        <CardDescription>
          Thêm một lớp bảo mật cho tài khoản của bạn
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${twoFactorEnabled ? "bg-success/20" : "bg-muted"}`}
            >
              <Key
                className={`h-5 w-5 ${twoFactorEnabled ? "text-success" : "text-muted-foreground"}`}
              />
            </div>
            <div>
              <p className="font-medium text-foreground">Ứng dụng xác thực</p>
              <p className="text-sm text-muted-foreground">
                Dùng ứng dụng xác thực để nhận mã 2FA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              className={
                twoFactorEnabled
                  ? "border-success/30 bg-success/20 text-success"
                  : "border-border bg-muted text-muted-foreground"
              }
            >
              {twoFactorEnabled ? "Đã bật" : "Đã tắt"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatchSecurity({ type: "toggle2faForm" })}
            >
              {state.show2faForm ? "Hủy" : "Quản lý"}
            </Button>
          </div>
        </div>

        {state.show2faForm && (
          <div className="animate-in space-y-3 rounded-lg border border-border bg-secondary/20 px-4 py-3 duration-200 fade-in slide-in-from-top-1">
            <p className="text-sm text-muted-foreground">
              {twoFactorEnabled
                ? "Nhập mật khẩu để tắt 2FA."
                : "Nhập mật khẩu để bật 2FA."}
            </p>
            <div className="flex items-center gap-2">
              <InputGroup className="max-w-xs">
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <Lock className="h-4 w-4" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  value={state.twoFaPassword}
                  onChange={(event) =>
                    dispatchSecurity({
                      type: "setTwoFaPassword",
                      value: event.target.value,
                    })
                  }
                  onKeyDown={(event) => event.key === "Enter" && onToggle2fa()}
                />
              </InputGroup>
              <Button
                size="sm"
                variant={twoFactorEnabled ? "destructive" : "default"}
                onClick={onToggle2fa}
                disabled={state.isTwoFaLoading || !state.twoFaPassword.trim()}
              >
                {state.isTwoFaLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : twoFactorEnabled ? (
                  "Tắt 2FA"
                ) : (
                  "Bật 2FA"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
