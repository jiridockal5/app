import { create } from "zustand";
import type { Assumptions } from "@/lib/calc/types";

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

type Store = {
  a: Assumptions;
  set: (patch: Partial<Assumptions>) => void;
};

export const useAppStore = create<Store>((set) => ({
  a: defaults,
  set: (patch) => set((s) => ({ a: { ...s.a, ...patch } })),
}));
