import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AUDIT_LOG } from "../../constants"

export function AuditLogCard() {
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
                className="flex animate-in items-start gap-3 border-b border-border py-2.5 motion-reduce:animate-none fade-in slide-in-from-left-2 last:border-0 sm:items-center"
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
                <span className="flex-shrink-0 text-right text-xs text-muted-foreground">
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
