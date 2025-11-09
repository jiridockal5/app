import { create } from "zustand";
import type { Assumptions } from "@/lib/calc/types";

const STORAGE_KEY = "saas-budget-assumptions";

const defaults: Assumptions = {
  horizonMonths: 12,
  startArrUsd: 2_400_000,
  acvUsd: 6_000,
  newLogosPerMonth: 30,
  churnMonthly: 0.008,
  upsellMonthly: 0.003,
  collectSplit: [0.25, 0.75],
  startCashUsd: 500_000,
  payrollPerMonthUsd: 220_000,
  opexPerMonthUsd: 60_000,
  oneOffInvestmentMonth: 3,
  oneOffInvestmentAmountUsd: 2_000_000,
};

// Load from localStorage
const loadStoredAssumptions = (): Assumptions | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    // Validate that all required fields exist
    if (
      typeof parsed.horizonMonths === "number" &&
      typeof parsed.startArrUsd === "number" &&
      typeof parsed.acvUsd === "number" &&
      typeof parsed.newLogosPerMonth === "number" &&
      typeof parsed.churnMonthly === "number" &&
      typeof parsed.upsellMonthly === "number" &&
      Array.isArray(parsed.collectSplit) &&
      parsed.collectSplit.length === 2 &&
      typeof parsed.startCashUsd === "number" &&
      typeof parsed.payrollPerMonthUsd === "number" &&
      typeof parsed.opexPerMonthUsd === "number"
    ) {
      return parsed as Assumptions;
    }
  } catch (error) {
    console.warn("Failed to load stored assumptions:", error);
  }
  
  return null;
};

// Save to localStorage
const saveAssumptions = (assumptions: Assumptions) => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assumptions));
  } catch (error) {
    console.warn("Failed to save assumptions to localStorage:", error);
  }
};

type Store = {
  a: Assumptions;
  set: (patch: Partial<Assumptions>) => void;
  reset: () => void;
};

const initialAssumptions = loadStoredAssumptions() ?? defaults;

export const useAppStore = create<Store>((set) => ({
  a: initialAssumptions,
  set: (patch) =>
    set((s) => {
      const updated = { a: { ...s.a, ...patch } };
      saveAssumptions(updated.a);
      return updated;
    }),
  reset: () => {
    saveAssumptions(defaults);
    set({ a: defaults });
  },
}));
