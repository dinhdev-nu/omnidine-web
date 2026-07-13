import { useEffect, useReducer } from "react"
import { toast } from "sonner"
import { useUserStore } from "@/stores/user-store"
import { toAppError } from "@/services/core/error"
import {
  changePassword,
  disable2fa,
  enable2fa,
  getSessions,
  revokeSession,
} from "@/services/auth"
import {
  securityInitialState,
  securityReducer,
} from "./security-section.state"
import { AuditLogCard } from "./components/security-section/AuditLogCard"
import { DangerZoneCard } from "./components/security-section/DangerZoneCard"
import { PasswordSecurityCard } from "./components/security-section/PasswordSecurityCard"
import { SessionsCard } from "./components/security-section/SessionsCard"
import { TwoFactorCard } from "./components/security-section/TwoFactorCard"

export function SecuritySection() {
  const profile = useUserStore((state) => state.profile)
  const fetchProfile = useUserStore((state) => state.fetchProfile)

  const [securityState, dispatchSecurity] = useReducer(
    securityReducer,
    securityInitialState
  )

  useEffect(() => {
    let cancelled = false

    getSessions()
      .then((data) => {
        if (!cancelled) {
          dispatchSecurity({ type: "sessionsLoaded", sessions: data })
        }
      })
      .catch(() => { })
      .finally(() => {
        if (!cancelled) {
          dispatchSecurity({ type: "sessionsLoadingFinished" })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleChangePassword = async () => {
    // Remove client-side password match validation; server will validate
    dispatchSecurity({ type: "startPasswordChange" })

    try {
      await changePassword(
        securityState.currentPassword,
        securityState.newPassword
      )
      dispatchSecurity({ type: "passwordChangeSucceeded" })
    } catch (error) {
      toast.error(toAppError(error, "Không thể đổi mật khẩu").message)
    } finally {
      dispatchSecurity({ type: "passwordChangeFinished" })
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId)
      dispatchSecurity({ type: "sessionRevoked", sessionId })
    } catch (error) {
      toast.error(toAppError(error, "Không thể thu hồi phiên").message)
    }
  }

  const handleToggle2fa = async () => {
    if (!securityState.twoFaPassword.trim()) return

    dispatchSecurity({ type: "startTwoFaChange" })

    try {
      if (profile?.two_factor_enabled) {
        await disable2fa(securityState.twoFaPassword)
        toast.success("Đã tắt xác thực 2 lớp")
      } else {
        await enable2fa(securityState.twoFaPassword)
        toast.success("Đã bật xác thực 2 lớp")
      }
      dispatchSecurity({ type: "twoFaChangeSucceeded" })
      await fetchProfile()
    } catch (error) {
      toast.error(toAppError(error, "Không thể cập nhật 2FA").message)
    } finally {
      dispatchSecurity({ type: "twoFaChangeFinished" })
    }
  }

  return (
    <div className="animate-in space-y-6 duration-300 motion-reduce:animate-none fade-in slide-in-from-bottom-2">
      <PasswordSecurityCard
        state={securityState}
        profileEmail={profile?.email ?? ""}
        dispatchSecurity={dispatchSecurity}
        onChangePassword={handleChangePassword}
      />
      <TwoFactorCard
        state={securityState}
        profileEmail={profile?.email ?? ""}
        twoFactorEnabled={Boolean(profile?.two_factor_enabled)}
        dispatchSecurity={dispatchSecurity}
        onToggle2fa={handleToggle2fa}
      />
      <SessionsCard
        sessions={securityState.sessions}
        isLoadingSessions={securityState.isLoadingSessions}
        onRevokeSession={handleRevokeSession}
      />
      <AuditLogCard />
      <DangerZoneCard
        deleteConfirm={securityState.deleteConfirm}
        dispatchSecurity={dispatchSecurity}
      />
    </div>
  )
}
