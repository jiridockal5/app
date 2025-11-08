import { describe, it, expect } from "vitest";
import { calculateTopline } from "@/lib/calc/topline";
import { defaultAssumptions } from "@/lib/calc/drivers";

describe("calculateTopline", () => {
  it("calculates topline for first month", () => {
    const result = calculateTopline(defaultAssumptions, 1, 0);

    expect(result.newLogos).toBe(30);
    expect(result.newArr).toBe(30 * 6000); // 180,000
    // Opening ARR is 2_400_000 for first month
    expect(result.churnArr).toBeCloseTo(2_400_000 * 0.008); // 19,200
    expect(result.upsellArr).toBeCloseTo(2_400_000 * 0.003); // 7,200
    expect(result.closingArr).toBeGreaterThan(0);
    expect(result.revenue).toBe(result.closingArr / 12);
  });

  it("calculates topline for subsequent month", () => {
    const prevClosingArr = 2_500_000;
    const result = calculateTopline(defaultAssumptions, 2, prevClosingArr);

    expect(result.churnArr).toBeCloseTo(prevClosingArr * 0.008);
    expect(result.upsellArr).toBeCloseTo(prevClosingArr * 0.003);
    expect(result.closingArr).toBeGreaterThan(0);
  });
});

