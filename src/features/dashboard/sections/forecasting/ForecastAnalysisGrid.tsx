import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/features/dashboard/components/charts/lazy-recharts"
import {
  quarterlyForecast,
  scenarioColorMap,
  scenarios,
} from "./forecasting.data"

export function ForecastAnalysisGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Quarterly Forecast Breakdown */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">
            Chi tiết dự báo theo quý
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <Suspense fallback={<div className="h-full" />}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quarterlyForecast} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.22 0.005 260)"
                  />
                  <XAxis
                    dataKey="quarter"
                    stroke="oklch(0.65 0 0)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="oklch(0.65 0 0)"
                    fontSize={12}
                    tickFormatter={(value) =>
                      `${(value / 1000000000).toFixed(0)}tỷ`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.12 0.005 260)",
                      border: "1px solid oklch(0.22 0.005 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                    formatter={(value) => [
                      `${(Number(value) / 1000000000).toFixed(1)}tỷ`,
                      "",
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px" }}
                    formatter={(value) => (
                      <span style={{ color: "oklch(0.65 0 0)" }}>{value}</span>
                    )}
                  />
                  <Bar
                    dataKey="actual"
                    name="Thực tế"
                    fill="oklch(0.7 0.18 145)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="forecast"
                    name="Dự báo"
                    fill="oklch(0.7 0.18 220)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="target"
                    name="Mục tiêu"
                    fill="oklch(0.65 0 0)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Suspense>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Analysis */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base font-medium">
              Phân tích kịch bản doanh thu năm
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Dự báo dựa trên các điều kiện kinh doanh khác nhau
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {scenarios.map((scenario, index) => (
            <div
              key={scenario.name}
              className="animate-in rounded-lg border border-border bg-secondary/50 p-4 transition-all duration-300 fade-in slide-in-from-right-2 hover:border-muted-foreground/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-2 rounded-full"
                    style={{
                      backgroundColor: scenarioColorMap[scenario.color],
                    }}
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {scenario.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {scenario.probability}% xác suất xảy ra
                    </p>
                  </div>
                </div>
                <p className="text-xl font-semibold text-foreground">
                  {(scenario.revenue / 1000000000).toFixed(1)} tỷ
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${scenario.probability}%`,
                    backgroundColor: scenarioColorMap[scenario.color],
                  }}
                />
              </div>
              <div className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground italic">
                  {scenario.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-foreground">
                        {scenario.orderCount.toLocaleString()}
                      </span>{" "}
                      đơn hàng
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-foreground">
                        {(scenario.avgOrderValue / 1000000).toFixed(1)}tr
                      </span>
                      /đơn
                    </span>
                  </div>
                  <span
                    className={`font-medium ${scenario.growthRate >= 0 ? "text-accent" : "text-destructive"}`}
                  >
                    {scenario.growthRate > 0 ? "+" : ""}
                    {scenario.growthRate}% vs năm trước
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
