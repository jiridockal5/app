/**
 * Zustand store for assumptions and scenario management
 */

import { create } from "zustand";
import { Assumptions, defaultAssumptions } from "@/lib/calc/drivers";
import { buildPlan } from "@/lib/calc/plan";

interface StoreState {
  assumptions: Assumptions;
  updateAssumptions: (updates: Partial<Assumptions>) => void;
  resetAssumptions: () => void;
  getPlan: () => ReturnType<typeof buildPlan>;
}

export const useStore = create<StoreState>((set, get) => ({
  assumptions: { ...defaultAssumptions },

  updateAssumptions: (updates) => {
    set((state) => ({
      assumptions: { ...state.assumptions, ...updates },
    }));
  },

  resetAssumptions: () => {
    set({ assumptions: { ...defaultAssumptions } });
  },

  getPlan: () => {
    return buildPlan(get().assumptions);
  },
}));

