import { create } from "zustand"
import {
  bootstrapClientSession,
  setClientToken,
  type SessionBootstrapResult,
} from "@/services/core/client"
import { useUserStore } from "@/stores/user-store"

type AuthSessionStatus =
  | "initializing"
  | "authenticated"
  | "anonymous"
  | "unavailable"

interface AuthState {
  accessToken: string | null
  tempToken: string | null
  sessionStatus: AuthSessionStatus
  bootstrapSession: () => Promise<SessionBootstrapResult["status"]>
  setAccessToken: (token: string | null) => void
  setTempToken: (token: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  tempToken: null,
  sessionStatus: "initializing",
  bootstrapSession: async () => {
    set({ sessionStatus: "initializing" })
    const result = await bootstrapClientSession()
    const accessToken =
      result.status === "authenticated" ? result.accessToken : null

    set({
      accessToken,
      sessionStatus: result.status,
    })

    return result.status
  },
  setAccessToken: (token) => {
    if (token !== get().accessToken) {
      useUserStore.getState().clear()
    }

    setClientToken(token)
    set({
      accessToken: token,
      sessionStatus: token ? "authenticated" : "anonymous",
    })
  },
  setTempToken: (token) => set({ tempToken: token }),
  clearAuth: () => {
    useUserStore.getState().clear()
    setClientToken(null)
    set({
      accessToken: null,
      tempToken: null,
      sessionStatus: "anonymous",
    })
  },
}))
