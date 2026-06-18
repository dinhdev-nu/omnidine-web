import { lazy } from "react"

export const Area = lazy(async () => {
  const { Area } = await import("recharts")
  return { default: Area }
})

export const AreaChart = lazy(async () => {
  const { AreaChart } = await import("recharts")
  return { default: AreaChart }
})

export const Bar = lazy(async () => {
  const { Bar } = await import("recharts")
  return { default: Bar }
})

export const BarChart = lazy(async () => {
  const { BarChart } = await import("recharts")
  return { default: BarChart }
})

export const CartesianGrid = lazy(async () => {
  const { CartesianGrid } = await import("recharts")
  return { default: CartesianGrid }
})

export const Cell = lazy(async () => {
  const { Cell } = await import("recharts")
  return { default: Cell }
})

export const Legend = lazy(async () => {
  const { Legend } = await import("recharts")
  return { default: Legend }
})

export const Line = lazy(async () => {
  const { Line } = await import("recharts")
  return { default: Line }
})

export const LineChart = lazy(async () => {
  const { LineChart } = await import("recharts")
  return { default: LineChart }
})

export const Pie = lazy(async () => {
  const { Pie } = await import("recharts")
  return { default: Pie }
})

export const PieChart = lazy(async () => {
  const { PieChart } = await import("recharts")
  return { default: PieChart }
})

export const ResponsiveContainer = lazy(async () => {
  const { ResponsiveContainer } = await import("recharts")
  return { default: ResponsiveContainer }
})

export const Tooltip = lazy(async () => {
  const { Tooltip } = await import("recharts")
  return { default: Tooltip }
})

export const XAxis = lazy(async () => {
  const { XAxis } = await import("recharts")
  return { default: XAxis }
})

export const YAxis = lazy(async () => {
  const { YAxis } = await import("recharts")
  return { default: YAxis }
})
