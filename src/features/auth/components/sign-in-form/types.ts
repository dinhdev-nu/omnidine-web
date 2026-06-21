import type { UseSignInReturn } from "../../hooks/useSignIn"

export interface SignInFormProps {
  hook: UseSignInReturn
}

export type CredentialsStepProps = SignInFormProps & {
  showPassword: boolean
  onTogglePassword: () => void
}
