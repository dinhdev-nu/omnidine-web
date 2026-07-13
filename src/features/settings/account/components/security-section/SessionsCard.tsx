import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { SessionInfo } from "@/services/auth"
import { Globe, RefreshCw } from "lucide-react"

export function SessionsCard({
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
            <output aria-label="Đang tải phiên" className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin motion-reduce:animate-none" />
              Đang tải phiên...
            </output>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Không tìm thấy phiên nào đang hoạt động.
            </p>
          ) : (
            sessions.map((session, index) => (
              <div
                key={session.session_id}
                className="flex animate-in flex-col items-stretch justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-3 motion-reduce:animate-none fade-in slide-in-from-left-2 sm:flex-row sm:items-center"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-foreground">
                      {session.device_info?.browser} — {session.device_info?.os}
                      {session.is_current && (
                        <Badge className="ml-2 border-success/30 bg-success/20 text-xs text-success">
                          Hiện tại
                        </Badge>
                      )}
                    </p>
                    <p className="break-words text-xs text-muted-foreground">
                      {session.ip_address} ·{" "}
                      {new Date(session.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                {!session.is_current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="self-end text-destructive hover:text-destructive sm:self-auto"
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
