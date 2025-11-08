/**
 * Spend calculations: aggregate spend buckets
 */

import { Assumptions, TeamFunction, SpendBuckets } from "./drivers";

/**
 * Calculate total opex from all team spend buckets
 */
export function calculateOpex(
  spendMonthlyUsd: Record<TeamFunction, SpendBuckets>
): number {
  let total = 0;
  for (const team of Object.keys(spendMonthlyUsd) as TeamFunction[]) {
    const buckets = spendMonthlyUsd[team];
    total +=
      buckets.tools +
      buckets.ads +
      buckets.events +
      buckets.freelancers +
      buckets.other;
  }
  return total;
}

/**
 * Get sales and marketing spend for CAC calculation
 */
export function getSalesMarketingSpend(
  spendMonthlyUsd: Record<TeamFunction, SpendBuckets>
): { sales: number; marketing: number } {
  const sales = spendMonthlyUsd.Sales.tools + spendMonthlyUsd.Sales.ads;
  const marketing =
    spendMonthlyUsd.Marketing.tools + spendMonthlyUsd.Marketing.ads;
  return { sales, marketing };
}

