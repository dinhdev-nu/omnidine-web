import { createContext, use } from "react"
import { useCreateRestaurantProviderValue } from "./form-provider/useCreateRestaurantProviderValue"
import type {
  CreateRestaurantContextValue,
  CreateRestaurantProviderProps,
} from "./form-provider/types"

export type {
  CreateRestaurantActions,
  CreateRestaurantMeta,
  CreateRestaurantProviderProps,
  CreateRestaurantState,
  SlugCheckStatus,
} from "./form-provider/types"

const CreateRestaurantContext = createContext<
  CreateRestaurantContextValue | undefined
>(undefined)

export function CreateRestaurantProvider({
  children,
  isEditing = false,
  initialFormData,
  initialImagePreviews,
}: CreateRestaurantProviderProps) {
  const value = useCreateRestaurantProviderValue({
    isEditing,
    initialFormData,
    initialImagePreviews,
  })

  return (
    <CreateRestaurantContext.Provider value={value}>
      {children}
    </CreateRestaurantContext.Provider>
  )
}

function useCreateRestaurantContextValue() {
  const context = use(CreateRestaurantContext)

  if (context === undefined) {
    throw new Error(
      "useCreateRestaurant must be used within a CreateRestaurantProvider"
    )
  }

  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCreateRestaurantState() {
  return useCreateRestaurantContextValue().state
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCreateRestaurantActions() {
  return useCreateRestaurantContextValue().actions
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCreateRestaurantMeta() {
  return useCreateRestaurantContextValue().meta
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCreateRestaurant() {
  const { state, actions, meta } = useCreateRestaurantContextValue()

  return {
    state,
    actions,
    meta,
    ...state,
    ...meta,
    set: actions.setField,
    handleChange: actions.changeTextField,
    handleNumberChange: actions.changeNumberField,
    handleOperatingClosedChange: actions.changeOperatingClosed,
    handleOperatingTimeChange: actions.changeOperatingTime,
    handleImageUpload: actions.uploadImage,
    handleSubmit: actions.submitForm,
  }
}
