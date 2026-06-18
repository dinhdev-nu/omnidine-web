import { memo, Suspense, type ElementType } from "react"
import { cn } from "@/lib/utils"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Clock,
  ChevronRight,
} from "lucide-react"
import {
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/features/dashboard/components/charts/lazy-recharts"

interface ConversionDataPoint {
  month: string
  rate: number
}

interface SourceDataItem {
  name: string
  value: number
  color: string
}

interface Report {
  id: string
  name: string
  type: string
  date: string
  status: "ready" | "generating"
}

interface ReportCardProps {
  title: string
  description: string
  icon: ElementType
  color: string
  index: number
}

const conversionData: ConversionDataPoint[] = [
  { month: "Th1", rate: 18 },
  { month: "Th2", rate: 22 },
  { month: "Th3", rate: 19 },
  { month: "Th4", rate: 25 },
  { month: "Th5", rate: 23 },
  { month: "Th6", rate: 28 },
  { month: "Th7", rate: 26 },
  { month: "Th8", rate: 31 },
  { month: "Th9", rate: 29 },
  { month: "Th10", rate: 32 },
  { month: "Th11", rate: 35 },
  { month: "Th12", rate: 38 },
]

const sourceData: SourceDataItem[] = [
  { name: "Trực tiếp", value: 35, color: "oklch(0.7 0.18 220)" },
  { name: "Giới thiệu", value: 25, color: "oklch(0.7 0.18 145)" },
  { name: "Tự nhiên", value: 20, color: "oklch(0.75 0.18 55)" },
  { name: "Quảng cáo", value: 15, color: "oklch(0.65 0.2 25)" },
  { name: "Mạng XH", value: 5, color: "oklch(0.7 0.15 300)" },
]

const reports: Report[] = [
  {
    id: "1",
    name: "Tổng kết bán hàng tháng",
    type: "Bán hàng",
    date: "20/01/2024",
    status: "ready",
  },
  {
    id: "2",
    name: "Phân tích hiệu suất Quý 4",
    type: "Hiệu suất",
    date: "18/01/2024",
    status: "ready",
  },
  {
    id: "3",
    name: "Dự báo quy trình",
    type: "Dự báo",
    date: "15/01/2024",
    status: "ready",
  },
  {
    id: "4",
    name: "Báo cáo năng suất đội",
    type: "Đội nhóm",
    date: "12/01/2024",
    status: "generating",
  },
  {
    id: "5",
    name: "Phân tích nguồn khách hàng tiềm năng",
    type: "Marketing",
    date: "10/01/2024",
    status: "ready",
  },
]

const quickReportCards = [
  {
    title: "Tổng kết bán hàng",
    description: "Doanh thu và chỉ số giao dịch tháng",
    icon: BarChart3,
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    title: "Tỉ lệ chuyển đổi",
    description: "Phân tích hiệu suất kênh",
    icon: TrendingUp,
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Nguồn khách hàng tiềm năng",
    description: "Phân bổ theo kênh",
    icon: PieChartIcon,
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    title: "Dự báo",
    description: "Dự đoán doanh thu & chỉ tiêu",
    icon: Calendar,
    color: "bg-chart-5/10 text-chart-5",
  },
]

const ReportCard = memo(function ReportCard({
  title,
  description,
  icon: Icon,
  color,
  index,
}: ReportCardProps) {
  return (
    <div
      className="group animate-in cursor-pointer rounded-xl border border-border bg-card p-5 transition-all duration-300 fade-in slide-in-from-bottom-4 hover:border-accent/50"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      <div
        className={cn(
          "mb-4 flex h-10 w-10 items-center justify-center rounded-lg",
          color
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mb-4 text-xs text-muted-foreground">{description}</p>
      <button
        type="button"
        className="flex items-center gap-1 text-xs font-medium text-accent transition-all duration-200 group-hover:gap-2"
      >
        Xem báo cáo
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  )
})

export function ReportsSection() {
  return (
    <div className="space-y-6">
      {/* Quick report cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickReportCards.map((card, index) => (
          <ReportCard key={card.title} {...card} index={index} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Conversion rate trend */}
        <div className="animate-in rounded-xl border border-border bg-card p-5 delay-200 duration-500 fade-in slide-in-from-bottom-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Xu hướng tỉ lệ chuyển đổi
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Chuyển đổi từ khách tiềm năng thành giao dịch
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-success">
              <TrendingUp className="h-4 w-4" />
              +111% YoY
            </div>
          </div>
          <div className="h-[250px]">
            <Suspense fallback={<div className="h-full" />}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={conversionData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
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
                    tickFormatter={(value) => `${value}%`}
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
                    formatter={(value) => [`${value}%`, "Tỉ lệ chuyển đổi"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="oklch(0.7 0.18 145)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Suspense>
          </div>
        </div>

        {/* Lead sources pie chart */}
        <div className="animate-in rounded-xl border border-border bg-card p-5 delay-300 duration-500 fade-in slide-in-from-bottom-4">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-foreground">
              Nguồn khách tiềm năng
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Khách tiềm năng đến từ đâu
            </p>
          </div>
          <div className="flex items-center gap-8">
            <div className="h-[180px] w-[180px]">
              <Suspense fallback={<div className="h-full" />}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sourceData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Suspense>
            </div>
            <div className="flex-1 space-y-3">
              {sourceData.map((source, index) => (
                <div
                  key={source.name}
                  className="flex animate-in items-center justify-between fade-in slide-in-from-right-2"
                  style={{
                    animationDelay: `${(index + 5) * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm text-foreground">
                      {source.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {source.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent reports table */}
      <div className="animate-in overflow-hidden rounded-xl border border-border bg-card delay-400 duration-500 fade-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Báo cáo gần đây
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Báo cáo đã tạo của bạn
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <FileText className="h-4 w-4" />
            Tạo mới
          </button>
        </div>
        <div className="divide-y divide-border">
          {reports.map((report, index) => (
            <div
              key={report.id}
              className="flex animate-in cursor-pointer items-center justify-between px-5 py-4 transition-colors duration-150 fade-in slide-in-from-left-2 hover:bg-secondary/30"
              style={{
                animationDelay: `${(index + 6) * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {report.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-secondary px-1.5 py-0.5">
                      {report.type}
                    </span>
                    <span>•</span>
                    <span>{report.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {report.status === "generating" ? (
                  <div className="flex items-center gap-2 text-xs text-warning">
                    <Clock className="h-4 w-4 animate-pulse" />
                    Đang tạo...
                  </div>
                ) : (
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
                  >
                    <Download className="h-4 w-4" />
                    Tải xuống
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
