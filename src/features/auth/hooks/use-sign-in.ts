import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  login,
  send2faOtp, verify2faOtp,
  forgotPassword, verifyResetPasswordOtp, resetPassword,
} from "@/services/auths"
import { AUTH_ROUTE_PATHS } from "@/features/auth/constants"
import { SETTINGS_DEFAULT_PATH } from "@/routes/setting-route-config"
import { toAppError } from "@/services/error"
import { useAuthStore } from "@/stores/auth-store"

interface SignInForm {
  email: string
  phoneNumber: string
  password: string
}

export type SignInStep =
  | "credentials"
  | "2fa"
  | "forgot-email"
  | "forgot-otp"
  | "forgot-reset"
  | "forgot-done"

export interface UseSignInReturn {
  form: SignInForm
  isLoading: boolean
  isSendingTwoFaOtp: boolean
  signInStep: SignInStep
  setSignInStep: (step: SignInStep) => void
  twoFaCode: string
  twoFaCountdown: number
  errorMessage: string | null
  rememberMe: boolean
  setRememberMe: (value: boolean) => void
  setTwoFaCode: (value: string) => void
  handleIdentifierChange: (value: string) => void
  handlePasswordChange: (value: string) => void
  handleForgotPassword: () => void
  handleBackFromTwoFa: () => void
  handleResendTwoFaOtp: () => Promise<void>
  handleVerifyTwoFa: () => Promise<void>
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleGoogleLogin: () => void
  handleAppleLogin: () => void
  // Forgot password
  forgotEmail: string
  setForgotEmail: (v: string) => void
  forgotOtp: string
  setForgotOtp: (v: string) => void
  forgotNewPassword: string
  setForgotNewPassword: (v: string) => void
  forgotConfirmPassword: string
  setForgotConfirmPassword: (v: string) => void
  forgotCountdown: number
  isResendingForgotOtp: boolean
  handleForgotSubmitEmail: () => Promise<void>
  handleBackToForgotEmail: () => void
  handleForgotResendOtp: () => Promise<void>
  handleForgotVerifyOtp: () => Promise<void>
  handleForgotResetPassword: () => Promise<void>
  handleBackToSignIn: () => void
}

