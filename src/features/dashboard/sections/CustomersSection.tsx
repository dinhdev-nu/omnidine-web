import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Building2,
    Search,
    Plus,
    MapPin,
    Mail,
    Phone,
    DollarSign,
    Calendar,
    ExternalLink,
    Star,
    TrendingUp,
    TrendingDown,
    Filter,
} from "lucide-react";

interface Customer {
    id: number;
    name: string;
    industry: string;
    tier: "Doanh nghiệp" | "Tăng trưởng" | "Khởi đầu";
    location: string;
    contact: string;
    email: string;
    phone: string;
    totalRevenue: number;
    activeDeals: number;
    healthScore: number;
    trend: "up" | "down" | "stable";
    lastContact: string;
}

const customers: Customer[] = [
    {
        id: 1,
        name: "OmniDine Corporation",
        industry: "Công nghệ",
        tier: "Doanh nghiệp",
        location: "TP. Hồ Chí Minh",
        contact: "Nguyễn Văn A",
        email: "nva@omnidine.vn",
        phone: "0901 234 567",
        totalRevenue: 485000000,
        activeDeals: 3,
        healthScore: 92,
        trend: "up",
        lastContact: "2 ngày trước",
    },
    {
        id: 2,
        name: "GlobalTech Industries",
        industry: "Sản xuất",
        tier: "Doanh nghiệp",
        location: "Hà Nội",
        contact: "Trần Thị B",
        email: "ttb@globaltech.vn",
        phone: "0912 345 678",
        totalRevenue: 320000000,
        activeDeals: 2,
        healthScore: 85,
        trend: "up",
        lastContact: "1 tuần trước",
    },
    {
        id: 3,
        name: "Innovate Labs",
        industry: "Y tế",
        tier: "Tăng trưởng",
        location: "Đà Nẵng",
        contact: "Lê Văn C",
        email: "lvc@innovatelabs.vn",
        phone: "0923 456 789",
        totalRevenue: 156000000,
        activeDeals: 1,
        healthScore: 78,
        trend: "stable",
        lastContact: "3 ngày trước",
    },
    {
        id: 4,
        name: "DataStream Analytics",
        industry: "Dịch vụ dữ liệu",
        tier: "Tăng trưởng",
        location: "Cần Thơ",
        contact: "Phạm Thị D",
        email: "ptd@datastream.vn",
        phone: "0934 567 890",
        totalRevenue: 98000000,
        activeDeals: 2,
        healthScore: 65,
        trend: "down",
        lastContact: "2 tuần trước",
    },
    {
        id: 5,
        name: "NextGen Solutions",
        industry: "Tài chính",
        tier: "Khởi đầu",
        location: "Hải Phòng",
        contact: "Hoàng Văn E",
        email: "hve@nextgen.vn",
        phone: "0945 678 901",
        totalRevenue: 45000000,
        activeDeals: 1,
        healthScore: 88,
        trend: "up",
        lastContact: "Hôm qua",
    },
    {
        id: 6,
        name: "CloudFirst Inc",
        industry: "Dịch vụ đám mây",
        tier: "Doanh nghiệp",
        location: "Bình Dương",
        contact: "Vũ Thị F",
        email: "vtf@cloudfirst.vn",
        phone: "0956 789 012",
        totalRevenue: 275000000,
        activeDeals: 4,
        healthScore: 95,
        trend: "up",
        lastContact: "Hôm nay",
    },
];

const tierColors: Record<Customer["tier"], string> = {
    "Doanh nghiệp": "bg-accent/20 text-accent border-accent/30",
    "Tăng trưởng": "bg-chart-1/20 text-chart-1 border-chart-1/30",
    "Khởi đầu": "bg-muted text-muted-foreground border-border",
};

const totalRevenue = customers.reduce((acc, c) => acc + c.totalRevenue, 0);
const avgHealthScore = Math.round(
    customers.reduce((acc, c) => acc + c.healthScore, 0) / customers.length
);

const summaryStats = [
    {
        label: "Tổng khách hàng",
        value: customers.length.toString(),
        icon: Building2,
        color: "text-foreground",
    },
    {
        label: "Tổng doanh thu",
        value: `${(totalRevenue / 1000000000).toFixed(2)} tỷ đ`,
        icon: DollarSign,
        color: "text-accent",
    },
    {
        label: "Điểm sức khỏe TB",
        value: `${avgHealthScore}%`,
        icon: Star,
        color: "text-chart-3",
    },
    {
        label: "Giao dịch đang xử lý",
        value: customers.reduce((acc, c) => acc + c.activeDeals, 0).toString(),
        icon: TrendingUp,
        color: "text-chart-1",
    },
];

const tiers = ["Doanh nghiệp", "Tăng trưởng", "Khởi đầu"] as const;

