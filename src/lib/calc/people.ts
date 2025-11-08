/**
 * People calculations: headcount progression and payroll
 */

import { Assumptions, TeamFunction } from "./drivers";

/**
 * Calculate headcount for a given month, spreading hires over 6 months
 */
export function calculateHeadcount(
  headcountNow: Record<TeamFunction, number>,
  hiresNext6Months: Record<TeamFunction, number>,
  month: number
): Record<TeamFunction, number> {
  const headcount: Record<TeamFunction, number> = { ...headcountNow };

  // Spread hires over months 1-6
  if (month <= 6) {
    for (const team of Object.keys(hiresNext6Months) as TeamFunction[]) {
      const totalHires = hiresNext6Months[team];
      // Linear progression: add hires gradually over 6 months
      const hiresThisMonth = totalHires / 6;
      headcount[team] = Math.round(headcountNow[team] + hiresThisMonth * month);
    }
  } else {
    // After month 6, headcount is stable
    for (const team of Object.keys(hiresNext6Months) as TeamFunction[]) {
      headcount[team] =
        headcountNow[team] + hiresNext6Months[team];
    }
  }

  return headcount;
}

/**
 * Calculate total payroll for a given month
 */
export function calculatePayroll(
  headcount: Record<TeamFunction, number>,
  avgCostPerFteUsd: Record<TeamFunction, number>
): number {
  let total = 0;
  for (const team of Object.keys(headcount) as TeamFunction[]) {
    total += headcount[team] * avgCostPerFteUsd[team];
  }
  return total;
}

