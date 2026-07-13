import { memo } from "react"
import { cn } from "@/lib/utils"
import {
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  MoreHorizontal,
} from "lucide-react"
import {
  Bar,
  CartesianGrid,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useReducedMotion } from "@/features/dashboard/components/charts/use-reduced-motion"

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  avatar: string
  deals: number
  revenue: number
  quota: number
  change: number
  rank: number
}

interface PerformanceDataPoint {
  name: string
  revenue: number
  quota: number
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    role: "Chuyên viên cấp cao",
    email: "an.nguyen@congty.vn",
    avatar: "NA",
    deals: 24,
    revenue: 12187500000,
    quota: 11250000000,
    change: 15,
    rank: 1,
  },
  {
    id: "2",
    name: "Trần Minh Tuấn",
    role: "Chuyên viên kinh doanh",
    email: "tuan.tran@congty.vn",
    avatar: "TT",
    deals: 19,
    revenue: 8905000000,
    quota: 10000000000,
    change: 8,
    rank: 2,
  },
  {
    id: "3",
    name: "Lê Thị Mai",
    role: "Chuyên viên cấp cao",
    email: "mai.le@congty.vn",
    avatar: "LM",
    deals: 17,
    revenue: 7820000000,
    quota: 8750000000,
    change: 12,
    rank: 3,
  },
  {
    id: "4",
    name: "Phạm Hoàng Nam",
    role: "Chuyên viên kinh doanh",
    email: "nam.pham@congty.vn",
    avatar: "PN",
    deals: 15,
    revenue: 7235000000,
    quota: 8750000000,
    change: -5,
    rank: 4,
  },
  {
    id: "5",
    name: "Hoàng Thị Lan",
    role: "Chuyên viên kinh doanh",
    email: "lan.hoang@congty.vn",
    avatar: "HL",
    deals: 14,
    revenue: 6677500000,
    quota: 7500000000,
    change: 9,
    rank: 5,
  },
]

const performanceData: PerformanceDataPoint[] = [
  { name: "An", revenue: 12187, quota: 11250 },
  { name: "Tuấn", revenue: 8905, quota: 10000 },
  { name: "Mai", revenue: 7820, quota: 8750 },
  { name: "Nam", revenue: 7235, quota: 8750 },
  { name: "Lan", revenue: 6677, quota: 7500 },
]

const totalRevenue = teamMembers.reduce((acc, m) => acc + m.revenue, 0)
const totalDeals = teamMembers.reduce((acc, m) => acc + m.deals, 0)
const avgQuotaAttainment =
  teamMembers.reduce((acc, m) => acc + (m.revenue / m.quota) * 100, 0) /
  teamMembers.length

interface TeamMemberCardProps {
  member: TeamMember
  index: number
}

