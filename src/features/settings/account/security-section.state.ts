import type { SessionInfo } from "@/services/auth"

export type PasswordField =
  | "currentPassword"
  | "newPassword"
  | "confirmNewPassword"

export type SecurityState = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
  passwordError: string | null
  isChangingPassword: boolean
  passwordSuccess: boolean
  sessions: SessionInfo[]
  isLoadingSessions: boolean
  show2faForm: boolean
  twoFaPassword: string
  isTwoFaLoading: boolean
  deleteConfirm: string
}

export type SecurityAction =
  | { type: "setPasswordField"; field: PasswordField; value: string }
  | { type: "startPasswordChange" }
  | { type: "passwordChangeSucceeded" }
  | { type: "passwordChangeFinished" }
  | { type: "sessionsLoaded"; sessions: SessionInfo[] }
  | { type: "sessionsLoadingFinished" }
  | { type: "sessionRevoked"; sessionId: string }
  | { type: "toggle2faForm" }
  | { type: "setTwoFaPassword"; value: string }
  | { type: "startTwoFaChange" }
  | { type: "twoFaChangeSucceeded" }
  | { type: "twoFaChangeFinished" }
  | { type: "setDeleteConfirm"; value: string }

export type SecurityDispatch = (action: SecurityAction) => void

export const securityInitialState: SecurityState = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  passwordError: null,
  isChangingPassword: false,
  passwordSuccess: false,
  sessions: [],
  isLoadingSessions: true,
  show2faForm: false,
  twoFaPassword: "",
  isTwoFaLoading: false,
  deleteConfirm: "",
}

export function securityReducer(
  state: SecurityState,
  action: SecurityAction
): SecurityState {
  switch (action.type) {
    case "setPasswordField":
      return { ...state, [action.field]: action.value }
    case "startPasswordChange":
      return {
        ...state,
        passwordError: null,
        passwordSuccess: false,
        isChangingPassword: true,
      }
    case "passwordChangeSucceeded":
      return {
        ...state,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        passwordSuccess: true,
        isChangingPassword: false,
      }
    case "passwordChangeFinished":
      return { ...state, isChangingPassword: false }
    case "sessionsLoaded":
      return { ...state, sessions: action.sessions }
    case "sessionsLoadingFinished":
      return { ...state, isLoadingSessions: false }
    case "sessionRevoked":
      return {
        ...state,
        sessions: state.sessions.filter(
          (session) => session.session_id !== action.sessionId
        ),
      }
    case "toggle2faForm":
      return {
        ...state,
        show2faForm: !state.show2faForm,
        twoFaPassword: "",
      }
    case "setTwoFaPassword":
      return { ...state, twoFaPassword: action.value }
    case "startTwoFaChange":
      return { ...state, isTwoFaLoading: true }
    case "twoFaChangeSucceeded":
      return {
        ...state,
        show2faForm: false,
        twoFaPassword: "",
        isTwoFaLoading: false,
      }
    case "twoFaChangeFinished":
      return { ...state, isTwoFaLoading: false }
    case "setDeleteConfirm":
      return { ...state, deleteConfirm: action.value }
    default:
      return state
  }
}