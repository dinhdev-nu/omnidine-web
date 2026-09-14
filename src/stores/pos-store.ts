import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StaffSummary } from '@/types/domain/staff';
import type { MenuCategoryWithCount, MenuItem } from '@/types/domain/menu';

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
      version: 3,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        menuCategories: state.menuCategories,
        menuItems: state.menuItems,
        staffs: state.staffs,
      }),
      // Reload cached API data when the response contract changes.
      migrate: () => ({ menuCategories: [], menuItems: [], staffs: [] }),
    }
  )
);
