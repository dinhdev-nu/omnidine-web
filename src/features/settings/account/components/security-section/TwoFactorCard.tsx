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
import { Label } from "@/components/ui/label"
import { Key, Lock, RefreshCw } from "lucide-react"
import type { SecurityDispatch, SecurityState } from "../../security-section.state"

export function TwoFactorCard({
  state,
  profileEmail,
  twoFactorEnabled,
  dispatchSecurity,
  onToggle2fa,
}: {
  state: SecurityState
  profileEmail: string
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
        <div className="flex flex-col items-stretch justify-between gap-4 rounded-lg border border-border bg-secondary/50 p-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
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

          <div className="flex items-center justify-end gap-3">
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
          <form
            className="animate-in space-y-3 rounded-lg border border-border bg-secondary/20 px-4 py-3 duration-200 motion-reduce:animate-none fade-in slide-in-from-top-1"
            onSubmit={(event) => {
              event.preventDefault()
              onToggle2fa()
            }}
          >
            <input
              type="email"
              name="username"
              value={profileEmail}
              autoComplete="username"
              readOnly
              tabIndex={-1}
              aria-hidden="true"
              className="sr-only"
            />
            <p className="text-sm text-muted-foreground">
              {twoFactorEnabled
                ? "Nhập mật khẩu để tắt 2FA."
                : "Nhập mật khẩu để bật 2FA."}
            </p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <Label htmlFor="two-fa-password" className="sr-only">
                Mật khẩu hiện tại để quản lý 2FA
              </Label>
              <InputGroup className="max-w-xs flex-1">
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <Lock className="h-4 w-4" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="two-fa-password"
                  name="password"
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  value={state.twoFaPassword}
                  onChange={(event) =>
                    dispatchSecurity({
                      type: "setTwoFaPassword",
                      value: event.target.value,
                    })
                  }
                  autoComplete="current-password"
                />
              </InputGroup>
              <Button
                type="submit"
                size="sm"
                variant={twoFactorEnabled ? "destructive" : "default"}
                disabled={state.isTwoFaLoading || !state.twoFaPassword.trim()}
              >
                {state.isTwoFaLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                ) : twoFactorEnabled ? (
                  "Tắt 2FA"
                ) : (
                  "Bật 2FA"
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