export function useSignIn(): UseSignInReturn {
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const tempToken = useAuthStore((state) => state.tempToken)
  const setTempToken = useAuthStore((state) => state.setTempToken)
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [isSendingTwoFaOtp, setIsSendingTwoFaOtp] = useState(false)
  const [signInStep, setSignInStep] = useState<SignInStep>("credentials")
  const [twoFaCode, setTwoFaCode] = useState("")
  const [twoFaCountdown, setTwoFaCountdown] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [form, setForm] = useState<SignInForm>({ email: "", phoneNumber: "", password: "" })

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotOtp, setForgotOtp] = useState("")
  const [forgotNewPassword, setForgotNewPassword] = useState("")
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("")
  const [forgotSessionToken, setForgotSessionToken] = useState("")
  const [forgotResetGrantToken, setForgotResetGrantToken] = useState("")
  const [forgotCountdown, setForgotCountdown] = useState(0)
  const [isResendingForgotOtp, setIsResendingForgotOtp] = useState(false)

  useEffect(() => {
    if (twoFaCountdown <= 0) return
    const timer = setTimeout(() => setTwoFaCountdown((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [twoFaCountdown])

  useEffect(() => {
    if (forgotCountdown <= 0) return
    const timer = setTimeout(() => setForgotCountdown((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [forgotCountdown])

  const handleIdentifierChange = (value: string) => {
    const isPhone = /^[+\d]/.test(value) && /^\+?\d[\d\s\-()]*$/.test(value)
    if (isPhone) {
      setForm((prev) => ({ ...prev, phoneNumber: value, email: "" }))
    } else {
      setForm((prev) => ({ ...prev, email: value, phoneNumber: "" }))
    }
  }

  const handlePasswordChange = (value: string) =>
    setForm((prev) => ({ ...prev, password: value }))

  const handleForgotPassword = () => {
    setForgotEmail(form.email || "")
    setSignInStep("forgot-email")
    setErrorMessage(null)
    navigate(AUTH_ROUTE_PATHS["forgot-password"])
  }

  const handleBackFromTwoFa = () => {
    setSignInStep("credentials")
    setTwoFaCode("")
    setTwoFaCountdown(0)
    setTempToken(null)
    setErrorMessage(null)
    // fallback to hard navigation if router navigate does not update URL
    // attempt router navigation first, fallback to full navigation if it didn't take
    navigate(AUTH_ROUTE_PATHS.login, { replace: true })
    setTimeout(() => {
      if (location.pathname !== AUTH_ROUTE_PATHS.login) window.location.href = AUTH_ROUTE_PATHS.login
    }, 50)
  }

  const handleBackToSignIn = () => {
    setSignInStep("credentials")
    setForgotEmail("")
    setForgotOtp("")
    setForgotNewPassword("")
    setForgotConfirmPassword("")
    setForgotSessionToken("")
    setForgotResetGrantToken("")
    setForgotCountdown(0)
    setErrorMessage(null)
    navigate(AUTH_ROUTE_PATHS.login, { replace: true })
    setTimeout(() => {
      if (location.pathname !== AUTH_ROUTE_PATHS.login) window.location.href = AUTH_ROUTE_PATHS.login
    }, 50)
  }

  const handleBackToForgotEmail = () => {
    setSignInStep("forgot-email")
    setForgotOtp("")
    setErrorMessage(null)
    navigate(AUTH_ROUTE_PATHS["forgot-password"], { replace: true })
    setTimeout(() => {
      if (location.pathname !== AUTH_ROUTE_PATHS["forgot-password"]) window.location.href = AUTH_ROUTE_PATHS["forgot-password"]
    }, 50)
  }

  const handleResendTwoFaOtp = async () => {
    if (!tempToken || twoFaCountdown > 0 || isSendingTwoFaOtp) return
    setIsSendingTwoFaOtp(true)
    try {
      const { expires_in } = await send2faOtp(tempToken)
      setTwoFaCountdown(expires_in)
    } catch (error) {
      toast.error(toAppError(error, "Không thể gửi lại OTP 2FA").message)
    } finally {
      setIsSendingTwoFaOtp(false)
    }
  }

  const handleVerifyTwoFa = async () => {
    if (!tempToken || twoFaCode.trim().length < 6) return
    setIsLoading(true)
    try {
      const result = await verify2faOtp(tempToken, twoFaCode)
      setAccessToken(result.access_token)
      setTempToken(null)
      navigate(SETTINGS_DEFAULT_PATH)
    } catch (error) {
      toast.error(toAppError(error, "Xác minh 2FA không thành công").message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const identifier = (form.email || form.phoneNumber).trim()
    if (!identifier || !form.password) {
      setErrorMessage("Vui lòng nhập email/điện thoại và mật khẩu")
      return
    }

    setErrorMessage(null)
    setIsLoading(true)
    try {
      const result = await login({
        identifier,
        password: form.password,
        remember_me: rememberMe,
      })
      if ("state" in result && result.state === "2fa_required") {
        setTempToken(result.temp_token)
        setSignInStep("2fa")
        const { expires_in } = await send2faOtp(result.temp_token)
        setTwoFaCountdown(expires_in)
        setTwoFaCode("")
        return
      }

      if (!("access_token" in result)) {
        toast.error("Phản hồi đăng nhập không hợp lệ")
        return
      }

      setTempToken(null)
      setAccessToken(result.access_token)
      navigate(SETTINGS_DEFAULT_PATH)
    } catch (error) {
      toast.error(toAppError(error, "Đăng nhập không thành công").message)
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Forgot password handlers ──────────────────────────────────────────────

  const handleForgotSubmitEmail = async () => {
    const email = forgotEmail.trim()
    if (!email) {
      setErrorMessage("Vui lòng nhập địa chỉ email của bạn")
      return
    }
    setErrorMessage(null)
    setIsLoading(true)
    try {
      const { session_token } = await forgotPassword(email)
      setForgotSessionToken(session_token)
      setSignInStep("forgot-otp")
      setForgotCountdown(60)
    } catch (error) {
      toast.error(toAppError(error, "Không thể gửi OTP đặt lại").message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotResendOtp = async () => {
    if (!forgotEmail.trim() || forgotCountdown > 0 || isResendingForgotOtp) return
    setIsResendingForgotOtp(true)
    try {
      const { session_token } = await forgotPassword(forgotEmail.trim())
      setForgotSessionToken(session_token)
      setForgotCountdown(60)
    } catch (error) {
      toast.error(toAppError(error, "Không thể gửi lại OTP").message)
    } finally {
      setIsResendingForgotOtp(false)
    }
  }

  const handleForgotVerifyOtp = async () => {
    if (forgotOtp.trim().length < 6) return
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const { reset_grant_token } = await verifyResetPasswordOtp(forgotSessionToken, forgotOtp)
      setForgotResetGrantToken(reset_grant_token)
      setSignInStep("forgot-reset")
    } catch (error) {
      toast.error(toAppError(error, "Mã OTP không hợp lệ").message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotResetPassword = async () => {
    // Client-side validation removed; server will validate password rules
    setErrorMessage(null)
    setIsLoading(true)
    try {
      await resetPassword(forgotResetGrantToken, forgotNewPassword)
      setSignInStep("forgot-done")
    } catch (error) {
      toast.error(toAppError(error, "Không thể đặt lại mật khẩu").message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auths/oauth/google`
  }

  const handleAppleLogin = () => {
    // TODO: implement Apple OAuth
  }

  return {
    form,
    isLoading,
    isSendingTwoFaOtp,
    signInStep,
    setSignInStep,
    twoFaCode,
    twoFaCountdown,
    errorMessage,
    rememberMe,
    setRememberMe,
    setTwoFaCode,
    handleIdentifierChange,
    handlePasswordChange,
    handleForgotPassword,
    handleBackFromTwoFa,
    handleResendTwoFaOtp,
    handleVerifyTwoFa,
    handleSubmit,
    handleGoogleLogin,
    handleAppleLogin,
    // Forgot password
    forgotEmail,
    setForgotEmail,
    forgotOtp,
    setForgotOtp,
    forgotNewPassword,
    setForgotNewPassword,
    forgotConfirmPassword,
    setForgotConfirmPassword,
    forgotCountdown,
    isResendingForgotOtp,
    handleForgotSubmitEmail,
    handleBackToForgotEmail,
    handleForgotResendOtp,
    handleForgotVerifyOtp,
    handleForgotResetPassword,
    handleBackToSignIn,
  }
}
