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
  profileEmail,
  dispatchSecurity,
  onChangePassword,
}: {
  state: SecurityState
  profileEmail: string
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
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            onChangePassword()
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
                name="currentPassword"
                type="password"
                autoComplete="current-password"
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
                name="newPassword"
                type="password"
                autoComplete="new-password"
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
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
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
            <p role="alert" className="text-sm text-destructive">
              {state.passwordError}
            </p>
          )}
          {state.passwordSuccess && (
            <p role="status" aria-live="polite" className="text-sm text-success">
              Đã cập nhật mật khẩu
            </p>
          )}
          <Button
            type="submit"
            variant="outline"
            disabled={
              state.isChangingPassword ||
              !state.currentPassword ||
              !state.newPassword ||
              !state.confirmNewPassword
            }
          >
            {state.isChangingPassword ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật mật khẩu"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
