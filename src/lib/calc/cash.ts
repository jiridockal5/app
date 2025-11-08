/**
 * Cash calculations: collections and cash roll
 */

/**
 * Calculate collections based on revenue and collection split
 */
export function calculateCollections(
  revenue: number,
  prevRevenue: number,
  collectSplit: [number, number]
): number {
  return revenue * collectSplit[0] + prevRevenue * collectSplit[1];
}

/**
 * Calculate cash balance for a month
 */
export function calculateCash(
  prevCash: number,
  collections: number,
  payroll: number,
  opex: number,
  investment?: number
): number {
  return prevCash + collections - payroll - opex + (investment || 0);
}

