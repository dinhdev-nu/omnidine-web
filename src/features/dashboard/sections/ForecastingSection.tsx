import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import {
  Area,
  CartesianGrid,
  Bar,
  BarChart,
  Legend,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/features/dashboard/components/charts/lazy-recharts"

interface ForecastDataPoint {
  month: string
  actual: number | null
  forecast: number
  target: number
}

interface QuarterlyData {
  quarter: string
  actual: number | null
  forecast: number
  target: number
  orderCount: number
  avgOrderValue: number
}

interface RiskFactor {
  id: number
  title: string
  description: string
  impact: string
  severity: "high" | "medium"
  affectedPeriods: string[]
}

interface Scenario {
  name: string
  description: string
  probability: number
  revenue: number
  orderCount: number
  avgOrderValue: number
  growthRate: number
  color: "accent" | "chart-1" | "chart-4"
}

const forecastData: ForecastDataPoint[] = [
  {
    month: "Th1",
    actual: 10500000000,
    forecast: 10000000000,
    target: 11250000000,
  },
  {
    month: "Th2",
    actual: 12000000000,
    forecast: 11500000000,
    target: 11250000000,
  },
  {
    month: "Th3",
    actual: 12750000000,
    forecast: 12500000000,
    target: 12500000000,
  },
  {
    month: "Th4",
    actual: 12125000000,
    forecast: 13000000000,
    target: 12500000000,
  },
  {
    month: "Th5",
    actual: 14000000000,
    forecast: 13750000000,
    target: 13750000000,
  },
  {
    month: "Th6",
    actual: 15500000000,
    forecast: 15000000000,
    target: 13750000000,
  },
  { month: "Th7", actual: null, forecast: 16250000000, target: 15000000000 },
  { month: "Th8", actual: null, forecast: 17000000000, target: 15000000000 },
  { month: "Th9", actual: null, forecast: 18000000000, target: 16250000000 },
  { month: "Th10", actual: null, forecast: 18750000000, target: 16250000000 },
  { month: "Th11", actual: null, forecast: 20000000000, target: 17500000000 },
  { month: "Th12", actual: null, forecast: 21250000000, target: 17500000000 },
]

const quarterlyForecast: QuarterlyData[] = [
  {
    quarter: "Quý 1",
    actual: 35250000000,
    forecast: 35000000000,
    target: 38000000000,
    orderCount: 2850,
    avgOrderValue: 12368421,
  },
  {
    quarter: "Quý 2",
    actual: null,
    forecast: 42000000000,
    target: 45000000000,
    orderCount: 3200,
    avgOrderValue: 13125000,
  },
  {
    quarter: "Quý 3",
    actual: null,
    forecast: 48000000000,
    target: 50000000000,
    orderCount: 3600,
    avgOrderValue: 13333333,
  },
  {
    quarter: "Quý 4",
    actual: null,
    forecast: 55000000000,
    target: 58000000000,
    orderCount: 4000,
    avgOrderValue: 13750000,
  },
]

const riskFactors: RiskFactor[] = [
  {
    id: 1,
    title: "Rủi ro mùa mưa",
    description: "Dự báo mưa kéo dài 2 tuần, ảnh hưởng lượng khách",
    impact: "-3,5 tỷ",
    severity: "high",
    affectedPeriods: ["Tuần 3 tháng 7", "Tuần 4 tháng 7", "Tuần 1 tháng 8"],
  },
  {
    id: 2,
    title: "Thiếu nguồn nguyên liệu",
    description: "Giá hải sản tăng 25%, ảnh hưởng menu chính",
    impact: "-2,8 tỷ",
    severity: "medium",
    affectedPeriods: ["Quý 3", "Quý 4"],
  },
  {
    id: 3,
    title: "Cạnh tranh địa phương",
    description: "2 nhà hàng mới mở trong bán kính 500m",
    impact: "-4,2 tỷ",
    severity: "high",
    affectedPeriods: ["Quý 2", "Quý 3"],
  },
]

const scenarios: Scenario[] = [
  {
    name: "Bảo thủ",
    description:
      "Kinh doanh chậm do mưa nhiều, dịch bệnh, hoặc suy thoái kinh tế",
    probability: 85,
    revenue: 155000000000,
    orderCount: 11500,
    avgOrderValue: 13478260,
    growthRate: -5,
    color: "chart-4",
  },
  {
    name: "Cơ sở",
    description: "Hoạt động bình thường, duy trì xu hướng tăng trưởng ổn định",
    probability: 65,
    revenue: 185000000000,
    orderCount: 13600,
    avgOrderValue: 13602941,
    growthRate: 12,
    color: "accent",
  },
  {
    name: "Lạc quan",
    description: "Kinh doanh sôi động nhờ sự kiện lớn, khuyến mãi thành công",
    probability: 40,
    revenue: 215000000000,
    orderCount: 16000,
    avgOrderValue: 13437500,
    growthRate: 28,
    color: "chart-1",
  },
]

const scenarioColorMap: Record<Scenario["color"], string> = {
  accent: "oklch(0.7 0.18 145)",
  "chart-1": "oklch(0.7 0.18 220)",
  "chart-4": "oklch(0.65 0.2 25)",
}

const kpiStats = [
  {
    label: "Dự báo Quý 2",
    value: "42 tỷ",
    subtext: "Chỉ tiêu: 45.0 tỷ",
    icon: Target,
    trend: "+17%",
    trendUp: true,
  },
  {
    label: "Độ chính xác dự báo",
    value: "94%",
    subtext: "TB 6 tháng qua",
    icon: CheckCircle2,
    trend: "+2.3%",
    trendUp: true,
  },
  {
    label: "Tỷ lệ sử dụng bàn",
    value: "68%",
    subtext: "trung bình các ca",
    icon: TrendingUp,
    trend: "+5.2%",
    trendUp: true,
  },
  {
    label: "Doanh thu rủi ro",
    value: "10,5 tỷ",
    subtext: "3 yếu tố cảnh báo",
    icon: AlertTriangle,
    trend: "-12%",
    trendUp: false,
  },
]

export function ForecastingSection() {
  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Dự báo bán hàng
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dự đoán dựa trên AI từ dữ liệu lịch sử và phân tích quy trình
          </p>
        </div>
        <div className="relative z-20 flex items-center gap-3">
          <Select defaultValue="quarterly">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Theo tháng</SelectItem>
              <SelectItem value="quarterly">Theo quý</SelectItem>
              <SelectItem value="annual">Theo năm</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {kpiStats.map((stat, index) => (
          <Card
            key={stat.label}
            className="border-border bg-card transition-all duration-500"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {stat.subtext}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <stat.icon
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
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {stat.trend}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              Dự báo vs Doanh thu thực tế
            </CardTitle>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <span className="text-muted-foreground">Thực tế</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-chart-1" />
                <span className="text-muted-foreground">Dự báo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">Chỉ tiêu</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Suspense fallback={<div className="h-full" />}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
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
                  <XAxis
                    dataKey="month"
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
                      `${(Number(value) / 1000000000).toFixed(1)} tỷ`,
                      "",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="oklch(0.65 0 0)"
                    strokeDasharray="5 5"
                    fill="none"
                    strokeWidth={1}
                  />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    stroke="oklch(0.7 0.18 220)"
                    fill="url(#forecastGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="oklch(0.7 0.18 145)"
                    fill="url(#actualGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Suspense>
          </div>
        </CardContent>
      </Card>

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
                        <span style={{ color: "oklch(0.65 0 0)" }}>
                          {value}
                        </span>
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

      {/* Risk Factors */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              Yếu tố rủi ro
            </CardTitle>
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
                      <p className="font-medium text-foreground">
                        {risk.title}
                      </p>
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
    </div>
  )
}
