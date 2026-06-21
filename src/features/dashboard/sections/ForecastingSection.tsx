import { ForecastAnalysisGrid } from "./forecasting/ForecastAnalysisGrid"
import { ForecastingHeaderControls } from "./forecasting/ForecastingHeaderControls"
import { ForecastingKpiSummary } from "./forecasting/ForecastingKpiSummary"
import { ForecastRevenueChart } from "./forecasting/ForecastRevenueChart"
import { RiskFactorsCard } from "./forecasting/RiskFactorsCard"

export function ForecastingSection() {
  return (
    <div className="space-y-6">
      <ForecastingHeaderControls />
      <ForecastingKpiSummary />
      <ForecastRevenueChart />
      <ForecastAnalysisGrid />
      <RiskFactorsCard />
    </div>
  )
}
