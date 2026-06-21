import { useState } from "react"
import { CredentialsStep } from "./sign-in-form/CredentialsStep"
import {
  ForgotDoneStep,
  ForgotEmailStep,
  ForgotOtpStep,
  ForgotResetStep,
} from "./sign-in-form/ForgotPasswordSteps"
import { TwoFaStep } from "./sign-in-form/TwoFaStep"
import type { SignInFormProps } from "./sign-in-form/types"

export function SignInForm({ hook }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  if (hook.signInStep === "2fa") {
    return <TwoFaStep hook={hook} />
  }

  if (hook.signInStep === "forgot-email") {
    return <ForgotEmailStep hook={hook} />
  }

  if (hook.signInStep === "forgot-otp") {
    return <ForgotOtpStep hook={hook} />
  }

  if (hook.signInStep === "forgot-reset") {
    return <ForgotResetStep hook={hook} />
  }

  if (hook.signInStep === "forgot-done") {
    return <ForgotDoneStep hook={hook} />
  }

  return (
    <CredentialsStep
      hook={hook}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword((value) => !value)}
    />
  )
}
