import { useReducer } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bell, Mail, Smartphone, Check, RefreshCw } from "lucide-react"
import { useUserStore } from "@/stores/user-store"
import { toAppError } from "@/services/core/error"

type NotifFreq = "instant" | "daily" | "weekly"

interface NotificationState {
  notifEmail: boolean | null
  notifEmailFreq: NotifFreq
  notifPhone: boolean | null
  notifPhoneFreq: NotifFreq
  notifPush: boolean | null
  notifPushFreq: NotifFreq
}

type NotificationAction =
  | { type: "setEmailEnabled"; enabled: boolean }
  | { type: "setEmailFreq"; freq: NotifFreq }
  | { type: "setPhoneEnabled"; enabled: boolean }
  | { type: "setPhoneFreq"; freq: NotifFreq }
  | { type: "setPushEnabled"; enabled: boolean }
  | { type: "setPushFreq"; freq: NotifFreq }

const initialNotificationState: NotificationState = {
  notifEmail: null,
  notifEmailFreq: "instant",
  notifPhone: null,
  notifPhoneFreq: "instant",
  notifPush: null,
  notifPushFreq: "instant",
}

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "setEmailEnabled":
      return { ...state, notifEmail: action.enabled }
    case "setEmailFreq":
      return { ...state, notifEmailFreq: action.freq }
    case "setPhoneEnabled":
      return { ...state, notifPhone: action.enabled }
    case "setPhoneFreq":
      return { ...state, notifPhoneFreq: action.freq }
    case "setPushEnabled":
      return { ...state, notifPush: action.enabled }
    case "setPushFreq":
      return { ...state, notifPushFreq: action.freq }
  }
}

const FreqSelect = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: NotifFreq
  onChange: (value: NotifFreq) => void
}) => (
  <Select
    value={value}
    onValueChange={(newValue) => onChange(newValue as NotifFreq)}
  >
    <SelectTrigger aria-label={label} className="w-full text-xs sm:w-[160px]">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="instant">Ngay lập tức</SelectItem>
      <SelectItem value="daily">Tổng hợp theo ngày</SelectItem>
      <SelectItem value="weekly">Tổng hợp theo tuần</SelectItem>
    </SelectContent>
  </Select>
)

export function NotificationSection() {
  const profile = useUserStore((state) => state.profile)
  const preferences = useUserStore((state) => state.preferences)
  const savePreferences = useUserStore((state) => state.savePreferences)
  const isSavingProfile = useUserStore((state) => state.isSavingProfile)

  const [notificationState, dispatchNotification] = useReducer(
    notificationReducer,
    initialNotificationState
  )
  const {
    notifEmail,
    notifEmailFreq,
    notifPhone,
    notifPhoneFreq,
    notifPush,
    notifPushFreq,
  } = notificationState

  const resolvedNotifEmail =
    notifEmail ?? preferences?.notifications.email ?? false
  const resolvedNotifPhone =
    notifPhone ?? preferences?.notifications.sms ?? false
  const resolvedNotifPush =
    notifPush ?? preferences?.notifications.push ?? false

  const handleSaveNotifications = async () => {
    try {
      await savePreferences({
        notifications: {
          email: resolvedNotifEmail,
          sms: resolvedNotifPhone,
          push: resolvedNotifPush,
        },
      })
      toast.success("Đã lưu cài đặt thông báo")
    } catch (error) {
      toast.error(toAppError(error, "Không thể lưu cài đặt thông báo").message)
    }
  }

  return (
    <div className="animate-in space-y-6 duration-300 motion-reduce:animate-none fade-in slide-in-from-bottom-2">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Kênh thông báo
          </CardTitle>
          <CardDescription>
            Chọn kênh và tần suất cho từng loại thông báo
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-1">
          <div className="flex flex-col items-stretch justify-between gap-3 border-b border-border py-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Thông báo email</p>
                <p className="text-sm text-muted-foreground">
                  Nhận cập nhật tại{" "}
                  <span className="text-foreground">
                    {profile?.email ?? "email của bạn"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {resolvedNotifEmail && (
                <FreqSelect
                  label="Tần suất thông báo email"
                  value={notifEmailFreq}
                  onChange={(freq) =>
                    dispatchNotification({ type: "setEmailFreq", freq })
                  }
                />
              )}
              <Switch
                aria-label="Bật thông báo email"
                checked={resolvedNotifEmail}
                onCheckedChange={(enabled) =>
                  dispatchNotification({ type: "setEmailEnabled", enabled })
                }
              />
            </div>
          </div>

          <div className="flex flex-col items-stretch justify-between gap-3 border-b border-border py-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Thông báo SMS</p>
                <p className="text-sm text-muted-foreground">
                  Nhận tin nhắn tại{" "}
                  <span className="text-foreground">
                    {profile?.phone ?? "số điện thoại của bạn"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {resolvedNotifPhone && (
                <FreqSelect
                  label="Tần suất thông báo SMS"
                  value={notifPhoneFreq}
                  onChange={(freq) =>
                    dispatchNotification({ type: "setPhoneFreq", freq })
                  }
                />
              )}
              <Switch
                aria-label="Bật thông báo SMS"
                checked={resolvedNotifPhone}
                onCheckedChange={(enabled) =>
                  dispatchNotification({ type: "setPhoneEnabled", enabled })
                }
                disabled={!profile?.phone}
              />
            </div>
          </div>

          <div className="flex flex-col items-stretch justify-between gap-3 py-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Thông báo đẩy</p>
                <p className="text-sm text-muted-foreground">
                  Cảnh báo trong ứng dụng và trên trình duyệt
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {resolvedNotifPush && (
                <FreqSelect
                  label="Tần suất thông báo đẩy"
                  value={notifPushFreq}
                  onChange={(freq) =>
                    dispatchNotification({ type: "setPushFreq", freq })
                  }
                />
              )}
              <Switch
                aria-label="Bật thông báo đẩy"
                checked={resolvedNotifPush}
                onCheckedChange={(enabled) =>
                  dispatchNotification({ type: "setPushEnabled", enabled })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveNotifications} disabled={isSavingProfile}>
          {isSavingProfile ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" />
              Đang lưu...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Lưu thông báo
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
