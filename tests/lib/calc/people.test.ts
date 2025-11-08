import { describe, it, expect } from "vitest";
import { calculateHeadcount, calculatePayroll } from "@/lib/calc/people";
import { TeamFunction } from "@/lib/calc/drivers";

describe("calculateHeadcount", () => {
  const headcountNow: Record<TeamFunction, number> = {
    "R&D": 8,
    Sales: 3,
    Marketing: 2,
    CS: 2,
    Ops: 2,
  };

  const hiresNext6Months: Record<TeamFunction, number> = {
    "R&D": 6,
    Sales: 0,
    Marketing: 0,
    CS: 0,
    Ops: 0,
  };

  it("returns current headcount for month 0", () => {
    const headcount = calculateHeadcount(headcountNow, hiresNext6Months, 0);
    expect(headcount["R&D"]).toBe(8);
  });

  it("spreads hires over 6 months", () => {
    const headcountMonth3 = calculateHeadcount(headcountNow, hiresNext6Months, 3);
    // Should have 8 + (6/6 * 3) = 11
    expect(headcountMonth3["R&D"]).toBe(11);

    const headcountMonth6 = calculateHeadcount(headcountNow, hiresNext6Months, 6);
    // Should have 8 + 6 = 14
    expect(headcountMonth6["R&D"]).toBe(14);
  });

  it("stabilizes headcount after month 6", () => {
    const headcountMonth7 = calculateHeadcount(headcountNow, hiresNext6Months, 7);
    const headcountMonth12 = calculateHeadcount(headcountNow, hiresNext6Months, 12);
    
    expect(headcountMonth7["R&D"]).toBe(14);
    expect(headcountMonth12["R&D"]).toBe(14);
  });
});

describe("calculatePayroll", () => {
  it("calculates total payroll", () => {
    const headcount: Record<TeamFunction, number> = {
      "R&D": 10,
      Sales: 5,
      Marketing: 3,
      CS: 2,
      Ops: 2,
    };

    const avgCost: Record<TeamFunction, number> = {
      "R&D": 6_000,
      Sales: 5_000,
      Marketing: 4_000,
      CS: 3_500,
      Ops: 3_500,
    };

    const payroll = calculatePayroll(headcount, avgCost);

    const expected = 10 * 6_000 + 5 * 5_000 + 3 * 4_000 + 2 * 3_500 + 2 * 3_500;
    expect(payroll).toBe(expected);
    expect(payroll).toBe(111_000);
  });
});

