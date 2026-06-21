import { useState } from "react"
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion"
import { Mail, Eye, EyeOff, ArrowLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { OtpMethodModal } from "./OtpMethodModal"
import type { UseSignUpReturn } from "../hooks/useSignUp"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { cn } from "@/lib/utils"

type Step = "info" | "otp" | "password"

const STEP_ORDER: Step[] = ["info", "password", "otp"]

// ── Slide variants ────────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
}

// ── Step 1: Name + Identifier ─────────────────────────────────────────────────
interface StepInfoProps {
  form: UseSignUpReturn["form"]
  isLoading: boolean
  handleChange: UseSignUpReturn["handleChange"]
  handleIdentifierChange: UseSignUpReturn["handleIdentifierChange"]
  onContinue: () => void
}

function StepInfo({ form, isLoading, handleChange, handleIdentifierChange, onContinue }: StepInfoProps) {
  return (
    <div className="space-y-4 p-1">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Tạo tài khoản mới</h2>
        <p className="mt-1 text-sm text-muted-foreground">Nhập thông tin của bạn để bắt đầu</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Tên</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="Tên"
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Họ</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Họ"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-identifier">Email hoặc số điện thoại</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-identifier"
            name="identifier"
            type="text"
            value={form.email || form.phoneNumber}
            onChange={(e) => handleIdentifierChange(e.target.value)}
            className="pl-10 pr-16"
            placeholder="Email hoặc số điện thoại"
            autoComplete="username"
            spellCheck={false}
          />
          {(form.email || form.phoneNumber) && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {form.email ? "Email" : "Phone"}
            </span>
          )}
        </div>
      </div>

      <Button type="button" onClick={onContinue} disabled={isLoading} className="w-full mt-2 gap-1.5">
        {isLoading ? "Đang xử lý…" : (
          <>
            <span>Tiếp tục</span>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  )
}

// ── Step 2: OTP ───────────────────────────────────────────────────────────────
interface StepOtpProps {
  form: UseSignUpReturn["form"]
  isLoading: boolean
  isSendingOtp: boolean
  otpCountdown: number
  handleChange: UseSignUpReturn["handleChange"]
  onVerify: () => void
  onResend: () => void
  onBack: () => void
}

function StepOtp({ form, isLoading, isSendingOtp, otpCountdown, handleChange, onVerify, onResend, onBack }: StepOtpProps) {
  const identifier = form.email || form.phoneNumber
  const resendDisabled = otpCountdown > 0 || isSendingOtp

  return (
    <div className="space-y-5 p-1">
      <Button type="button" variant="ghost" size="sm" onClick={onBack} className="-ml-2 w-fit text-muted-foreground hover:text-foreground">
        <ArrowLeft />
        Quay lại
      </Button>
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Kiểm tra {form.email ? "hòm thư" : "tin nhắn"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Chúng tôi đã gửi mã 6 số tới{" "}
          <span className="font-medium text-foreground">{identifier}</span>
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={form.otp || ""}
          onChange={(value) => handleChange("otp", value)}
        >
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
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Không nhận được mã?
        </button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResend}
          disabled={resendDisabled}
          className={cn(
            "h-auto px-2 text-sm font-medium",
            resendDisabled ? "text-muted-foreground" : "text-foreground hover:text-foreground/80"
          )}
        >
          {isSendingOtp ? "Đang gửi…" : otpCountdown > 0 ? `Gửi lại sau ${otpCountdown}s` : "Gửi lại"}
        </Button>
      </div>

      <Button
        type="button"
        onClick={onVerify}
        disabled={isLoading || (form.otp || "").trim().length < 6}
        className="w-full"
      >
        {isLoading ? "Đang xác minh…" : "Xác minh mã"}
      </Button>
    </div>
  )
}

// ── Step 3: Password ──────────────────────────────────────────────────────────
interface StepPasswordProps {
  form: UseSignUpReturn["form"]
  isLoading: boolean
  handleChange: UseSignUpReturn["handleChange"]
  onSubmit: () => void
  onBack: () => void
}

function StepPassword({ form, isLoading, handleChange, onSubmit, onBack }: StepPasswordProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const mismatch = form.confirmPassword && form.password !== form.confirmPassword

  return (
    <div className="space-y-4 p-1">
      <Button type="button" variant="ghost" size="sm" onClick={onBack} className="-ml-2 w-fit text-muted-foreground hover:text-foreground">
        <ArrowLeft />
        Quay lại
      </Button>
      <div>
        <h2 className="text-xl font-semibold text-foreground">Tạo mật khẩu</h2>
        <p className="mt-1 text-sm text-muted-foreground">Chọn mật khẩu mạnh cho tài khoản của bạn</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="new-password">Mật khẩu</Label>
        <div className="relative">
          <Input
            id="new-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Mật khẩu"
            className="pr-10"
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Xác nhận mật khẩu"
            className="pr-10"
            aria-invalid={Boolean(mismatch)}
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showConfirm ? "Ẩn mật khẩu xác nhận" : "Hiển thị mật khẩu xác nhận"}
          >
            {showConfirm ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        {mismatch && <p className="text-xs text-destructive">Mật khẩu không khớp</p>}
      </div>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={isLoading || !form.password || !!mismatch}
        className="w-full mt-2"
      >
        {isLoading ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
      </Button>
    </div>
  )
}

// ── Public component ──────────────────────────────────────────────────────────
interface SignUpStepsProps {
  hook: UseSignUpReturn
}

export function SignUpSteps({ hook }: SignUpStepsProps) {
  const {
    step, setStep,
    form, errorMessage, handleChange, handleIdentifierChange,
    isLoading, isSendingOtp, otpCountdown,
    showMethodModal, setShowMethodModal,
    getAvailableMethods,
    handleContinue, handleMethodSelect, handleResendOtp, handleVerifyOtp, handleCreateAccount,
  } = hook

  const [direction, setDirection] = useState(1)

  const navigate = (newStep: Step) => {
    setDirection(STEP_ORDER.indexOf(newStep) > STEP_ORDER.indexOf(step) ? 1 : -1)
    setStep(newStep)
  }

  return (
    <div className="relative overflow-hidden">
      <LazyMotion features={domAnimation}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <m.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            {step === "info" && (
              <StepInfo
                form={form}
                isLoading={isLoading}
                handleChange={handleChange}
                handleIdentifierChange={handleIdentifierChange}
                onContinue={handleContinue}
              />
            )}
            {step === "password" && (
              <StepPassword
                form={form}
                isLoading={isLoading}
                handleChange={handleChange}
                onSubmit={handleCreateAccount}
                onBack={() => navigate("info")}
              />
            )}
            {step === "otp" && (
              <StepOtp
                form={form}
                isLoading={isLoading}
                isSendingOtp={isSendingOtp}
                otpCountdown={otpCountdown}
                handleChange={handleChange}
                onVerify={handleVerifyOtp}
                onResend={handleResendOtp}
                onBack={() => navigate(form.password ? "password" : "info")}
              />
            )}

            {errorMessage && (
              <p className="mt-3 text-sm text-destructive" role="status" aria-live="polite">
                {errorMessage}
              </p>
            )}
          </m.div>
        </AnimatePresence>
      </LazyMotion>

      {showMethodModal && (
        <OtpMethodModal
          methods={getAvailableMethods()}
          isSendingOtp={isSendingOtp}
          onSelect={handleMethodSelect}
          onClose={() => setShowMethodModal(false)}
        />
      )}
    </div>
  )
}
