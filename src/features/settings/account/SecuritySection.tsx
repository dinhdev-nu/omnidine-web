import { useEffect, useReducer } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Lock,
  Key,
  RefreshCw,
  Globe,
  AlertTriangle,
  Download,
  Trash2,
} from "lucide-react"
import { useUserStore } from "@/stores/user-store"
import { toAppError } from "@/services/core/error"
import {
  changePassword,
  enable2fa,
  disable2fa,
  getSessions,
  revokeSession,
  type SessionInfo,
} from "@/services/auth"

import { AUDIT_LOG } from "./constants"

type PasswordField = "currentPassword" | "newPassword" | "confirmNewPassword"

type SecurityState = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
  passwordError: string | null
  isChangingPassword: boolean
  passwordSuccess: boolean
  sessions: SessionInfo[]
  isLoadingSessions: boolean
  show2faForm: boolean
  twoFaPassword: string
  isTwoFaLoading: boolean
  deleteConfirm: string
}

type SecurityAction =
  | { type: "setPasswordField"; field: PasswordField; value: string }
  | { type: "startPasswordChange" }
  | { type: "passwordChangeSucceeded" }
  | { type: "passwordChangeFinished" }
  | { type: "sessionsLoaded"; sessions: SessionInfo[] }
  | { type: "sessionsLoadingFinished" }
  | { type: "sessionRevoked"; sessionId: string }
  | { type: "toggle2faForm" }
  | { type: "setTwoFaPassword"; value: string }
  | { type: "startTwoFaChange" }
  | { type: "twoFaChangeSucceeded" }
  | { type: "twoFaChangeFinished" }
  | { type: "setDeleteConfirm"; value: string }

type SecurityDispatch = (action: SecurityAction) => void

const securityInitialState: SecurityState = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  passwordError: null,
  isChangingPassword: false,
  passwordSuccess: false,
  sessions: [],
  isLoadingSessions: true,
  show2faForm: false,
  twoFaPassword: "",
  isTwoFaLoading: false,
  deleteConfirm: "",
}

function securityReducer(
  state: SecurityState,
  action: SecurityAction
): SecurityState {
  switch (action.type) {
    case "setPasswordField":
      return { ...state, [action.field]: action.value }
    case "startPasswordChange":
      return {
        ...state,
        passwordError: null,
        passwordSuccess: false,
        isChangingPassword: true,
      }
    case "passwordChangeSucceeded":
      return {
        ...state,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        passwordSuccess: true,
        isChangingPassword: false,
      }
    case "passwordChangeFinished":
      return { ...state, isChangingPassword: false }
    case "sessionsLoaded":
      return { ...state, sessions: action.sessions }
    case "sessionsLoadingFinished":
      return { ...state, isLoadingSessions: false }
    case "sessionRevoked":
      return {
        ...state,
        sessions: state.sessions.filter(
          (session) => session.session_id !== action.sessionId
        ),
      }
    case "toggle2faForm":
      return {
        ...state,
        show2faForm: !state.show2faForm,
        twoFaPassword: "",
      }
    case "setTwoFaPassword":
      return { ...state, twoFaPassword: action.value }
    case "startTwoFaChange":
      return { ...state, isTwoFaLoading: true }
    case "twoFaChangeSucceeded":
      return {
        ...state,
        show2faForm: false,
        twoFaPassword: "",
        isTwoFaLoading: false,
      }
    case "twoFaChangeFinished":
      return { ...state, isTwoFaLoading: false }
    case "setDeleteConfirm":
      return { ...state, deleteConfirm: action.value }
    default:
      return state
  }
}

