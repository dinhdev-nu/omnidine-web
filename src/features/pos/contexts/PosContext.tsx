import React from "react"
import { PosContext, type PosContextType } from "./pos-context"

interface PosProviderProps {
  value: PosContextType
  children: React.ReactNode
}

export const PosProvider: React.FC<PosProviderProps> = ({
  value,
  children,
}) => {
  return <PosContext.Provider value={value}>{children}</PosContext.Provider>
}
