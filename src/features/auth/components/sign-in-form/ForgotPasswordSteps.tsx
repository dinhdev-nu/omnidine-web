import { useState } from "react"
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Mail } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { SignInFormProps } from "./types"

export function ForgotEmailStep({ hook }: SignInFormProps) {
  const {
    isLoading,
    errorMessage,
    forgotEmail,
    setForgotEmail,
    handleForgotSubmitEmail,
    handleBackToSignIn,
  } = hook

  return (
    <form
      className="space-y-5 p-1"
      onSubmit={(event) => {
        event.preventDefault()
        handleForgotSubmitEmail()
      }}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleBackToSignIn}
        className="-ml-2 w-fit text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft />
        Quay lại Đăng nhập
      </Button>

      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Khôi phục mật khẩu
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Nhập Email của bạn để nhận mã OTP
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="forgot-email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="forgot-email"
            name="email"
            type="email"
            value={forgotEmail}
            onChange={(event) => setForgotEmail(event.target.value)}
            onKeyDown={(event) =>
              event.key === "Enter" && handleForgotSubmitEmail()
            }
            className="pl-10"
            placeholder="email@example.com"
            autoComplete="email"
            spellCheck={false}
          />
        </div>
      </div>

      {errorMessage && (
        <p
          className="text-sm text-destructive"
          role="status"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading || !forgotEmail.trim()}
        className="w-full"
      >
        {isLoading ? "Đang gửi…" : "Gửi mã"}
      </Button>
    </form>
  )
}

export function ForgotOtpStep({ hook }: SignInFormProps) {
  const {
    isLoading,
    forgotEmail,
    forgotOtp,
    setForgotOtp,
    forgotCountdown,
    isResendingForgotOtp,
    handleBackToForgotEmail,
    handleForgotResendOtp,
    handleForgotVerifyOtp,
  } = hook
  const resendDisabled = forgotCountdown > 0 || isResendingForgotOtp

  return (
    <form
      className="space-y-5 p-1"
      onSubmit={(event) => {
        event.preventDefault()
        handleForgotVerifyOtp()
      }}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleBackToForgotEmail}
        className="-ml-2 w-fit text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft />
        Quay lại
      </Button>

      <div>
        <h1 className="text-xl font-semibold text-foreground">Nhập mã OTP</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chúng tôi vừa gửi mã gồm 6 số tới{" "}
          <span className="font-medium text-foreground">{forgotEmail}</span>
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP maxLength={6} value={forgotOtp} onChange={setForgotOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => toast.info("Kiểm tra thư rác!")}
          className="-ml-2 min-h-11 touch-manipulation px-2 text-muted-foreground transition-colors motion-reduce:transition-none hover:text-foreground"
        >
          Không nhận được mã?
        </button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleForgotResendOtp}
          disabled={resendDisabled}
          className={cn(
            "px-2 text-sm font-medium",
            resendDisabled
              ? "text-muted-foreground"
              : "text-foreground hover:text-foreground/80"
          )}
        >
          {isResendingForgotOtp
            ? "Đang gửi…"
            : forgotCountdown > 0
              ? `Chờ ${forgotCountdown}s`
              : "Gửi lại"}
        </Button>
      </div>

      <Button
        type="submit"
        disabled={isLoading || forgotOtp.trim().length < 6}
        className="w-full"
      >
        {isLoading ? "Đang xác thực…" : "Xác thực mã"}
      </Button>
    </form>
  )
}

export function ForgotResetStep({ hook }: SignInFormProps) {
  const {
    isLoading,
    errorMessage,
    forgotEmail,
    forgotNewPassword,
    setForgotNewPassword,
    forgotConfirmPassword,
    setForgotConfirmPassword,
    handleForgotResetPassword,
  } = hook
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <form
      className="space-y-5 p-1"
      onSubmit={(event) => {
        event.preventDefault()
        handleForgotResetPassword()
      }}
    >
      <input
        type="email"
        name="username"
        value={forgotEmail}
        autoComplete="username"
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Bạn muốn đặt lại mật khẩu?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Đã xác minh thành công. Hãy thiết lập mật khẩu mới.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="new-password">Mật khẩu mới</Label>
        <InputGroup>
          <InputGroupInput
            id="new-password"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={forgotNewPassword}
            onChange={(event) => setForgotNewPassword(event.target.value)}
            placeholder="Tối thiểu 8 ký tự"
            autoComplete="new-password"
          />
          <InputGroupAddon align="inline-end" className="pr-0">
            <InputGroupButton
              type="button"
              size="icon-sm"
              onClick={() => setShowNewPassword((value) => !value)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={
                showNewPassword ? "Ẩn mật khẩu mới" : "Hiển thị mật khẩu mới"
              }
            >
              {showNewPassword ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
        <InputGroup>
          <InputGroupInput
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={forgotConfirmPassword}
            onChange={(event) => setForgotConfirmPassword(event.target.value)}
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
          />
          <InputGroupAddon align="inline-end" className="pr-0">
            <InputGroupButton
              type="button"
              size="icon-sm"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={
                showConfirmPassword
                  ? "Ẩn mật khẩu xác nhận"
                  : "Hiển thị mật khẩu xác nhận"
              }
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      {errorMessage && (
        <p
          className="text-sm text-destructive"
          role="status"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading || !forgotNewPassword || !forgotConfirmPassword}
        className="w-full"
      >
        {isLoading ? "Đang tiến hành…" : "Lưu Thay Đổi"}
      </Button>
    </form>
  )
}

export function ForgotDoneStep({ hook }: SignInFormProps) {
  return (
    <div className="space-y-5 p-1 text-center">
      <div className="flex justify-center">
        <CheckCircle2 className="h-14 w-14 text-success" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Bạn đã đổi mật khẩu thành công!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mật khẩu mới của bạn đã được thiết lập. Hãy đăng nhập để tiếp tục.
        </p>
      </div>
      <Button
        type="button"
        onClick={hook.handleBackToSignIn}
        className="w-full"
      >
        Quay lại Đăng nhập
      </Button>
    </div>
  )
}
