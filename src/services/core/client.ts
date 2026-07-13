import axios from "axios"
import type { AxiosResponse } from "axios"
import type { ApiSuccessResponse } from "../core/types"

const API_BASE_URL = import.meta.env.VITE_API_URL || ""
export const AUTH_SESSION_EXPIRED_EVENT = "omnidine:auth-session-expired"

export type SessionBootstrapResult =
  | { status: "authenticated"; accessToken: string }
  | { status: "anonymous" }
  | { status: "unavailable" }

// Access tokens intentionally live only in memory. The HttpOnly refresh cookie
// restores a session after a reload without exposing credentials to JavaScript.
let _accessToken: string | null = null
let hasNotifiedSessionExpired = false
let hasClearedLegacyToken = false
let clientSessionGeneration = 0

class SessionRefreshSupersededError extends Error {
  constructor() {
    super("The session changed while the access token was refreshing")
    this.name = "SessionRefreshSupersededError"
  }
}

function clearLegacyPersistedAccessToken(): void {
  if (hasClearedLegacyToken) return

  hasClearedLegacyToken = true
  try {
    localStorage.removeItem("omnidine_access_token")
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

export function setClientToken(token: string | null): void {
  clientSessionGeneration += 1
  _accessToken = token
  if (token) {
    hasNotifiedSessionExpired = false
  }
}

function notifySessionExpired(): void {
  if (hasNotifiedSessionExpired || typeof window === "undefined") return

  hasNotifiedSessionExpired = true
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT))
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
})

interface RequestWithRetryFlag {
  _retry?: boolean
  headers?: Record<string, string>
}

let refreshPromise: Promise<string> | null = null

export function unwrapResponseData<T>(
  response: AxiosResponse<ApiSuccessResponse<T>>
): T {
  return response.data.data
}

/** Deduplicates refresh requests from concurrent expired API calls. */
export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const refreshGeneration = clientSessionGeneration
    refreshPromise = refreshClient
      .post<ApiSuccessResponse<{ access_token: string }>>(
        "/auths/refresh-token"
      )
      .then((response) => {
        if (refreshGeneration !== clientSessionGeneration) {
          throw new SessionRefreshSupersededError()
        }

        const token = response.data.data.access_token
        setClientToken(token)
        return token
      })
      .catch((error: unknown) => {
        if (refreshGeneration !== clientSessionGeneration) {
          throw new SessionRefreshSupersededError()
        }

        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

/**
 * Restores the session at startup from the HttpOnly refresh cookie.
 * An absent or expired cookie is a valid anonymous session.
 */
export async function bootstrapClientSession(): Promise<SessionBootstrapResult> {
  clearLegacyPersistedAccessToken()

  if (_accessToken) {
    return { status: "authenticated", accessToken: _accessToken }
  }

  try {
    const accessToken = await refreshAccessToken()
    return { status: "authenticated", accessToken }
  } catch (error) {
    if (error instanceof SessionRefreshSupersededError) {
      return _accessToken
        ? { status: "authenticated", accessToken: _accessToken }
        : { status: "anonymous" }
    }

    setClientToken(null)

    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      return { status: "anonymous" }
    }

    return { status: "unavailable" }
  }
}

apiClient.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status
    const errorCode = error?.response?.data?.errorCode
    const originalConfig = error?.config as
      | (typeof error.config & RequestWithRetryFlag)
      | undefined

    if (
      status === 401 &&
      errorCode === "AUTH_003" &&
      originalConfig &&
      !originalConfig._retry &&
      _accessToken
    ) {
      originalConfig._retry = true

      try {
        const newAccessToken = await refreshAccessToken()
        originalConfig.headers = originalConfig.headers ?? {}
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalConfig)
      } catch (refreshError) {
        if (refreshError instanceof SessionRefreshSupersededError) {
          return Promise.reject(refreshError)
        }

        setClientToken(null)
        notifySessionExpired()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
