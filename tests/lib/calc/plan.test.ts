import { describe, it, expect } from "vitest";
import { buildPlan } from "@/lib/calc/plan";
import { defaultAssumptions } from "@/lib/calc/drivers";

describe("buildPlan", () => {
  it("builds a 12-month plan", () => {
    const { rows, summary } = buildPlan(defaultAssumptions);

    expect(rows.length).toBe(12);
    expect(rows[0].m).toBe(1);
    expect(rows[11].m).toBe(12);
  });

  it("calculates opening ARR correctly", () => {
    const { rows } = buildPlan(defaultAssumptions);

    expect(rows[0].openingArr).toBe(2_400_000);
    expect(rows[1].openingArr).toBe(rows[0].closingArr);
  });

  it("includes investment in correct month", () => {
    const assumptions = {
      ...defaultAssumptions,
      oneOffInvestmentMonth: 3,
      oneOffInvestmentAmountUsd: 1_000_000,
    };

    const { rows } = buildPlan(assumptions);

    // Month 2 should have less cash than month 3 (due to investment)
    expect(rows[2].cashEnd).toBeLessThan(rows[3].cashEnd);
  });

  it("calculates summary KPIs", () => {
    const { summary } = buildPlan(defaultAssumptions);

    expect(summary.arrEnd).toBeGreaterThan(0);
    expect(summary.revenueNext).toBeGreaterThan(0);
    expect(summary.cashEnd).toBeDefined();
    expect(summary.runwayMonths).toBeDefined();
    expect(summary.nrrPct).toBeGreaterThan(0);
    expect(summary.ltv).toBeGreaterThan(0);
  });
});

