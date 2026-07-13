import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useReducedMotion } from "@/features/dashboard/components/charts/use-reduced-motion"
import { forecastData } from "./forecasting.data"

export function ForecastRevenueChart() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Card className="min-w-0 border-border bg-card">
      <CardHeader className="px-4 pb-2 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
          <CardTitle className="text-base font-medium">
            Dự báo vs Doanh thu thực tế
          </CardTitle>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div aria-hidden="true" className="h-3 w-3 rounded-full bg-accent" />
              <span className="text-muted-foreground">Thực tế</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div aria-hidden="true" className="h-3 w-3 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Dự báo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div aria-hidden="true" className="h-3 w-3 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Chỉ tiêu</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div role="img" aria-label="Biểu đồ dự báo, doanh thu thực tế và chỉ tiêu theo tháng" className="h-[250px] min-w-0 sm:h-[300px]">
            <AreaChart
              responsive
              style={{ width: "100%", height: "100%" }}
              data={forecastData}
            >
                <defs>
                  <linearGradient
                    id="actualGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="oklch(0.7 0.18 145)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.7 0.18 145)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="forecastGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="oklch(0.7 0.18 220)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.7 0.18 220)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.22 0.005 260)"
                />
                <XAxis dataKey="month" stroke="oklch(0.65 0 0)" fontSize={12} />
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
                    `${(Number(value) / 1000000000).toFixed(1)} tỷ`,
                    "",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  isAnimationActive={!shouldReduceMotion}
                  stroke="oklch(0.65 0 0)"
                  strokeDasharray="5 5"
                  fill="none"
                  strokeWidth={1}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  isAnimationActive={!shouldReduceMotion}
                  stroke="oklch(0.7 0.18 220)"
                  fill="url(#forecastGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  isAnimationActive={!shouldReduceMotion}
                  stroke="oklch(0.7 0.18 145)"
                  fill="url(#actualGradient)"
                  strokeWidth={2}
                />
            </AreaChart>
        </div>
      </CardContent>
    </Card>
  )
}
