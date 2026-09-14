import { Eye, EyeOff, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import type { CredentialsStepProps } from "./types"

export function CredentialsStep({
  hook,
  showPassword,
  onTogglePassword,
}: CredentialsStepProps) {
  const {
    form,
    isLoading,
    errorMessage,
    rememberMe,
    setRememberMe,
    handleIdentifierChange,
    handlePasswordChange,
    handleForgotPassword,
    handleSubmit,
  } = hook

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Đăng nhập tài khoản
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Nhập thông tin bên dưới để tiếp tục
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signin-identifier">Email hoặc số điện thoại</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signin-identifier"
            name="identifier"
            type="text"
            value={form.email || form.phoneNumber}
            onChange={(event) => handleIdentifierChange(event.target.value)}
            className="pr-16 pl-10"
            placeholder="Email hoặc số điện thoại"
            autoComplete="username"
            spellCheck={false}
          />
          {(form.email || form.phoneNumber) && (
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {form.email ? "Email" : "Điện thoại"}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signin-password">Mật khẩu</Label>
        <InputGroup>
          <InputGroupInput
            id="signin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(event) => handlePasswordChange(event.target.value)}
            placeholder="Mật khẩu"
            autoComplete="current-password"
          />
          <InputGroupAddon align="inline-end" className="pr-0">
            <InputGroupButton
              type="button"
              size="icon-sm"
              onClick={onTogglePassword}
              className="text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label
            htmlFor="remember-me"
            className="cursor-pointer font-normal text-muted-foreground"
          >
            Lưu mật khẩu
          </Label>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleForgotPassword}
          className="px-2 text-muted-foreground hover:text-foreground"
        >
          Quên mật khẩu?
        </Button>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Đang đăng nhập…" : "Đăng nhập"}
      </Button>

      {errorMessage && (
        <p
          className="text-sm text-destructive"
          role="status"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </form>
  )
}
