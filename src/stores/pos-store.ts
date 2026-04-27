import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StaffSummary } from '@/types/staff-type';
import type { MenuCategoryWithCount, MenuItem } from '@/types/menu-type';

export interface POSState {
  menuCategories: MenuCategoryWithCount[];
  menuItems: MenuItem[];
  staffs: StaffSummary[];

  setMenuCategories: (categories: MenuCategoryWithCount[]) => void;
  setMenuItems: (items: MenuItem[]) => void;
  setStaffs: (staffs: StaffSummary[]) => void;
}

const POS_STORAGE_KEY = 'pos_store';

export const usePOSStore = create<POSState>()(
  persist(
    (set) => ({
      menuCategories: [],
      menuItems: [],
      staffs: [],

      setMenuCategories: (menuCategories) => set({ menuCategories }),
      setMenuItems: (menuItems) => set({ menuItems }),
      setStaffs: (staffs) => set({ staffs }),
    }),
    {
      name: POS_STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        menuCategories: state.menuCategories,
        menuItems: state.menuItems,
        staffs: state.staffs,
      }),
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return { menuCategories: [], menuItems: [], staffs: [] };
        }

        const state = persistedState as Record<string, unknown>;
        return {
          menuCategories: Array.isArray(state.menuCategories) ? state.menuCategories : [],
          menuItems: Array.isArray(state.menuItems) ? state.menuItems : [],
          staffs: Array.isArray(state.staffs) ? state.staffs : [],
        };
      },
    }
  )
);