const TeamMemberCard = memo(function TeamMemberCard({
  member,
  index,
}: TeamMemberCardProps) {
  const quotaPercentage = (member.revenue / member.quota) * 100
  const isAboveQuota = quotaPercentage >= 100

  return (
    <div
      className="group min-w-0 animate-in rounded-xl border border-border bg-card p-4 transition-[border-color] duration-300 fade-in slide-in-from-bottom-4 hover:border-accent/50 motion-reduce:animate-none motion-reduce:transition-none sm:p-5"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      <div className="mb-4 flex min-w-0 items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <div aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-accent/80 to-chart-1 text-sm font-bold text-white">
              {member.avatar}
            </div>
            {member.rank <= 3 && (
              <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-warning">
                <Trophy aria-hidden="true" className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-foreground break-words">
              {member.name}
            </h4>
            <p className="text-xs text-muted-foreground break-words">{member.role}</p>
          </div>
        </div>
        <button
          type="button"
          disabled
          title="Thao tác thành viên chưa khả dụng"
          aria-label={`Thao tác cho ${member.name} (chưa khả dụng)`}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Doanh thu</p>
          <p className="text-lg font-bold text-foreground tabular-nums">
            {(member.revenue / 1000000000).toFixed(1)} tỷ
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Giao dịch chốt</p>
          <p className="text-lg font-bold text-foreground tabular-nums">{member.deals}</p>
        </div>
      </div>

      {/* Quota progress */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Đạt chỉ tiêu</span>
          <span
            className={cn(
              "font-medium",
              isAboveQuota ? "text-success" : "text-foreground"
            )}
          >
            {quotaPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            role="progressbar"
            aria-label={`Mức đạt chỉ tiêu của ${member.name}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(Math.round(quotaPercentage), 100)}
            className={cn(
              "h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none",
              isAboveQuota ? "bg-success" : "bg-accent"
            )}
            style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Change indicator */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <a
            href={`mailto:${member.email}`}
            title={`Gửi email đến ${member.email}`}
            aria-label={`Gửi email cho ${member.name}`}
            className="flex size-11 touch-manipulation items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground motion-reduce:transition-none"
          >
            <Mail aria-hidden="true" className="h-4 w-4" />
          </a>
          <button
            type="button"
            disabled
            title="Chưa có số điện thoại của thành viên"
            aria-label={`Gọi điện cho ${member.name} (chưa có số điện thoại)`}
            className="flex size-11 items-center justify-center rounded-lg bg-secondary text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            member.change >= 0 ? "text-success" : "text-destructive"
          )}
        >
          {member.change >= 0 ? (
            <TrendingUp aria-hidden="true" className="h-4 w-4" />
          ) : (
            <TrendingDown aria-hidden="true" className="h-4 w-4" />
          )}
          {member.change >= 0 ? "+" : ""}
          {member.change}%
        </div>
      </div>
    </div>
  )
})

export function TeamSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="min-w-0 space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="animate-in rounded-xl border border-border bg-card p-5 duration-500 fade-in slide-in-from-bottom-4 motion-reduce:animate-none">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Target aria-hidden="true" className="h-5 w-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">Doanh thu đội</span>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {(totalRevenue / 1000000000).toFixed(1)} tỷ
          </p>
        </div>
        <div className="animate-in rounded-xl border border-border bg-card p-5 delay-100 duration-500 fade-in slide-in-from-bottom-4 motion-reduce:animate-none">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
              <TrendingUp aria-hidden="true" className="h-5 w-5 text-chart-1" />
            </div>
            <span className="text-sm text-muted-foreground">
              Tổng giao dịch
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{totalDeals}</p>
        </div>
        <div className="animate-in rounded-xl border border-border bg-card p-5 delay-200 duration-500 fade-in slide-in-from-bottom-4 motion-reduce:animate-none">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Trophy aria-hidden="true" className="h-5 w-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">
              Đạt chỉ tiêu TB
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {avgQuotaAttainment.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Performance chart */}
      <section className="min-w-0 animate-in rounded-xl border border-border bg-card p-4 delay-150 duration-500 fade-in slide-in-from-bottom-4 motion-reduce:animate-none sm:p-5">
        <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-foreground">
              Doanh thu vs Chỉ tiêu
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              So sánh hiệu suất cá nhân
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Doanh thu (tr)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-chart-2" />
              <span className="text-muted-foreground">Chỉ tiêu (tr)</span>
            </div>
          </div>
        </div>
        <div role="img" aria-label="Biểu đồ doanh thu và chỉ tiêu của từng thành viên" className="h-[230px] min-w-0 sm:h-[250px]">
            <BarChart
              responsive
              style={{ width: "100%", height: "100%" }}
              data={performanceData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.22 0.005 260)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                  tickFormatter={(value) => `${value}tr`}
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
                  formatter={(value) => [`${value} triệu`, ""]}
                />
                <Bar
                  dataKey="quota"
                  isAnimationActive={!shouldReduceMotion}
                  fill="oklch(0.7 0.18 145)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="revenue"
                  isAnimationActive={!shouldReduceMotion}
                  fill="oklch(0.7 0.18 220)"
                  radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </div>
      </section>

      {/* Team members grid */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">
          Thành viên đội
        </h3>
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
