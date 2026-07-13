import { create } from "zustand"
import type {
  UpdatePreferencesPayload,
  UpdateProfilePayload,
  UserProfile,
} from "@/types/domain/user"
import type { AppError } from "@/services/core/types"
import { toAppError } from "@/services/core/error"
import {
  getMe,
  mapPreferencesToUi,
  updateMe,
  updateMyPreferences,
  type UiPreferences,
} from "@/services/users"

const PROFILE_STORAGE_KEY = "omnidine_profile:v1"
const PREFERENCES_STORAGE_KEY = "omnidine_preferences:v1"
const LEGACY_STORAGE_KEYS = ["omnidine_profile", "omnidine_preferences"]
let userSessionGeneration = 0

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null
}

function isUiPreferences(value: unknown): value is UiPreferences {
  if (!isRecord(value) || !isRecord(value.notifications)) return false

  return (
    (value.language === "en" || value.language === "vi") &&
    (value.theme === "light" ||
      value.theme === "dark" ||
      value.theme === "system") &&
    typeof value.notifications.email === "boolean" &&
    typeof value.notifications.sms === "boolean" &&
    typeof value.notifications.push === "boolean"
  )
}

function isUserProfile(value: unknown): value is UserProfile {
  if (!isRecord(value) || !isUiPreferences(value.preferences)) return false

  return (
    typeof value._id === "string" &&
    typeof value.email === "string" &&
    isNullableString(value.phone) &&
    typeof value.full_name === "string" &&
    isNullableString(value.avatar_url) &&
    isNullableString(value.date_of_birth) &&
    (value.gender === "male" ||
      value.gender === "female" ||
      value.gender === "other" ||
      value.gender === null) &&
    (value.system_role === "admin" || value.system_role === "user") &&
    (value.status === "active" ||
      value.status === "inactive" ||
      value.status === "banned" ||
      value.status === "pending") &&
    isNullableString(value.email_verified_at) &&
    isNullableString(value.phone_verified_at) &&
    isNullableString(value.last_login_at) &&
    typeof value.two_factor_enabled === "boolean" &&
    typeof value.created_at === "string" &&
    typeof value.updated_at === "string"
  )
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function removeStoredValue(key: string): void {
  try {
    getStorage()?.removeItem(key)
  } catch {
    // Storage can be unavailable or blocked by the browser.
  }
}

function readStoredValue<T>(
  key: string,
  isValid: (value: unknown) => value is T
): T | null {
  try {
    const raw = getStorage()?.getItem(key)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (isValid(value)) return value

    removeStoredValue(key)
    return null
  } catch {
    removeStoredValue(key)
    return null
  }
}

function writeStoredValue<T>(key: string, value: T | null): void {
  try {
    const storage = getStorage()
    if (!storage) return

    if (value === null) storage.removeItem(key)
    else storage.setItem(key, JSON.stringify(value))
  } catch {
    // Keep the in-memory store usable when persistence is unavailable.
  }
}

function clearLegacyUserStorage(): void {
  LEGACY_STORAGE_KEYS.forEach(removeStoredValue)
}

function readStoredProfile(): UserProfile | null {
  return readStoredValue(PROFILE_STORAGE_KEY, isUserProfile)
}

function readStoredPreferences(): UiPreferences | null {
  return readStoredValue(PREFERENCES_STORAGE_KEY, isUiPreferences)
}

function persistUserState(
  profile: UserProfile | null,
  preferences: UiPreferences | null
): void {
  writeStoredValue(PROFILE_STORAGE_KEY, profile)
  writeStoredValue(PREFERENCES_STORAGE_KEY, preferences)
}

interface UserState {
  profile: UserProfile | null
  preferences: UiPreferences | null
  isLoadingProfile: boolean
  isSavingProfile: boolean
  error: AppError | null
  fetchProfile: () => Promise<void>
  saveProfile: (payload: UpdateProfilePayload) => Promise<void>
  savePreferences: (payload: UpdatePreferencesPayload) => Promise<void>
  clear: () => void
}

export const useUserStore = create<UserState>((set, get) => {
  clearLegacyUserStorage()

  return {
    profile: readStoredProfile(),
    preferences: readStoredPreferences(),
    isLoadingProfile: false,
    isSavingProfile: false,
    error: null,
    fetchProfile: async () => {
      if (get().isLoadingProfile) return
      const requestGeneration = userSessionGeneration
      set({ isLoadingProfile: true, error: null })
      try {
        const profile = await getMe()
        if (requestGeneration !== userSessionGeneration) return

        const preferences = mapPreferencesToUi(profile)
        persistUserState(profile, preferences)
        set({ profile, preferences })
      } catch (error) {
        if (requestGeneration !== userSessionGeneration) return

        set({ error: toAppError(error, "Failed to load user profile") })
        throw error
      } finally {
        if (requestGeneration === userSessionGeneration) {
          set({ isLoadingProfile: false })
        }
      }
    },
    saveProfile: async (payload) => {
      const requestGeneration = userSessionGeneration
      set({ isSavingProfile: true, error: null })
      try {
        const profile = await updateMe(payload)
        if (requestGeneration !== userSessionGeneration) return

        const preferences = mapPreferencesToUi(profile)
        persistUserState(profile, preferences)
        set({ profile, preferences })
      } catch (error) {
        if (requestGeneration !== userSessionGeneration) return

        set({ error: toAppError(error, "Failed to update profile") })
        throw error
      } finally {
        if (requestGeneration === userSessionGeneration) {
          set({ isSavingProfile: false })
        }
      }
    },
    savePreferences: async (payload) => {
      const requestGeneration = userSessionGeneration
      set({ isSavingProfile: true, error: null })
      try {
        const preferences = await updateMyPreferences(payload)
        if (requestGeneration !== userSessionGeneration) return

        const currentProfile = get().profile
        const nextProfile = currentProfile
          ? {
              ...currentProfile,
              preferences: {
                language: preferences.language,
                theme: preferences.theme,
                notifications: {
                  email: preferences.notifications.email,
                  sms: preferences.notifications.sms,
                  push: preferences.notifications.push,
                },
              },
            }
          : null

        persistUserState(nextProfile, preferences)
        set({ profile: nextProfile, preferences })
      } catch (error) {
        if (requestGeneration !== userSessionGeneration) return

        set({ error: toAppError(error, "Failed to update preferences") })
        throw error
      } finally {
        if (requestGeneration === userSessionGeneration) {
          set({ isSavingProfile: false })
        }
      }
    },
    clear: () => {
      userSessionGeneration += 1
      persistUserState(null, null)
      set({
        profile: null,
        preferences: null,
        isLoadingProfile: false,
        isSavingProfile: false,
        error: null,
      })
    },
  }
})
