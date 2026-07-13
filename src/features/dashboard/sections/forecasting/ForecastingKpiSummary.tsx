import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import { kpiStats } from "./forecasting.data"

export function ForecastingKpiSummary() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiStats.map((stat, index) => (
        <Card
          key={stat.label}
          className="min-w-0 border-border bg-card transition-[border-color] duration-500 motion-reduce:transition-none"
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {stat.subtext}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <stat.icon
                  aria-hidden="true"
                  className={`h-5 w-5 ${stat.label === "Doanh thu rủi ro" ? "text-chart-3" : "text-accent"}`}
                />
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    stat.trendUp
                      ? "border-accent/30 text-accent"
                      : "border-destructive/30 text-destructive"
                  }`}
                >
                  {stat.trendUp ? (
                    <TrendingUp aria-hidden="true" className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown aria-hidden="true" className="mr-1 h-3 w-3" />
                  )}
                  {stat.trend}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
