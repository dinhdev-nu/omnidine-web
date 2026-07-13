import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useReducedMotion } from "@/features/dashboard/components/charts/use-reduced-motion"
import {
  quarterlyForecast,
  scenarioColorMap,
  scenarios,
} from "./forecasting.data"

export function ForecastAnalysisGrid() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Quarterly Forecast Breakdown */}
      <Card className="min-w-0 border-border bg-card">
        <CardHeader className="px-4 pb-2 sm:px-6">
          <CardTitle className="text-base font-medium">
            Chi tiết dự báo theo quý
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div role="img" aria-label="Biểu đồ chi tiết dự báo theo quý" className="h-[280px] min-w-0 sm:h-[250px]">
              <BarChart
                responsive
                style={{ width: "100%", height: "100%" }}
                data={quarterlyForecast}
                barGap={4}
              >
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
                    isAnimationActive={!shouldReduceMotion}
                    fill="oklch(0.7 0.18 145)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="forecast"
                    name="Dự báo"
                    isAnimationActive={!shouldReduceMotion}
                    fill="oklch(0.7 0.18 220)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="target"
                    name="Mục tiêu"
                    isAnimationActive={!shouldReduceMotion}
                    fill="oklch(0.65 0 0)"
                    radius={[4, 4, 0, 0]}
                  />
              </BarChart>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Analysis */}
      <Card className="min-w-0 border-border bg-card">
        <CardHeader className="px-4 pb-2 sm:px-6">
          <div>
            <CardTitle className="text-base font-medium">
              Phân tích kịch bản doanh thu năm
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Dự báo dựa trên các điều kiện kinh doanh khác nhau
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          {scenarios.map((scenario, index) => (
            <div
              key={scenario.name}
              className="min-w-0 animate-in rounded-lg border border-border bg-secondary/50 p-4 transition-[border-color] duration-300 fade-in slide-in-from-right-2 hover:border-muted-foreground/30 motion-reduce:animate-none motion-reduce:transition-none"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-3 flex flex-col items-start justify-between gap-2 min-[390px]:flex-row min-[390px]:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="h-8 w-2 rounded-full"
                    style={{
                      backgroundColor: scenarioColorMap[scenario.color],
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground break-words">
                      {scenario.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {scenario.probability}% xác suất xảy ra
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-xl font-semibold text-foreground tabular-nums">
                  {(scenario.revenue / 1000000000).toFixed(1)} tỷ
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  role="progressbar"
                  aria-label={`Xác suất kịch bản ${scenario.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={scenario.probability}
                  className="h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none"
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
                <div className="flex flex-col items-start justify-between gap-2 text-xs sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground tabular-nums">
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
                    className={`font-medium tabular-nums ${scenario.growthRate >= 0 ? "text-accent" : "text-destructive"}`}
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
