import { describe, it, expect } from "vitest";
import { buildPlan } from "@/lib/calc/plan";
import type { Assumptions } from "@/lib/calc/types";

const defaultAssumptions: Assumptions = {
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

describe("buildPlan", () => {
  it("builds a 12-month plan", () => {
    const { rows, summary } = buildPlan(defaultAssumptions);

    expect(rows.length).toBe(12);
    expect(rows[0].m).toBe(1);
    expect(rows[11].m).toBe(12);
    expect(summary).toBeDefined();
  });

  it("calculates opening ARR correctly", () => {
    const { rows } = buildPlan(defaultAssumptions);

    expect(rows[0].openingArr).toBe(2_400_000);
    expect(rows[1].openingArr).toBe(rows[0].closingArr);
  });

  it("calculates new ARR from new logos", () => {
    const { rows } = buildPlan(defaultAssumptions);

    // newArr = newLogosPerMonth * acvUsd
    expect(rows[0].newArr).toBe(30 * 6_000); // 180,000
  });

  it("calculates churn ARR correctly", () => {
    const { rows } = buildPlan(defaultAssumptions);

    // churnArr = openingArr * churnMonthly
    expect(rows[0].churnArr).toBeCloseTo(2_400_000 * 0.008); // 19,200
  });

  it("calculates upsell ARR correctly", () => {
    const { rows } = buildPlan(defaultAssumptions);

    // upsellArr = openingArr * upsellMonthly
    expect(rows[0].upsellArr).toBeCloseTo(2_400_000 * 0.003); // 7,200
  });

  it("calculates closing ARR correctly", () => {
    const { rows } = buildPlan(defaultAssumptions);

    // closingArr = openingArr + newArr - churnArr + upsellArr
    const expected = 2_400_000 + 180_000 - 19_200 + 7_200;
    expect(rows[0].closingArr).toBeCloseTo(expected);
  });

  it("calculates revenue from closing ARR", () => {
    const { rows } = buildPlan(defaultAssumptions);

    // revenue = closingArr / 12
    expect(rows[0].revenue).toBeCloseTo(rows[0].closingArr / 12);
  });

  it("calculates collections with split", () => {
    const { rows } = buildPlan(defaultAssumptions);

    // collections = revenue * collectSplit[0] + prevRevenue * collectSplit[1]
    // For first month, prevRevenue = startArrUsd / 12
    const prevRevenue = 2_400_000 / 12;
    const expected = rows[0].revenue * 0.25 + prevRevenue * 0.75;
    expect(rows[0].collections).toBeCloseTo(expected);
  });

  it("calculates burn correctly", () => {
    const { rows } = buildPlan(defaultAssumptions);

    // burn = payroll + opex - collections
    const expected = 220_000 + 60_000 - rows[0].collections;
    expect(rows[0].burn).toBeCloseTo(expected);
  });

  it("includes investment in correct month", () => {
    const assumptions: Assumptions = {
      ...defaultAssumptions,
      oneOffInvestmentMonth: 3,
      oneOffInvestmentAmountUsd: 1_000_000,
    };

    const { rows } = buildPlan(assumptions);

    // Month 2 (index 1) should have less cash than month 3 (index 2) due to investment
    expect(rows[1].cashEnd).toBeLessThan(rows[2].cashEnd);
    // Investment should be added in month 3
    const cashBeforeInvestment = rows[1].cashEnd + rows[2].collections - (assumptions.payrollPerMonthUsd + assumptions.opexPerMonthUsd);
    expect(rows[2].cashEnd).toBeCloseTo(cashBeforeInvestment + 1_000_000, -3);
  });

  it("calculates cash correctly across months", () => {
    const { rows } = buildPlan(defaultAssumptions);

    // Cash should change based on collections - expenses
    for (let i = 1; i < rows.length; i++) {
      const prevCash = rows[i - 1].cashEnd;
      const collections = rows[i].collections;
      const expenses = rows[i].payroll + rows[i].opex;
      const expectedCash = prevCash + collections - expenses;
      
      // Account for investment in month 3
      if (i === 2 && defaultAssumptions.oneOffInvestmentMonth === 3) {
        expect(rows[i].cashEnd).toBeCloseTo(expectedCash + (defaultAssumptions.oneOffInvestmentAmountUsd || 0), -3);
      } else {
        expect(rows[i].cashEnd).toBeCloseTo(expectedCash, -3);
      }
    }
  });

  it("calculates summary KPIs", () => {
    const { summary } = buildPlan(defaultAssumptions);

    expect(summary.arrEnd).toBeGreaterThan(0);
    expect(summary.revenueNext).toBeGreaterThan(0);
    expect(summary.burnNext).toBeDefined();
    expect(summary.cashEnd).toBeDefined();
    expect(summary.runwayMonths).toBeDefined();
    expect(typeof summary.runwayMonths === "number" || summary.runwayMonths === "∞").toBe(true);
  });

  it("calculates runway correctly when burning cash", () => {
    const assumptions: Assumptions = {
      ...defaultAssumptions,
      startCashUsd: 500_000,
      payrollPerMonthUsd: 300_000,
      opexPerMonthUsd: 100_000,
      // Low revenue to ensure we're burning
      startArrUsd: 100_000,
    };

    const { summary } = buildPlan(assumptions);

    if (summary.burnNext > 0) {
      expect(typeof summary.runwayMonths).toBe("number");
      expect(summary.runwayMonths).toBeGreaterThan(0);
    }
  });

  it("returns infinite runway when profitable", () => {
    const assumptions: Assumptions = {
      ...defaultAssumptions,
      startCashUsd: 500_000,
      payrollPerMonthUsd: 50_000,
      opexPerMonthUsd: 20_000,
      startArrUsd: 10_000_000, // High revenue
    };

    const { summary } = buildPlan(assumptions);

    if (summary.burnNext <= 0) {
      expect(summary.runwayMonths).toBe("∞");
    }
  });
});

