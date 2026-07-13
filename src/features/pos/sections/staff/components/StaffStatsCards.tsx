import Icon from "../../../ui/AppIcon"

interface StaffStats {
  total: number
  active: number
  onLeave: number
  terminated: number
}

interface StaffStatsCardsProps {
  stats: StaffStats
}

const StaffStatsCards = ({ stats }: StaffStatsCardsProps) => {
  const cards = [
    {
      key: "total",
      label: "Tổng nhân viên",
      value: stats.total,
      icon: "Users",
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      key: "active",
      label: "Đang làm việc (trang này)",
      value: stats.active,
      icon: "UserCheck",
      iconClassName: "bg-success/10 text-success",
    },
    {
      key: "on-leave",
      label: "Đang nghỉ (trang này)",
      value: stats.onLeave,
      icon: "UserX",
      iconClassName: "bg-warning/10 text-warning",
    },
    {
      key: "terminated",
      label: "Đã nghỉ việc (trang này)",
      value: stats.terminated,
      icon: "UserMinus",
      iconClassName: "bg-error/10 text-error",
    },
  ]

  return (
    <dl
      aria-label="Thống kê nhân viên"
      className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
    >
      {cards.map((card) => (
        <div
          key={card.key}
          className="flex min-w-0 flex-col items-start gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:p-4"
        >
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${card.iconClassName}`}
          >
            <Icon name={card.icon} size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <dt className="text-xs leading-snug break-words text-muted-foreground sm:text-sm">
              {card.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-card-foreground">
              {card.value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

export default StaffStatsCards
