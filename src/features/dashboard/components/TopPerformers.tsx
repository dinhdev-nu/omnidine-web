import { Trophy, TrendingUp } from "lucide-react";

interface Performer {
    name: string;
    deals: number;
    revenue: string;
    change: string;
    rank: number;
}

const performers: Performer[] = [
    { name: "Nguyễn Văn A", deals: 24, revenue: "487.500.000đ", change: "+15%", rank: 1 },
    { name: "Trần Văn B", deals: 19, revenue: "356.200.000đ", change: "+8%", rank: 2 },
    { name: "Lê Thị C", deals: 17, revenue: "312.800.000đ", change: "+12%", rank: 3 },
    { name: "Phạm Văn D", deals: 15, revenue: "289.400.000đ", change: "+5%", rank: 4 },
    { name: "Hoàng Thị E", deals: 14, revenue: "267.100.000đ", change: "+9%", rank: 5 },
];

export function TopPerformers() {
    return (
        <section className="min-w-0 animate-in rounded-xl border border-border bg-card p-4 duration-500 fade-in slide-in-from-bottom-4 motion-reduce:animate-none sm:p-5 delay-300">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground">Nhân viên xuất sắc</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Dẫn đầu tháng này</p>
                </div>
                <div className="flex items-center gap-1 text-warning">
                    <Trophy aria-hidden="true" className="w-5 h-5" />
                </div>
            </div>

            <div className="space-y-3">
                {performers.map((person, index) => (
                    <div
                        key={person.name}
                        className="group flex min-w-0 animate-in flex-col items-start gap-3 rounded-lg p-3 transition-colors duration-200 fade-in slide-in-from-right-2 hover:bg-secondary/50 motion-reduce:animate-none motion-reduce:transition-none sm:flex-row sm:items-center sm:justify-between"
                        style={{ animationDelay: `${(index + 4) * 100}ms`, animationFillMode: "both" }}
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="relative shrink-0">
                                <div aria-hidden="true" className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/80 to-chart-1 flex items-center justify-center text-sm font-semibold text-white">
                                    {person.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                {person.rank <= 3 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warning text-[10px] font-bold flex items-center justify-center text-white">
                                        {person.rank}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground break-words">{person.name}</p>
                                <p className="text-xs text-muted-foreground">{person.deals} giao dịch chốt</p>
                            </div>
                        </div>

                        <div className="w-full text-left tabular-nums sm:w-auto sm:shrink-0 sm:text-right">
                            <p className="text-sm font-semibold text-foreground">{person.revenue}</p>
                            <div className="flex items-center justify-end gap-1 text-xs text-success">
                                <TrendingUp aria-hidden="true" className="w-3 h-3" />
                                {person.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
