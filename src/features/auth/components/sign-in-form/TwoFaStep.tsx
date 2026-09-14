import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { cn } from "@/lib/utils"
import type { SignInFormProps } from "./types"

export function TwoFaStep({ hook }: SignInFormProps) {
  const {
    isLoading,
    isSendingTwoFaOtp,
    twoFaCode,
    twoFaCountdown,
    errorMessage,
    setTwoFaCode,
    handleBackFromTwoFa,
    handleResendTwoFaOtp,
    handleVerifyTwoFa,
  } = hook
  const resendDisabled = twoFaCountdown > 0 || isSendingTwoFaOtp

  return (
    <div className="space-y-5 p-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleBackFromTwoFa}
        className="-ml-2 w-fit text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft />
        Quay lại
      </Button>

      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Xác thực hai yếu tố
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Nhập mã gồm 6 số chúng tôi đã gửi tới thiết bị của bạn
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP maxLength={6} value={twoFaCode} onChange={setTwoFaCode}>
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
          onClick={handleResendTwoFaOtp}
          disabled={resendDisabled}
          className={cn(
            "px-2 text-sm font-medium",
            resendDisabled
              ? "text-muted-foreground"
              : "text-foreground hover:text-foreground/80"
          )}
        >
          {isSendingTwoFaOtp
            ? "Đang gửi…"
            : twoFaCountdown > 0
              ? `Chờ ${twoFaCountdown}s`
              : "Gửi lại"}
        </Button>
      </div>

      <Button
        type="button"
        onClick={handleVerifyTwoFa}
        disabled={isLoading || twoFaCode.trim().length < 6}
        className="w-full"
      >
        {isLoading ? "Đang xác thực…" : "Xác thực và Đăng nhập"}
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
    </div>
  )
}
