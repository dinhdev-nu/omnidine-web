import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  CalendarIcon,
  Check,
  CheckCircle2,
  Copy,
  Database,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Palette,
  Phone,
  RefreshCw,
  Twitter,
  User,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { getInitials, ROLE_LABEL } from "../constants"

import type { ProfileSectionController } from "../hooks/useProfileSectionController"

interface ProfileSectionViewProps {
  controller: ProfileSectionController
}

export function ProfileInfoCard({ controller }: ProfileSectionViewProps) {
  const {
    profile,
    statusBadge,
    userCode,
    resolvedFirstName,
    resolvedLastName,
    resolvedGender,
    resolvedDateOfBirth,
    bio,
    setDraftField,
  } = controller
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-medium">
              Thông tin cá nhân
            </CardTitle>
            <CardDescription>
              Cập nhật thông tin cá nhân và tùy chọn của bạn
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!userCode}
            onClick={() => {
              if (!userCode) return
              void navigator.clipboard.writeText(userCode)
              toast.success("Đã sao chép mã của bạn")
            }}
          >
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Sao chép mã của bạn
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {statusBadge && (
                <Badge className={statusBadge.className}>
                  {statusBadge.label}
                </Badge>
              )}
              {profile?.system_role && (
                <Badge variant="outline" className="text-xs">
                  {ROLE_LABEL[profile.system_role] ?? profile.system_role}
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm">
              Đổi ảnh đại diện
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG hoặc GIF. Tối đa 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Tên</Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <User className="h-4 w-4" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="firstName"
                value={resolvedFirstName}
                onChange={(event) =>
                  setDraftField("firstName", event.target.value)
                }
              />
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Họ</Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <User className="h-4 w-4" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="lastName"
                value={resolvedLastName}
                onChange={(event) =>
                  setDraftField("lastName", event.target.value)
                }
              />
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1.5">
              Email{" "}
              {profile?.email_verified_at && (
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              )}
            </Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Mail className="h-4 w-4" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                type="email"
                value={profile?.email ?? ""}
                className="cursor-default"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    void navigator.clipboard.writeText(profile?.email ?? "")
                    toast.success("Đã sao chép")
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Số điện thoại{" "}
              {profile?.phone_verified_at && (
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              )}
            </Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Phone className="h-4 w-4" />
                  <span className="border-r border-border pr-2 text-xs">
                    +84
                  </span>
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="phone"
                value={profile?.phone ?? ""}
                placeholder="Chưa thiết lập"
                className="cursor-default"
              />
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Ngày sinh</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dateOfBirth"
                  variant="outline"
                  className={cn(
                    "h-9 w-full justify-start bg-background text-left font-normal",
                    !resolvedDateOfBirth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {resolvedDateOfBirth ? (
                    format(new Date(resolvedDateOfBirth), "PPP", {
                      locale: vi,
                    })
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    resolvedDateOfBirth
                      ? new Date(resolvedDateOfBirth)
                      : undefined
                  }
                  onSelect={(date) =>
                    setDraftField(
                      "dateOfBirth",
                      date ? format(date, "yyyy-MM-dd") : ""
                    )
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Select
              value={resolvedGender || "_none"}
              onValueChange={(value) =>
                setDraftField(
                  "gender",
                  value === "_none"
                    ? ""
                    : (value as "male" | "female" | "other")
                )
              }
            >
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Không muốn tiết lộ" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={0}
                className="w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value="_none">Không muốn tiết lộ</SelectItem>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Giới thiệu</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(event) => setDraftField("bio", event.target.value)}
            placeholder="Kể đôi điều về bạn — vai trò, sở thích hoặc một điều thú vị..."
            className="min-h-[80px]"
          />
          <p className="text-right text-xs text-muted-foreground">
            {bio.length}/200 ký tự
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProfileSocialLinksCard({
  controller,
}: ProfileSectionViewProps) {
  const { website, twitter, instagram, linkedin, setDraftField } = controller
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Liên kết mạng xã hội
        </CardTitle>
        <CardDescription>Kết nối các hồ sơ mạng xã hội của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          {
            id: "website",
            Icon: Globe,
            prefix: "https://",
            value: website,
            set: (value: string) => setDraftField("website", value),
            placeholder: "tenmiencuaban.com",
          },
          {
            id: "twitter",
            Icon: Twitter,
            prefix: "x.com/",
            value: twitter,
            set: (value: string) => setDraftField("twitter", value),
            placeholder: "ten-tai-khoan",
          },
          {
            id: "instagram",
            Icon: Instagram,
            prefix: "instagram.com/",
            value: instagram,
            set: (value: string) => setDraftField("instagram", value),
            placeholder: "ten-tai-khoan",
          },
          {
            id: "linkedin",
            Icon: Linkedin,
            prefix: "linkedin.com/in/",
            value: linkedin,
            set: (value: string) => setDraftField("linkedin", value),
            placeholder: "ho-so-cua-ban",
          },
        ].map(({ id, Icon, prefix, value, set: setter, placeholder }) => (
          <div key={id} className="space-y-1.5">
            <Label htmlFor={id} className="capitalize">
              {id === "website"
                ? "Trang web"
                : id.charAt(0).toUpperCase() + id.slice(1)}
            </Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Icon className="h-4 w-4" />
                  <span className="border-r border-border pr-2 text-xs">
                    {prefix}
                  </span>
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={id}
                value={value}
                onChange={(event) => setter(event.target.value)}
                placeholder={placeholder}
              />
            </InputGroup>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ProfileDisplayOptionsCard({
  controller,
}: ProfileSectionViewProps) {
  const { resolvedTheme, resolvedLanguage, setDraftField } = controller
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Tùy chọn hiển thị
        </CardTitle>
        <CardDescription>Tùy chỉnh cách dữ liệu được hiển thị</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Chế độ tối</p>
              <p className="text-sm text-muted-foreground">
                Sử dụng giao diện tối
              </p>
            </div>
          </div>
          <Switch
            checked={resolvedTheme === "dark"}
            onCheckedChange={(checked) =>
              setDraftField("theme", checked ? "dark" : "light")
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Ngôn ngữ</p>
              <p className="text-sm text-muted-foreground">
                Ngôn ngữ hiển thị giao diện
              </p>
            </div>
          </div>
          <Select
            value={resolvedLanguage}
            onValueChange={(value) =>
              setDraftField("language", value as "en" | "vi")
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="w-[--radix-select-trigger-width]"
            >
              <SelectItem value="en">Tiếng Anh</SelectItem>
              <SelectItem value="vi">Tiếng Việt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Chế độ gọn</p>
              <p className="text-sm text-muted-foreground">
                Hiển thị nhiều dữ liệu hơn trong ít không gian hơn
              </p>
            </div>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProfileSaveActions({ controller }: ProfileSectionViewProps) {
  const { isSavingProfile, isLoadingProfile, handleSave } = controller
  return (
    <div className="flex justify-end">
      <Button
        onClick={handleSave}
        disabled={isSavingProfile || isLoadingProfile}
      >
        {isSavingProfile ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Đang lưu...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Lưu thay đổi
          </>
        )}
      </Button>
    </div>
  )
}
