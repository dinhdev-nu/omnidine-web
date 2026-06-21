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
