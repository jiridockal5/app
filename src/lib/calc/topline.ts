/**
 * Topline calculations: ARR and revenue
 */

import { Assumptions } from "./drivers";

export interface ToplineResult {
  newArr: number;
  churnArr: number;
  upsellArr: number;
  closingArr: number;
  revenue: number;
  newLogos: number;
}

/**
 * Calculate topline metrics for a given month
 */
export function calculateTopline(
  assumptions: Assumptions,
  month: number,
  prevClosingArr: number
): ToplineResult {
  const openingArr = month === 1 ? assumptions.startArrUsd : prevClosingArr;

  // New ARR from new logos
  const newLogos = assumptions.newLogosPerMonth;
  const newArr = newLogos * assumptions.acvUsd;

  // Churn ARR
  const churnArr = openingArr * assumptions.churnMonthly;

  // Upsell ARR
  const upsellArr = openingArr * assumptions.upsellMonthly;

  // Closing ARR
  const closingArr = Math.max(0, openingArr + newArr - churnArr + upsellArr);

  // Monthly revenue (simplified: ARR / 12)
  const revenue = closingArr / 12;

  return {
    newArr,
    churnArr,
    upsellArr,
    closingArr,
    revenue,
    newLogos,
  };
}

