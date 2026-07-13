import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ExternalLink, Zap } from "lucide-react"
import { integrations } from "./settings-section.data"

export function IntegrationsSettingsTab() {
  return (
    <Card className="min-w-0 border-border bg-card">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-base font-medium">
          Dịch vụ đã kết nối
        </CardTitle>
        <CardDescription>Quản lý các tích hợp bên thứ ba</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {integrations.map((integration, index) => (
            <div
              key={integration.id}
              className="min-w-0 animate-in rounded-lg border border-border bg-secondary/20 p-4 transition-[border-color] duration-300 fade-in slide-in-from-bottom-2 hover:border-muted-foreground/30 motion-reduce:animate-none motion-reduce:transition-none"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex flex-col items-start justify-between gap-3 min-[390px]:flex-row">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Zap aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground break-words">
                      {integration.name}
                    </p>
                    <p className="text-sm text-muted-foreground break-words">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <Badge className="shrink-0 border-border bg-muted text-muted-foreground">
                  Chưa kết nối
                </Badge>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Chưa cấu hình
                </span>
                <Button
                  size="sm"
                  className="min-h-11 bg-accent text-white hover:bg-accent/90"
                  disabled
                  title="Tích hợp này chưa được cấu hình"
                >
                  Kết nối
                  <ExternalLink aria-hidden="true" className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
