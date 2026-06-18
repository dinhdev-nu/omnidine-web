import { useCallback, useEffect, useReducer } from "react"
import { fetchPosInit } from "@/services/pos"
import { toAppError } from "@/services/core/error"
import type { PosInitData } from "@/types/domain/pos-init"
import type { AppError } from "@/services/core/types"
import type { PosContextType } from "./pos-context"

interface PosInitState {
  data: PosInitData | null
  loading: boolean
  error: AppError | null
}

type PosInitAction =
  | { type: "loading" }
  | { type: "success"; data: PosInitData }
  | { type: "error"; error: AppError }

const initialPosInitState: PosInitState = {
  data: null,
  loading: true,
  error: null,
}

function posInitReducer(
  state: PosInitState,
  action: PosInitAction
): PosInitState {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true, error: null }
    case "success":
      return { data: action.data, loading: false, error: null }
    case "error":
      return { data: null, loading: false, error: action.error }
  }
}

export function usePosInitData(slug: string): PosContextType {
  const [state, dispatch] = useReducer(posInitReducer, initialPosInitState)

  const fetchData = useCallback(async () => {
    if (!slug?.trim()) {
      const slugError: AppError = {
        message: "POS slug is required",
      }
      dispatch({ type: "error", error: slugError })
      return Promise.reject(slugError)
    }

    try {
      dispatch({ type: "loading" })
      const result = await fetchPosInit(slug)
      dispatch({ type: "success", data: result })
    } catch (err) {
      const appError = toAppError(err, "Failed to fetch POS init data")
      dispatch({ type: "error", error: appError })
      return Promise.reject(appError)
    }
  }, [slug])

  useEffect(() => {
    fetchData().catch(() => undefined)
  }, [fetchData])

  return state
}
