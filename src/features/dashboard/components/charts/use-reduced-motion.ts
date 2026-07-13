import { useSyncExternalStore } from "react"

const reducedMotionQuery = "(prefers-reduced-motion: reduce)"

function getMediaQuery() {
  if (typeof window === "undefined") return null
  return window.matchMedia(reducedMotionQuery)
}

function subscribe(onStoreChange: () => void) {
  const mediaQuery = getMediaQuery()
  mediaQuery?.addEventListener("change", onStoreChange)

  return () => mediaQuery?.removeEventListener("change", onStoreChange)
}

function getSnapshot() {
  return getMediaQuery()?.matches ?? false
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