function PasswordSecurityCard({
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

function TwoFactorCard({
  state,
  twoFactorEnabled,
  dispatchSecurity,
  onToggle2fa,
}: {
  state: SecurityState
  twoFactorEnabled: boolean
  dispatchSecurity: SecurityDispatch
  onToggle2fa: () => void
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Xác thực hai lớp
        </CardTitle>
        <CardDescription>
          Thêm một lớp bảo mật cho tài khoản của bạn
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${twoFactorEnabled ? "bg-success/20" : "bg-muted"}`}
            >
              <Key
                className={`h-5 w-5 ${twoFactorEnabled ? "text-success" : "text-muted-foreground"}`}
              />
            </div>
            <div>
              <p className="font-medium text-foreground">Ứng dụng xác thực</p>
              <p className="text-sm text-muted-foreground">
                Dùng ứng dụng xác thực để nhận mã 2FA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              className={
                twoFactorEnabled
                  ? "border-success/30 bg-success/20 text-success"
                  : "border-border bg-muted text-muted-foreground"
              }
            >
              {twoFactorEnabled ? "Đã bật" : "Đã tắt"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatchSecurity({ type: "toggle2faForm" })}
            >
              {state.show2faForm ? "Hủy" : "Quản lý"}
            </Button>
          </div>
        </div>

        {state.show2faForm && (
          <div className="animate-in space-y-3 rounded-lg border border-border bg-secondary/20 px-4 py-3 duration-200 fade-in slide-in-from-top-1">
            <p className="text-sm text-muted-foreground">
              {twoFactorEnabled
                ? "Nhập mật khẩu để tắt 2FA."
                : "Nhập mật khẩu để bật 2FA."}
            </p>
            <div className="flex items-center gap-2">
              <InputGroup className="max-w-xs">
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <Lock className="h-4 w-4" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  value={state.twoFaPassword}
                  onChange={(event) =>
                    dispatchSecurity({
                      type: "setTwoFaPassword",
                      value: event.target.value,
                    })
                  }
                  onKeyDown={(event) => event.key === "Enter" && onToggle2fa()}
                />
              </InputGroup>
              <Button
                size="sm"
                variant={twoFactorEnabled ? "destructive" : "default"}
                onClick={onToggle2fa}
                disabled={state.isTwoFaLoading || !state.twoFaPassword.trim()}
              >
                {state.isTwoFaLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : twoFactorEnabled ? (
                  "Tắt 2FA"
                ) : (
                  "Bật 2FA"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SessionsCard({
  sessions,
  isLoadingSessions,
  onRevokeSession,
}: {
  sessions: SessionInfo[]
  isLoadingSessions: boolean
  onRevokeSession: (sessionId: string) => void
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Phiên đang hoạt động
        </CardTitle>
        <CardDescription>
          Quản lý các thiết bị bạn đang đăng nhập
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {isLoadingSessions ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang tải phiên...
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Không tìm thấy phiên nào đang hoạt động.
            </p>
          ) : (
            sessions.map((session, index) => (
              <div
                key={session.session_id}
                className="flex animate-in items-center justify-between rounded-lg border border-border bg-secondary/30 p-3 fade-in slide-in-from-left-2"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {session.device_info?.browser} — {session.device_info?.os}
                      {session.is_current && (
                        <Badge className="ml-2 border-success/30 bg-success/20 text-xs text-success">
                          Hiện tại
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.ip_address} ·{" "}
                      {new Date(session.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                {!session.is_current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onRevokeSession(session.session_id)}
                  >
                    Thu hồi
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function AuditLogCard() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Nhật ký kiểm tra bảo mật
        </CardTitle>
        <CardDescription>
          Các sự kiện bảo mật gần đây trên tài khoản của bạn
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          {AUDIT_LOG.map((event, index) => {
            const IconComp = event.icon
            const isAlert =
              event.type === "login" && event.label.includes("thất bại")

            return (
              <div
                key={event.id}
                className="flex animate-in items-center gap-3 border-b border-border py-2.5 fade-in slide-in-from-left-2 last:border-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isAlert ? "bg-destructive/10" : "bg-secondary"}`}
                >
                  <IconComp
                    className={`h-3.5 w-3.5 ${isAlert ? "text-destructive" : "text-muted-foreground"}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${isAlert ? "text-destructive" : "text-foreground"}`}
                  >
                    {event.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.ip} {event.detail && `· ${event.detail}`}
                  </p>
                </div>
                <span className="flex-shrink-0 text-xs text-muted-foreground">
                  {new Date(event.at).toLocaleDateString("vi-VN")}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function DangerZoneCard({
  deleteConfirm,
  dispatchSecurity,
}: {
  deleteConfirm: string
  dispatchSecurity: SecurityDispatch
}) {
  return (
    <Card className="border-border border-destructive/30 bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <CardTitle className="text-base font-medium text-destructive">
            Vùng nguy hiểm
          </CardTitle>
        </div>
        <CardDescription>
          Các thao tác không thể hoàn tác ảnh hưởng đến tài khoản của bạn
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <Download className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Xuất dữ liệu của tôi
              </p>
              <p className="text-xs text-muted-foreground">
                Tải toàn bộ dữ liệu của bạn dưới dạng tệp ZIP
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Xuất
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
              <Trash2 className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Xóa tài khoản
              </p>
              <p className="text-xs text-muted-foreground">
                Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu liên quan. Không thể
                hoàn tác.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="deleteConfirm"
              className="text-xs text-muted-foreground"
            >
              Nhập <span className="font-mono text-foreground">DELETE</span> để
              xác nhận
            </Label>
            <InputGroup>
              <InputGroupInput
                id="deleteConfirm"
                value={deleteConfirm}
                onChange={(event) =>
                  dispatchSecurity({
                    type: "setDeleteConfirm",
                    value: event.target.value,
                  })
                }
                placeholder="Nhập DELETE để xác nhận"
                className="font-mono"
              />
            </InputGroup>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteConfirm !== "DELETE"}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa vĩnh viễn tài khoản
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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
      .catch(() => {})
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
    <div className="animate-in space-y-6 duration-300 fade-in slide-in-from-bottom-2">
      <PasswordSecurityCard
        state={securityState}
        dispatchSecurity={dispatchSecurity}
        onChangePassword={handleChangePassword}
      />
      <TwoFactorCard
        state={securityState}
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
