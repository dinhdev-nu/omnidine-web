import { lazy, Suspense, type ReactNode } from "react"

const loadRecharts = () => import("recharts")

interface LazyChartProps {
  children: ReactNode
}

export function LazyChart({ children }: LazyChartProps) {
  return (
    <Suspense
      fallback={
        <div
          aria-hidden="true"
          className="size-full animate-pulse rounded-lg bg-muted/40 motion-reduce:animate-none"
        />
      }
    >
      {children}
    </Suspense>
  )
}

export const Area = lazy(async () => {
  const { Area } = await loadRecharts()
  return { default: Area }
})

export const AreaChart = lazy(async () => {
  const { AreaChart } = await loadRecharts()
  return { default: AreaChart }
})

export const Bar = lazy(async () => {
  const { Bar } = await loadRecharts()
  return { default: Bar }
})

export const BarChart = lazy(async () => {
  const { BarChart } = await loadRecharts()
  return { default: BarChart }
})

export const CartesianGrid = lazy(async () => {
  const { CartesianGrid } = await loadRecharts()
  return { default: CartesianGrid }
})

export const Legend = lazy(async () => {
  const { Legend } = await loadRecharts()
  return { default: Legend }
})

export const Line = lazy(async () => {
  const { Line } = await loadRecharts()
  return { default: Line }
})

export const LineChart = lazy(async () => {
  const { LineChart } = await loadRecharts()
  return { default: LineChart }
})

export const Pie = lazy(async () => {
  const { Pie } = await loadRecharts()
  return { default: Pie }
})

export const PieChart = lazy(async () => {
  const { PieChart } = await loadRecharts()
  return { default: PieChart }
})

export const Tooltip = lazy(async () => {
  const { Tooltip } = await loadRecharts()
  return { default: Tooltip }
})

export const XAxis = lazy(async () => {
  const { XAxis } = await loadRecharts()
  return { default: XAxis }
})

export const YAxis = lazy(async () => {
  const { YAxis } = await loadRecharts()
  return { default: YAxis }
})
