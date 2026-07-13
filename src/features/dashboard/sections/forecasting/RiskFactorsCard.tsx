import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { riskFactors } from "./forecasting.data"

export function RiskFactorsCard() {
  return (
    <Card className="min-w-0 border-border bg-card">
      <CardHeader className="px-4 pb-2 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base font-medium">Yếu tố rủi ro</CardTitle>
          <Badge variant="outline" className="border-chart-3/30 text-chart-3">
            <AlertTriangle aria-hidden="true" className="mr-1 h-3 w-3" />
            {riskFactors.length} đã xác định
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-4">
          {riskFactors.map((risk, index) => (
            <div
              key={risk.id}
              className="group min-w-0 animate-in rounded-lg border border-border bg-secondary/50 p-4 transition-[border-color] duration-300 fade-in slide-in-from-bottom-2 hover:border-chart-3 motion-reduce:animate-none motion-reduce:transition-none"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`mt-2 h-2 w-2 rounded-full ${risk.severity === "high" ? "bg-destructive" : "bg-chart-3"}`}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground break-words">{risk.title}</p>
                    <p className="text-sm text-muted-foreground break-words">
                      {risk.description}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`shrink-0 ${
                    risk.severity === "high"
                      ? "border-destructive/30 bg-destructive/20 text-destructive"
                      : "border-chart-3/30 bg-chart-3/20 text-chart-3"
                  }`}
                >
                  {risk.impact}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:ml-5">
                {risk.affectedPeriods.map((period) => (
                  <Badge
                    key={period}
                    variant="outline"
                    className="border-border text-xs text-muted-foreground"
                  >
                    {period}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 sm:ml-5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="min-h-11 w-full px-2 text-xs text-muted-foreground hover:text-foreground sm:w-auto"
                  disabled
                  title="Kế hoạch giảm thiểu chưa khả dụng"
                >
                  Xem kế hoạch giảm thiểu
                  <ArrowRight aria-hidden="true" className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
