import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    changeType: "positive" | "negative" | "neutral";
    icon: LucideIcon;
    delay?: number;
}

export function MetricCard({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    delay = 0,
}: MetricCardProps) {
    return (
        <div
            className="group relative min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 transition-[border-color] duration-300 hover:border-accent/50 motion-reduce:animate-none motion-reduce:transition-none animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${delay * 100}ms`, animationFillMode: "both" }}
        >
            {/* Subtle gradient on hover */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
            />

            <div className="relative">
                <div className="flex items-start justify-between mb-3">
                    <span className="min-w-0 text-sm font-medium text-muted-foreground break-words">
                        {title}
                    </span>
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary transition-colors duration-300 group-hover:bg-accent/10 motion-reduce:transition-none">
                        <Icon aria-hidden="true" className="size-4 text-muted-foreground transition-colors duration-300 group-hover:text-accent motion-reduce:transition-none" />
                    </div>
                </div>

                <div className="flex min-w-0 flex-wrap items-end gap-x-3 gap-y-1">
                    <span className="min-w-0 text-2xl font-bold tracking-tight text-foreground tabular-nums break-words lg:text-3xl">
                        {value}
                    </span>
                    <div
                        className={cn(
                            "mb-1 flex shrink-0 items-center gap-1 text-sm font-medium tabular-nums",
                            changeType === "positive" && "text-success",
                            changeType === "negative" && "text-destructive",
                            changeType === "neutral" && "text-muted-foreground"
                        )}
                    >
                        {changeType === "positive" && <TrendingUp aria-hidden="true" className="size-3.5" />}
                        {changeType === "negative" && <TrendingDown aria-hidden="true" className="size-3.5" />}
                        <span>{change}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
