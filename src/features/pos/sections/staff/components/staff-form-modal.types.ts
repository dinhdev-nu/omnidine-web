import type {
  StaffPermissions,
  StaffPosition,
  StaffStatus,
} from "@/types/domain/staff"

export type StaffFormMode = "add" | "edit"
export type StaffSubmitSection =
  | "all"
  | "info"
  | "account"
  | "status"
  | "avatar"
  | "permissions"

export interface StaffFormData {
  user_id: string
  employee_code: string
  full_name: string
  phone: string
  email: string
  position: StaffPosition | ""
  status: StaffStatus
  hire_date: string
  avatar_url: string
  permissions: StaffPermissions
}

export interface StaffFormModalProps {
  isOpen: boolean
  mode?: StaffFormMode
  formData: StaffFormData
  errors?: Partial<Record<keyof StaffFormData, string>>
  isLoading?: boolean
  onClose: () => void
  onFieldChange: (
    field: keyof StaffFormData,
    value: string | StaffPermissions
  ) => void
  onSubmit: (
    section?: StaffSubmitSection,
    payload?: { avatarUrl?: string }
  ) => void
}

export interface StaffFormSectionProps {
  formData: StaffFormData
  errors: Partial<Record<keyof StaffFormData, string>>
  isEditMode: boolean
  isLoading: boolean
  isUploading: boolean
  onSubmit: StaffFormModalProps["onSubmit"]
  onFieldChange: StaffFormModalProps["onFieldChange"]
}
