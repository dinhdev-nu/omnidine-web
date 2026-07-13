import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock, CheckCircle2, XCircle, type LucideIcon } from "lucide-react";

type DealStatus = "won" | "pending" | "lost";

interface Deal {
    company: string;
    value: string;
    status: DealStatus;
    date: string;
    rep: string;
}

interface StatusConfig {
    icon: LucideIcon;
    color: string;
    bg: string;
    label: string;
}

const deals: Deal[] = [
    {
        company: "OmniDine Corp",
        value: "125.000.000đ",
        status: "won",
        date: "2 giờ trước",
        rep: "Nguyễn Văn A",
    },
    {
        company: "TechStart Inc",
        value: "89.500.000đ",
        status: "pending",
        date: "5 giờ trước",
        rep: "Trần Văn B",
    },
    {
        company: "GlobalFin",
        value: "245.000.000đ",
        status: "pending",
        date: "1 ngày trước",
        rep: "Lê Thị C",
    },
    {
        company: "DataSync Solutions",
        value: "67.800.000đ",
        status: "lost",
        date: "2 ngày trước",
        rep: "Phạm Văn D",
    },
    {
        company: "CloudBase Ltd",
        value: "178.000.000đ",
        status: "won",
        date: "3 ngày trước",
        rep: "Nguyễn Văn A",
    },
];

const statusConfig: Record<DealStatus, StatusConfig> = {
    won: {
        icon: CheckCircle2,
        color: "text-success",
        bg: "bg-success/10",
        label: "Thành công",
    },
    pending: {
        icon: Clock,
        color: "text-warning",
        bg: "bg-warning/10",
        label: "Đang chờ",
    },
    lost: {
        icon: XCircle,
        color: "text-destructive",
        bg: "bg-destructive/10",
        label: "Thất bại",
    },
};

export function RecentDeals() {
    return (
        <section className="min-w-0 animate-in rounded-xl border border-border bg-card p-4 duration-500 fade-in slide-in-from-bottom-4 motion-reduce:animate-none sm:p-5 delay-200">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground">Giao dịch gần đây</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Hoạt động mới nhất</p>
                </div>
                <button
                    type="button"
                    disabled
                    title="Chưa hỗ trợ xem tất cả giao dịch"
                    aria-label="Xem tất cả giao dịch (chưa khả dụng)"
                    className="flex min-h-11 shrink-0 items-center gap-1 rounded-md px-2 text-sm font-medium text-muted-foreground opacity-60 disabled:cursor-not-allowed"
                >
                    Xem tất cả
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                </button>
            </div>

            <div className="space-y-3">
                {deals.map((deal, index) => {
                    const status = statusConfig[deal.status];
                    const StatusIcon = status.icon;

                    return (
                        <div
                            key={deal.company}
                            className="group flex min-w-0 animate-in flex-col items-start gap-3 rounded-lg p-3 transition-colors duration-200 fade-in slide-in-from-left-2 hover:bg-secondary/50 motion-reduce:animate-none motion-reduce:transition-none sm:flex-row sm:items-center sm:justify-between"
                            style={{ animationDelay: `${(index + 3) * 100}ms`, animationFillMode: "both" }}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-muted-foreground transition-[background-color,color] duration-200 group-hover:bg-accent/10 group-hover:text-accent motion-reduce:transition-none">
                                    {deal.company.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground break-words">{deal.company}</p>
                                    <p className="text-xs text-muted-foreground break-words">{deal.rep} • {deal.date}</p>
                                </div>
                            </div>

                            <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:shrink-0 sm:justify-end">
                                <span className="text-sm font-semibold text-foreground tabular-nums">{deal.value}</span>
                                <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", status.bg, status.color)}>
                                    <StatusIcon aria-hidden="true" className="w-3 h-3" />
                                    {status.label}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
