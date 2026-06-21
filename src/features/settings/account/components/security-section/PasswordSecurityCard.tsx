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

export function PasswordSecurityCard({
  state,
  dispatchSecurity,
  onChangePassword,
}: {
  state: SecurityState
  dispatchSecurity: SecurityDispatch
  onChangePassword: () => void
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Mật khẩu & Xác thực
        </CardTitle>
        <CardDescription>
          Quản lý cài đặt bảo mật tài khoản của bạn
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
            <InputGroup className="max-w-md">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Lock className="h-4 w-4" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="currentPassword"
                type="password"
                value={state.currentPassword}
                onChange={(event) =>
                  dispatchSecurity({
                    type: "setPasswordField",
                    field: "currentPassword",
                    value: event.target.value,
                  })
                }
              />
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <InputGroup className="max-w-md">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Key className="h-4 w-4" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="newPassword"
                type="password"
                value={state.newPassword}
                onChange={(event) =>
                  dispatchSecurity({
                    type: "setPasswordField",
                    field: "newPassword",
                    value: event.target.value,
                  })
                }
              />
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <InputGroup className="max-w-md">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Key className="h-4 w-4" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="confirmPassword"
                type="password"
                value={state.confirmNewPassword}
                onChange={(event) =>
                  dispatchSecurity({
                    type: "setPasswordField",
                    field: "confirmNewPassword",
                    value: event.target.value,
                  })
                }
              />
            </InputGroup>
          </div>

          {state.passwordError && (
            <p className="text-sm text-destructive">{state.passwordError}</p>
          )}
          {state.passwordSuccess && (
            <p className="text-sm text-success">Đã cập nhật mật khẩu</p>
          )}
          <Button
            variant="outline"
            onClick={onChangePassword}
            disabled={
              state.isChangingPassword ||
              !state.currentPassword ||
              !state.newPassword ||
              !state.confirmNewPassword
            }
          >
            {state.isChangingPassword ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật mật khẩu"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
