import { useMemo, useReducer } from "react"
import { toast } from "sonner"

import { toAppError } from "@/services/core/error"
import { useUserStore } from "@/stores/user-store"

import { STATUS_BADGE } from "../constants"

type ProfileDraftState = {
  firstName: string | null
  lastName: string | null
  bio: string
  gender: "male" | "female" | "other" | "" | null
  dateOfBirth: string | null
  instagram: string
  twitter: string
  linkedin: string
  website: string
  theme: "light" | "dark" | "system" | null
  language: "en" | "vi" | null
}

type ProfileDraftAction = {
  type: "setField"
  field: keyof ProfileDraftState
  value: ProfileDraftState[keyof ProfileDraftState]
}

const profileDraftInitialState: ProfileDraftState = {
  firstName: null,
  lastName: null,
  bio: "",
  gender: null,
  dateOfBirth: null,
  instagram: "",
  twitter: "",
  linkedin: "",
  website: "",
  theme: null,
  language: null,
}

function profileDraftReducer(
  state: ProfileDraftState,
  action: ProfileDraftAction
): ProfileDraftState {
  switch (action.type) {
    case "setField":
      return { ...state, [action.field]: action.value } as ProfileDraftState
    default:
      return state
  }
}

export function useProfileSectionController() {
  const [profileDraft, dispatchProfileDraft] = useReducer(
    profileDraftReducer,
    profileDraftInitialState
  )
  const {
    firstName,
    lastName,
    bio,
    gender,
    dateOfBirth,
    instagram,
    twitter,
    linkedin,
    website,
    theme,
    language,
  } = profileDraft

  const setDraftField = <K extends keyof ProfileDraftState>(
    field: K,
    value: ProfileDraftState[K]
  ) => {
    dispatchProfileDraft({ type: "setField", field, value })
  }

  const profile = useUserStore((state) => state.profile)
  const preferences = useUserStore((state) => state.preferences)
  const isLoadingProfile = useUserStore((state) => state.isLoadingProfile)
  const isSavingProfile = useUserStore((state) => state.isSavingProfile)
  const saveProfile = useUserStore((state) => state.saveProfile)
  const savePreferences = useUserStore((state) => state.savePreferences)

  const profileNameParts = useMemo(() => {
    const parts = profile?.full_name?.trim().split(/\s+/)

    return {
      firstName: parts?.[0] || "",
      lastName: parts?.slice(1).join(" ") || "",
    }
  }, [profile?.full_name])

  const baseGender =
    (profile?.gender as "male" | "female" | "other" | "" | undefined) ?? ""
  const baseDateOfBirth = profile?.date_of_birth?.slice(0, 10) || ""
  const baseTheme = preferences?.theme ?? "light"
  const baseLanguage = preferences?.language ?? "vi"
  const userCode = profile?._id ?? ""

  const resolvedFirstName = firstName ?? profileNameParts.firstName
  const resolvedLastName = lastName ?? profileNameParts.lastName
  const resolvedGender = gender ?? baseGender
  const resolvedDateOfBirth = dateOfBirth ?? baseDateOfBirth
  const resolvedTheme = theme ?? baseTheme
  const resolvedLanguage = language ?? baseLanguage

  const handleSave = async () => {
    try {
      const fullName = `${resolvedFirstName} ${resolvedLastName}`.trim()

      await saveProfile({
        full_name: fullName,
        ...(resolvedGender && { gender: resolvedGender }),
        ...(resolvedDateOfBirth && { date_of_birth: resolvedDateOfBirth }),
      })
      await savePreferences({
        theme: resolvedTheme,
        language: resolvedLanguage,
      })

      toast.success("Đã lưu thay đổi")
    } catch (error) {
      toast.error(toAppError(error, "Không thể lưu cài đặt").message)
    }
  }

  const statusBadge = profile?.status
    ? (STATUS_BADGE[profile.status] ?? STATUS_BADGE.inactive)
    : null

  return {
    profile,
    statusBadge,
    userCode,
    resolvedFirstName,
    resolvedLastName,
    resolvedGender,
    resolvedDateOfBirth,
    resolvedTheme,
    resolvedLanguage,
    bio,
    website,
    twitter,
    instagram,
    linkedin,
    isSavingProfile,
    isLoadingProfile,
    setDraftField,
    handleSave,
  }
}

export type ProfileSectionController = ReturnType<
  typeof useProfileSectionController
>
