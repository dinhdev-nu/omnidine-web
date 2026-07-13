import {
  Area,
  CartesianGrid,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useReducedMotion } from "./use-reduced-motion"

interface RevenueDataPoint {
  month: string
  revenue: number
  target: number
}

const data: RevenueDataPoint[] = [
  { month: "Jan", revenue: 186000, target: 180000 },
  { month: "Feb", revenue: 205000, target: 190000 },
  { month: "Mar", revenue: 237000, target: 200000 },
  { month: "Apr", revenue: 273000, target: 220000 },
  { month: "May", revenue: 209000, target: 230000 },
  { month: "Jun", revenue: 314000, target: 250000 },
  { month: "Jul", revenue: 352000, target: 270000 },
  { month: "Aug", revenue: 389000, target: 290000 },
  { month: "Sep", revenue: 421000, target: 310000 },
  { month: "Oct", revenue: 458000, target: 330000 },
  { month: "Nov", revenue: 492000, target: 350000 },
  { month: "Dec", revenue: 547000, target: 380000 },
]

export function RevenueChart() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="min-h-[380px] min-w-0 animate-in rounded-xl border border-border bg-card p-4 duration-500 fade-in slide-in-from-bottom-4 motion-reduce:animate-none sm:p-5">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground">
            Xu hướng doanh thu
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Hiệu suất hàng tháng so với mục tiêu
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">Doanh thu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">Mục tiêu</span>
          </div>
        </div>
      </div>

      <div
        role="img"
        aria-label="Biểu đồ doanh thu và mục tiêu theo tháng từ tháng 1 đến tháng 12"
        className="h-[240px] min-w-0 sm:h-[280px]"
      >
          <AreaChart
            responsive
            style={{ width: "100%", height: "100%" }}
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="oklch(0.7 0.18 220)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="oklch(0.7 0.18 220)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="oklch(0.7 0.18 145)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="oklch(0.7 0.18 145)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.22 0.005 260)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                tickFormatter={(value: number) => `$${value / 1000}k`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.12 0.005 260)",
                  border: "1px solid oklch(0.22 0.005 260)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "oklch(0.95 0 0)", fontWeight: 600 }}
                formatter={(value) => [
                  `$${(Number(value) / 1000).toFixed(0)}k`,
                  "",
                ]}
              />
              <Area
                type="monotone"
                dataKey="target"
                isAnimationActive={!shouldReduceMotion}
                stroke="oklch(0.7 0.18 145)"
                strokeWidth={2}
                fill="url(#targetGradient)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                isAnimationActive={!shouldReduceMotion}
                stroke="oklch(0.7 0.18 220)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                dot={false}
              />
          </AreaChart>
      </div>
    </section>
  )
}
