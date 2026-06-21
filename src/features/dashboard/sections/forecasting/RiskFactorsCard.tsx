import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { riskFactors } from "./forecasting.data"

export function RiskFactorsCard() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Yếu tố rủi ro</CardTitle>
          <Badge variant="outline" className="border-chart-3/30 text-chart-3">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {riskFactors.length} đã xác định
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {riskFactors.map((risk, index) => (
            <div
              key={risk.id}
              className="group animate-in rounded-lg border border-border bg-secondary/50 p-4 transition-all duration-300 fade-in slide-in-from-bottom-2 hover:border-chart-3"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-2 h-2 w-2 rounded-full ${risk.severity === "high" ? "bg-destructive" : "bg-chart-3"}`}
                  />
                  <div>
                    <p className="font-medium text-foreground">{risk.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {risk.description}
                    </p>
                  </div>
                </div>
                <Badge
                  className={
                    risk.severity === "high"
                      ? "border-destructive/30 bg-destructive/20 text-destructive"
                      : "border-chart-3/30 bg-chart-3/20 text-chart-3"
                  }
                >
                  {risk.impact}
                </Badge>
              </div>
              <div className="ml-5 flex flex-wrap items-center gap-2">
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
              <div className="mt-3 ml-5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Xem kế hoạch giảm thiểu
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
