import { lazy } from "react"
import { Route } from "react-router-dom"

const HomePage = lazy(async () => {
  const module = await import("@/pages/home/HomePage")
  return { default: module.HomePage }
})

export function HomeRoutes() {
  return <Route path="/" element={<HomePage />} />
}
