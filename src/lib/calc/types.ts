export type Assumptions = {
  horizonMonths: number;
  startArrUsd: number;
  acvUsd: number;
  newLogosPerMonth: number;
  churnMonthly: number;
  upsellMonthly: number;
  collectSplit: [number, number];
  startCashUsd: number;
  payrollPerMonthUsd: number;
  opexPerMonthUsd: number;
  oneOffInvestmentMonth?: number;
  oneOffInvestmentAmountUsd?: number;
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
};

export type PlanSummary = {
  arrEnd: number;
  revenueNext: number;
  burnNext: number;
  cashEnd: number;
  runwayMonths: number | "∞";
};

