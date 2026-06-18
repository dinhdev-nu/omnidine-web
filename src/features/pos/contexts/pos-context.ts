import { createContext } from 'react';
import type { PosInitData } from '@/types/domain/pos-init';
import type { AppError } from '@/services/core/types';

export interface PosContextType {
  data: PosInitData | null;
  loading: boolean;
  error: AppError | null;
}

export const PosContext = createContext<PosContextType | undefined>(undefined);
