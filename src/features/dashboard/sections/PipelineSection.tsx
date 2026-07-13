import { memo } from "react";
import { cn } from "@/lib/utils";
import { Plus, MoreHorizontal, Clock, DollarSign, User, Building2 } from "lucide-react";

interface Deal {
    id: string;
    company: string;
    value: number;
    rep: string;
    daysInStage: number;
    probability: number;
}

interface Stage {
    id: string;
    name: string;
    total: number;
    deals: Deal[];
}

const initialStages: Stage[] = [
    {
        id: "lead",
        name: "Tiếp cận",
        total: 892000000,
        deals: [
            { id: "1", company: "Công nghệ Nexus", value: 45000000, rep: "Nguyễn A.", daysInStage: 3, probability: 20 },
            { id: "2", company: "Hệ thống Bright", value: 78000000, rep: "Trần B.", daysInStage: 5, probability: 25 },
            { id: "3", company: "CoreLogic VN", value: 32000000, rep: "Lê C.", daysInStage: 1, probability: 15 },
        ],
    },
    {
        id: "qualified",
        name: "Đủ điều kiện",
        total: 556000000,
        deals: [
            { id: "4", company: "DataPrime VN", value: 125000000, rep: "Phạm D.", daysInStage: 7, probability: 40 },
            { id: "5", company: "CloudNine Corp", value: 89000000, rep: "Nguyễn A.", daysInStage: 4, probability: 45 },
        ],
    },
    {
        id: "proposal",
        name: "Báo giá",
        total: 357000000,
        deals: [
            { id: "6", company: "TechForward", value: 167000000, rep: "Trần B.", daysInStage: 12, probability: 60 },
            { id: "7", company: "Innovate Plus", value: 95000000, rep: "Hoàng E.", daysInStage: 8, probability: 65 },
            { id: "8", company: "SmartGrid VN", value: 54000000, rep: "Lê C.", daysInStage: 6, probability: 55 },
        ],
    },
    {
        id: "negotiation",
        name: "Đàm phán",
        total: 179000000,
        deals: [
            { id: "9", company: "Enterprise Max", value: 245000000, rep: "Nguyễn A.", daysInStage: 15, probability: 80 },
            { id: "10", company: "GrowthLab", value: 112000000, rep: "Phạm D.", daysInStage: 10, probability: 75 },
        ],
    },
];

interface DealCardProps {
    deal: Deal;
    index: number;
}

const DealCard = memo(function DealCard({ deal, index }: DealCardProps) {
    return (
        <div
            className="group min-w-0 animate-in rounded-lg border border-border bg-background p-4 transition-[border-color] duration-200 fade-in slide-in-from-bottom-2 hover:border-accent/50 motion-reduce:animate-none motion-reduce:transition-none"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
        >
            <div className="mb-3 flex min-w-0 items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                        <Building2 aria-hidden="true" className="size-4 text-muted-foreground" />
                    </div>
                    <span className="min-w-0 truncate text-sm font-medium text-foreground">{deal.company}</span>
                </div>
                <button
                    type="button"
                    disabled
                    title="Thao tác giao dịch chưa khả dụng"
                    className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    )}
                    aria-label={`Thao tác cho ${deal.company} (chưa khả dụng)`}
                >
                    <MoreHorizontal aria-hidden="true" className="size-4" />
                </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-foreground font-semibold mb-3">
                <DollarSign aria-hidden="true" className="w-3.5 h-3.5 text-accent" />
                <span className="tabular-nums">${deal.value.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <User aria-hidden="true" className="w-3 h-3" />
                    {deal.rep}
                </div>
                <div className="flex items-center gap-1">
                    <Clock aria-hidden="true" className="w-3 h-3" />
                    {deal.daysInStage}d
                </div>
            </div>

            {/* Probability bar */}
            <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Xác suất</span>
                    <span className="text-foreground font-medium">{deal.probability}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                        role="progressbar"
                        aria-label={`Xác suất giao dịch ${deal.company}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={deal.probability}
                        className="h-full rounded-full bg-accent transition-[width] duration-500 motion-reduce:transition-none"
                        style={{ width: `${deal.probability}%` }}
                    />
                </div>
            </div>
        </div>
    );
});

export function PipelineSection() {
    return (
        <div className="min-w-0 space-y-6">
            {/* Header */}
            <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Quản lý và theo dõi quy trình bán hàng của bạn</p>
                </div>
                <button
                    type="button"
                    disabled
                    title="Thêm giao dịch chưa khả dụng"
                    aria-label="Thêm giao dịch (chưa khả dụng)"
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                    <Plus aria-hidden="true" className="w-4 h-4" />
                    Thêm giao dịch
                </button>
            </div>

            {/* Pipeline board */}
            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {initialStages.map((stage, stageIndex) => (
                    <div
                        key={stage.id}
                        className="min-w-0 animate-in rounded-xl border border-border bg-card p-4 duration-500 fade-in slide-in-from-bottom-4 motion-reduce:animate-none md:min-h-[500px]"
                        style={{ animationDelay: `${stageIndex * 100}ms`, animationFillMode: "both" }}
                    >
                        {/* Stage header */}
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2">
                                <h3 className="text-sm font-semibold text-foreground">{stage.name}</h3>
                                <span className="px-2 py-0.5 bg-secondary rounded-md text-xs font-medium text-muted-foreground">
                                    {stage.deals.length}
                                </span>
                            </div>
                            <span className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                                ${(stage.total / 1000).toFixed(0)}k
                            </span>
                        </div>

                        {/* Deals */}
                        <div className="space-y-3">
                            {stage.deals.map((deal, dealIndex) => (
                                <DealCard key={deal.id} deal={deal} index={dealIndex} />
                            ))}
                        </div>

                        {/* Add deal to stage */}
                        <button
                            type="button"
                            disabled
                            title={`Thêm giao dịch vào ${stage.name} chưa khả dụng`}
                            aria-label={`Thêm giao dịch vào ${stage.name} (chưa khả dụng)`}
                            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Plus aria-hidden="true" className="w-4 h-4" />
                            Thêm giao dịch
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
