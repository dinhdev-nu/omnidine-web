import { memo, Suspense } from "react"
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/features/dashboard/components/charts/lazy-recharts"

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
      className="group animate-in rounded-xl border border-border bg-card p-5 transition-all duration-300 fade-in slide-in-from-bottom-4 hover:border-accent/50"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent/80 to-chart-1 text-sm font-bold text-white">
              {member.avatar}
            </div>
            {member.rank <= 3 && (
              <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-warning">
                <Trophy className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {member.name}
            </h4>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-secondary hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Doanh thu</p>
          <p className="text-lg font-bold text-foreground">
            {(member.revenue / 1000000000).toFixed(1)} tỷ
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Giao dịch chốt</p>
          <p className="text-lg font-bold text-foreground">{member.deals}</p>
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
            className={cn(
              "h-full rounded-full transition-all duration-700",
              isAboveQuota ? "bg-success" : "bg-accent"
            )}
            style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Change indicator */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
          </button>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            member.change >= 0 ? "text-success" : "text-destructive"
          )}
        >
          {member.change >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {member.change >= 0 ? "+" : ""}
          {member.change}%
        </div>
      </div>
    </div>
  )
})

export function TeamSection() {
  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="animate-in rounded-xl border border-border bg-card p-5 duration-500 fade-in slide-in-from-bottom-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">Doanh thu đội</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {(totalRevenue / 1000000000).toFixed(1)} tỷ
          </p>
        </div>
        <div className="animate-in rounded-xl border border-border bg-card p-5 delay-100 duration-500 fade-in slide-in-from-bottom-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
              <TrendingUp className="h-5 w-5 text-chart-1" />
            </div>
            <span className="text-sm text-muted-foreground">
              Tổng giao dịch
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalDeals}</p>
        </div>
        <div className="animate-in rounded-xl border border-border bg-card p-5 delay-200 duration-500 fade-in slide-in-from-bottom-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Trophy className="h-5 w-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">
              Đạt chỉ tiêu TB
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {avgQuotaAttainment.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Performance chart */}
      <div className="animate-in rounded-xl border border-border bg-card p-5 delay-150 duration-500 fade-in slide-in-from-bottom-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Doanh thu vs Chỉ tiêu
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              So sánh hiệu suất cá nhân
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Doanh thu (tr)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-chart-2" />
              <span className="text-muted-foreground">Chỉ tiêu (tr)</span>
            </div>
          </div>
        </div>
        <div className="h-[250px]">
          <Suspense fallback={<div className="h-full" />}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
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
                  fill="oklch(0.7 0.18 145)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="revenue"
                  fill="oklch(0.7 0.18 220)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Suspense>
        </div>
      </div>

      {/* Team members grid */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">
          Thành viên đội
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
