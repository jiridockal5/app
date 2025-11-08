/**
 * KPI calculations: NRR, CAC, LTV, runway, burn
 */

import { Assumptions, MonthRow } from "./drivers";
import { getSalesMarketingSpend } from "./spend";

/**
 * Calculate Net Revenue Retention (NRR)
 */
export function calculateNRR(churn: number, upsell: number): number {
  return 1 - churn + upsell;
}

/**
 * Calculate Customer Acquisition Cost (CAC)
 */
export function calculateCAC(
  salesSpend: number,
  marketingSpend: number,
  newLogos: number
): number | null {
  if (newLogos === 0) {
    return null;
  }
  return (salesSpend + marketingSpend) / newLogos;
}

/**
 * Calculate Lifetime Value (LTV)
 */
export function calculateLTV(acv: number, churn: number): number {
  if (churn === 0) {
    return Infinity;
  }
  const monthlyRevenue = acv / 12;
  return monthlyRevenue / churn;
}

/**
 * Calculate burn rate
 */
export function calculateBurn(
  payroll: number,
  opex: number,
  collections: number
): number {
  return payroll + opex - collections;
}

/**
 * Calculate runway in months
 */
export function calculateRunway(
  cash: number,
  burn: number
): number | "∞" {
  if (burn <= 0) {
    return "∞";
  }
  return Math.floor(cash / burn);
}

/**
 * Calculate all KPIs from plan rows and assumptions
 */
export function calculateKPIs(
  rows: MonthRow[],
  assumptions: Assumptions
): {
  nrrPct: number;
  ltv: number;
  cac: number | null;
  ltvCac: number | null;
  runwayMonths: number | "∞";
} {
  if (rows.length === 0) {
    return {
      nrrPct: 0,
      ltv: 0,
      cac: null,
      ltvCac: null,
      runwayMonths: "∞",
    };
  }

  const lastRow = rows[rows.length - 1];
  const nextRow = rows.length > 1 ? rows[rows.length - 2] : lastRow;

  // NRR
  const nrr = calculateNRR(
    assumptions.churnMonthly,
    assumptions.upsellMonthly
  );
  const nrrPct = nrr * 100;

  // LTV
  const ltv = calculateLTV(assumptions.acvUsd, assumptions.churnMonthly);

  // CAC
  const { sales, marketing } = getSalesMarketingSpend(
    assumptions.spendMonthlyUsd
  );
  const cac = calculateCAC(sales, marketing, assumptions.newLogosPerMonth);

  // LTV/CAC
  const ltvCac = cac !== null && cac > 0 ? ltv / cac : null;

  // Runway
  const burn = calculateBurn(nextRow.payroll, nextRow.opex, nextRow.collections);
  const runwayMonths = calculateRunway(lastRow.cashEnd, burn);

  return {
    nrrPct,
    ltv,
    cac,
    ltvCac,
    runwayMonths,
  };
}
