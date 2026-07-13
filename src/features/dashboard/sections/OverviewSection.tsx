import { MetricCard } from "../components/MetricCard";
import { RevenueChart } from "../components/charts/RevenueChart";
import { PipelineOverview } from "../components/charts/PipelineOverview";
import { RecentDeals } from "../components/RecentDeals";
import { TopPerformers } from "../components/TopPerformers";
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";

export function OverviewSection() {
    return (
        <div className="min-w-0 space-y-6">
            {/* Metric cards */}
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Tổng doanh thu"
                    value="2.4 tỷ đ"
                    change="+12.5%"
                    changeType="positive"
                    icon={DollarSign}
                    delay={0}
                />
                <MetricCard
                    title="Tỷ lệ chuyển đổi"
                    value="24.8%"
                    change="+3.2%"
                    changeType="positive"
                    icon={TrendingUp}
                    delay={1}
                />
                <MetricCard
                    title="Giao dịch đang xử lý"
                    value="147"
                    change="-5"
                    changeType="negative"
                    icon={Target}
                    delay={2}
                />
                <MetricCard
                    title="Khách hàng mới"
                    value="892"
                    change="+18.3%"
                    changeType="positive"
                    icon={Users}
                    delay={3}
                />
            </div>

            {/* Charts row */}
            <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="min-w-0 xl:col-span-2">
                    <RevenueChart />
                </div>
                <PipelineOverview />
            </div>

            {/* Bottom row */}
            <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
                <RecentDeals />
                <TopPerformers />
            </div>
        </div>
    );
}
