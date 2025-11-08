import { Assumptions, MonthRow, PlanSummary } from "./types";

export function buildPlan(a: Assumptions): {
  rows: MonthRow[];
  summary: PlanSummary;
} {
  const N = a.horizonMonths;
  const rows: MonthRow[] = [];
  let openingArr = a.startArrUsd;
  let prevRevenue = openingArr / 12;
  let cash = a.startCashUsd;

  for (let m = 1; m <= N; m++) {
    const newArr = a.newLogosPerMonth * a.acvUsd;
    const churnArr = openingArr * a.churnMonthly;
    const upsellArr = openingArr * a.upsellMonthly;
    const closingArr = Math.max(0, openingArr + newArr - churnArr + upsellArr);

    const revenue = closingArr / 12;
    const [c0, c1] = a.collectSplit;
    const collections = revenue * c0 + prevRevenue * c1;

    const payroll = a.payrollPerMonthUsd;
    const opex = a.opexPerMonthUsd;
    const burn = payroll + opex - collections;

    if (
      a.oneOffInvestmentMonth &&
      a.oneOffInvestmentAmountUsd &&
      m === a.oneOffInvestmentMonth
    ) {
      cash += a.oneOffInvestmentAmountUsd;
    }
    cash += collections - (payroll + opex);

    rows.push({
      m,
      openingArr,
      newArr,
      churnArr,
      upsellArr,
      closingArr,
      revenue,
      collections,
      payroll,
      opex,
      burn,
      cashEnd: cash,
    });

    prevRevenue = revenue;
    openingArr = closingArr;
  }

  const end = rows[rows.length - 1];
  const revenueNext = rows[0]?.revenue ?? 0;
  const burnNext = rows[0]?.burn ?? 0;
  let runway: number | "∞" = "∞";
  if (burnNext > 0)
    runway = Math.max(1, Math.round(a.startCashUsd / burnNext));

  return {
    rows,
    summary: {
      arrEnd: end?.closingArr ?? a.startArrUsd,
      revenueNext,
      burnNext,
      cashEnd: end?.cashEnd ?? a.startCashUsd,
      runwayMonths: runway,
    },
  };
}
