import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Database, Globe, Palette } from "lucide-react"
import type { ProfileSectionViewProps } from "./profile-section-card.types"

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
