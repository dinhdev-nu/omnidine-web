import { AlertTriangle, CheckCircle2, Target, TrendingUp } from "lucide-react"

export interface ForecastDataPoint {
  month: string
  actual: number | null
  forecast: number
  target: number
}

export interface QuarterlyData {
  quarter: string
  actual: number | null
  forecast: number
  target: number
  orderCount: number
  avgOrderValue: number
}

export interface RiskFactor {
  id: number
  title: string
  description: string
  impact: string
  severity: "high" | "medium"
  affectedPeriods: string[]
}

export interface Scenario {
  name: string
  description: string
  probability: number
  revenue: number
  orderCount: number
  avgOrderValue: number
  growthRate: number
  color: "accent" | "chart-1" | "chart-4"
}

export const forecastData: ForecastDataPoint[] = [
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

export const quarterlyForecast: QuarterlyData[] = [
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

export const riskFactors: RiskFactor[] = [
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

export const scenarios: Scenario[] = [
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

export const scenarioColorMap: Record<Scenario["color"], string> = {
  accent: "oklch(0.7 0.18 145)",
  "chart-1": "oklch(0.7 0.18 220)",
  "chart-4": "oklch(0.65 0.2 25)",
}

export const kpiStats = [
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