export function CustomersSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTier, setSelectedTier] = useState<Customer["tier"] | null>(null);
    const filteredCustomers = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase("vi");
        return customers.filter((customer) => {
            const matchesTier = selectedTier === null || customer.tier === selectedTier;
            const matchesSearch = normalizedQuery.length === 0 || [
                customer.name,
                customer.industry,
                customer.location,
                customer.contact,
                customer.email,
                customer.phone,
            ].some((value) => value.toLocaleLowerCase("vi").includes(normalizedQuery));
            return matchesTier && matchesSearch;
        });
    }, [searchQuery, selectedTier]);

    return (
        <div className="min-w-0 space-y-6">
            {/* Summary Cards */}
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryStats.map((stat, index) => (
                    <Card
                        key={stat.label}
                        className="min-w-0 border-border bg-card transition-[border-color] duration-300 hover:border-muted-foreground/30 motion-reduce:transition-none"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className={`mt-1 text-2xl font-semibold tabular-nums ${stat.color}`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <stat.icon aria-hidden="true" className={`size-8 shrink-0 ${stat.color} opacity-50`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col items-stretch justify-between gap-4 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <div className="relative w-full sm:w-auto">
                        <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            aria-label="Tìm khách hàng"
                            name="customer-search"
                            type="search"
                            autoComplete="off"
                            spellCheck={false}
                            placeholder="Tìm khách hàng…"
                            className="w-full border-border bg-secondary pl-10 focus:border-accent sm:w-[280px]"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Filter aria-hidden="true" className="size-4 text-muted-foreground" />
                        {tiers.map((tier) => (
                            <Button
                                key={tier}
                                variant={selectedTier === tier ? "default" : "outline"}
                                size="sm"
                                aria-pressed={selectedTier === tier}
                                onClick={() => setSelectedTier((current) => current === tier ? null : tier)}
                            >
                                {tier}
                            </Button>
                        ))}
                    </div>
                </div>
                <Button className="w-full bg-accent text-white hover:bg-accent/90 sm:w-auto xl:shrink-0" disabled title="Tạo khách hàng chưa khả dụng">
                    <Plus aria-hidden="true" className="mr-2 size-4" />
                    Thêm khách hàng
                </Button>
            </div>

            {/* Customer Cards */}
            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {filteredCustomers.map((customer, index) => (
                    <Card
                        key={customer.id}
                        className="group min-w-0 animate-in border-border bg-card transition-[border-color] duration-300 fade-in slide-in-from-bottom-2 hover:border-accent/50 motion-reduce:animate-none motion-reduce:transition-none"
                        style={{ animationDelay: `${index * 75}ms` }}
                    >
                        <CardContent className="p-4 sm:p-5">
                            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <Avatar className="size-12 shrink-0">
                                        <AvatarFallback className="bg-secondary text-foreground font-semibold text-sm">
                                            {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-foreground break-words transition-colors group-hover:text-accent motion-reduce:transition-none">
                                            {customer.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{customer.industry}</p>
                                    </div>
                                </div>
                                <Badge className={`${tierColors[customer.tier]} shrink-0 border`}>
                                    {customer.tier}
                                </Badge>
                            </div>

                            <div className="mb-4 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                                        <span className="min-w-0 break-words">{customer.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail aria-hidden="true" className="size-3.5 shrink-0" />
                                        <span className="min-w-0 break-all">{customer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone aria-hidden="true" className="size-3.5 shrink-0" />
                                        <span className="min-w-0 break-words">{customer.phone}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Revenue</span>
                                        <span className="font-medium text-foreground tabular-nums">
                                            ${customer.totalRevenue.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Active Deals</span>
                                        <span className="font-medium text-foreground tabular-nums">{customer.activeDeals}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Last Contact</span>
                                        <span className="font-medium text-foreground">{customer.lastContact}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Health Score */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Điểm sức khỏe</span>
                                    {customer.trend === "up" && (
                                        <TrendingUp aria-hidden="true" className="size-3.5 text-accent" />
                                    )}
                                    {customer.trend === "down" && (
                                        <TrendingDown aria-hidden="true" className="size-3.5 text-destructive" />
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            role="progressbar"
                                            aria-label={`Điểm sức khỏe của ${customer.name}`}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-valuenow={customer.healthScore}
                                            className="h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none"
                                            style={{
                                                width: `${customer.healthScore}%`,
                                                backgroundColor:
                                                    customer.healthScore >= 80
                                                        ? "oklch(0.7 0.18 145)"
                                                        : customer.healthScore >= 60
                                                            ? "oklch(0.75 0.18 55)"
                                                            : "oklch(0.65 0.2 25)",
                                            }}
                                        />
                                    </div>
                                    <span
                                        className={`text-sm font-semibold tabular-nums ${customer.healthScore >= 80
                                            ? "text-accent"
                                            : customer.healthScore >= 60
                                                ? "text-chart-3"
                                                : "text-destructive"
                                            }`}
                                    >
                                        {customer.healthScore}%
                                    </span>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled title="Lịch hẹn chưa khả dụng">
                                    <Calendar aria-hidden="true" className="mr-1.5 size-3.5" />
                                    Lịch hẹn
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled title="Gửi email chưa khả dụng">
                                    <Mail aria-hidden="true" className="mr-1.5 size-3.5" />
                                    Email
                                </Button>
                                <Button aria-label={`Mở chi tiết ${customer.name}`} variant="ghost" size="icon" disabled title="Chi tiết khách hàng chưa khả dụng">
                                    <ExternalLink aria-hidden="true" className="size-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {filteredCustomers.length === 0 && (
                <p role="status" className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    Không tìm thấy khách hàng phù hợp.
                </p>
            )}
        </div>
    );
}
