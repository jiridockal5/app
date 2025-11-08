import { describe, it, expect } from "vitest";
import { calculateCollections, calculateCash } from "@/lib/calc/cash";

describe("calculateCollections", () => {
  it("calculates collections with split", () => {
    const revenue = 200_000;
    const prevRevenue = 190_000;
    const collectSplit: [number, number] = [0.25, 0.75];

    const collections = calculateCollections(revenue, prevRevenue, collectSplit);

    expect(collections).toBe(200_000 * 0.25 + 190_000 * 0.75);
    expect(collections).toBe(192_500);
  });
});

describe("calculateCash", () => {
  it("calculates cash without investment", () => {
    const prevCash = 500_000;
    const collections = 200_000;
    const payroll = 100_000;
    const opex = 50_000;

    const cash = calculateCash(prevCash, collections, payroll, opex);

    expect(cash).toBe(500_000 + 200_000 - 100_000 - 50_000);
    expect(cash).toBe(550_000);
  });

  it("calculates cash with investment", () => {
    const prevCash = 500_000;
    const collections = 200_000;
    const payroll = 100_000;
    const opex = 50_000;
    const investment = 1_000_000;

    const cash = calculateCash(prevCash, collections, payroll, opex, investment);

    expect(cash).toBe(500_000 + 200_000 - 100_000 - 50_000 + 1_000_000);
    expect(cash).toBe(1_550_000);
  });
});

