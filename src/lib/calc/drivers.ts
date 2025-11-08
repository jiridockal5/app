/**
 * Type definitions and default values for assumptions
 */

export type Currency = "USD" | "CZK";

export type TeamFunction = "R&D" | "Sales" | "Marketing" | "CS" | "Ops";

export type SpendBuckets = {
  tools: number;
  ads: number;
  events: number;
  freelancers: number;
  other: number;
};

export type Assumptions = {
  horizonMonths: number; // 12 for MVP
  baseCurrency: Currency; // "USD" (MVP)
  fxUsdPerCzk: number; // if CZK used upstream

  // Topline
  startArrUsd: number;
  acvUsd: number;
  newLogosPerMonth: number; // constant for MVP
  churnMonthly: number; // e.g. 0.008
  upsellMonthly: number; // e.g. 0.003
  collectSplit: [number, number]; // [current, previous] e.g. [0.25, 0.75]

  // Cash
  startCashUsd: number;
  oneOffInvestmentMonth?: number; // 1..N
  oneOffInvestmentAmountUsd?: number;

  // People (counts × avg cost)
  headcountNow: Record<TeamFunction, number>;
  hiresNext6Months: Record<TeamFunction, number>;
  avgCostPerFteUsd: Record<TeamFunction, number>;

  // Spend buckets (monthly USD)
  spendMonthlyUsd: Record<TeamFunction, SpendBuckets>;
};

export type MonthRow = {
  m: number;
  openingArr: number;
  newArr: number;
  churnArr: number;
  upsellArr: number;
  closingArr: number;
  revenue: number;
  collections: number;
  payroll: number;
  opex: number;
  burn: number;
  cashEnd: number;
  newLogos: number;
};

export type PlanSummary = {
  arrEnd: number;
  revenueNext: number;
  burnNext: number;
  cashEnd: number;
  runwayMonths: number | "∞";
  nrrPct: number;
  ltv: number;
  cac: number | null;
  ltvCac: number | null;
};

/**
 * Default assumptions for MVP
 */
export const defaultAssumptions: Assumptions = {
  horizonMonths: 12,
  baseCurrency: "USD",
  fxUsdPerCzk: 21.0,

  // Topline
  startArrUsd: 2_400_000,
  acvUsd: 6_000,
  newLogosPerMonth: 30,
  churnMonthly: 0.008,
  upsellMonthly: 0.003,
  collectSplit: [0.25, 0.75],

  // Cash
  startCashUsd: 500_000,
  oneOffInvestmentMonth: 3,
  oneOffInvestmentAmountUsd: 2_000_000,

  // People
  headcountNow: {
    "R&D": 8,
    Sales: 3,
    Marketing: 2,
    CS: 2,
    Ops: 2,
  },
  hiresNext6Months: {
    "R&D": 3,
    Sales: 2,
    Marketing: 1,
    CS: 1,
    Ops: 0,
  },
  avgCostPerFteUsd: {
    "R&D": 6_000,
    Sales: 5_000,
    Marketing: 4_000,
    CS: 3_500,
    Ops: 3_500,
  },

  // Spend
  spendMonthlyUsd: {
    "R&D": {
      tools: 5_000,
      ads: 0,
      events: 2_000,
      freelancers: 3_000,
      other: 2_000,
    },
    Sales: {
      tools: 5_000,
      ads: 10_000,
      events: 2_000,
      freelancers: 3_000,
      other: 2_000,
    },
    Marketing: {
      tools: 5_000,
      ads: 10_000,
      events: 2_000,
      freelancers: 3_000,
      other: 2_000,
    },
    CS: {
      tools: 5_000,
      ads: 0,
      events: 2_000,
      freelancers: 3_000,
      other: 2_000,
    },
    Ops: {
      tools: 5_000,
      ads: 0,
      events: 2_000,
      freelancers: 3_000,
      other: 2_000,
    },
  },
};

