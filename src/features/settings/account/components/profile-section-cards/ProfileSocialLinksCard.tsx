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
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Globe, Instagram, Linkedin, Twitter } from "lucide-react"
import type { ProfileSectionViewProps } from "./profile-section-card.types"

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
