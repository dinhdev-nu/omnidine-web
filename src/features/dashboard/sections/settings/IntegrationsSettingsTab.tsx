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
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Dịch vụ đã kết nối
        </CardTitle>
        <CardDescription>Quản lý các tích hợp bên thứ ba</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {integrations.map((integration, index) => (
            <div
              key={integration.id}
              className="animate-in rounded-lg border border-border bg-secondary/20 p-4 transition-all duration-300 fade-in slide-in-from-bottom-2 hover:border-muted-foreground/30"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Zap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {integration.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <Badge className="border-border bg-muted text-muted-foreground">
                  Chưa kết nối
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Chưa cấu hình
                </span>
                <Button
                  size="sm"
                  className="h-8 bg-accent text-white hover:bg-accent/90"
                >
                  Kết nối
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
