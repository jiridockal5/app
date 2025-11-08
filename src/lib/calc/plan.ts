/**
 * Plan orchestrator: builds complete plan from assumptions
 */

import { Assumptions, MonthRow, PlanSummary } from "./drivers";
import { calculateTopline } from "./topline";
import { calculateCollections, calculateCash } from "./cash";
import { calculateHeadcount, calculatePayroll } from "./people";
import { calculateOpex } from "./spend";
import { calculateKPIs } from "./kpis";

/**
 * Build complete plan from assumptions
 */
export function buildPlan(assumptions: Assumptions): {
  rows: MonthRow[];
  summary: PlanSummary;
} {
  const rows: MonthRow[] = [];
  let prevCash = assumptions.startCashUsd;
  let prevRevenue = assumptions.startArrUsd / 12;
  let prevClosingArr = assumptions.startArrUsd;

  for (let month = 1; month <= assumptions.horizonMonths; month++) {
    // Topline
    const topline = calculateTopline(assumptions, month, prevClosingArr);

    // Collections
    const collections = calculateCollections(
      topline.revenue,
      prevRevenue,
      assumptions.collectSplit
    );

    // People
    const headcount = calculateHeadcount(
      assumptions.headcountNow,
      assumptions.hiresNext6Months,
      month
    );
    const payroll = calculatePayroll(headcount, assumptions.avgCostPerFteUsd);

    // Spend
    const opex = calculateOpex(assumptions.spendMonthlyUsd);

    // Investment
    const investment =
      month === assumptions.oneOffInvestmentMonth
        ? assumptions.oneOffInvestmentAmountUsd || 0
        : 0;

    // Cash
    const cashEnd = calculateCash(prevCash, collections, payroll, opex, investment);

    // Burn
    const burn = payroll + opex - collections;

    // Month row
    rows.push({
      m: month,
      openingArr: month === 1 ? assumptions.startArrUsd : prevClosingArr,
      newArr: topline.newArr,
      churnArr: topline.churnArr,
      upsellArr: topline.upsellArr,
      closingArr: topline.closingArr,
      revenue: topline.revenue,
      collections,
      payroll,
      opex,
      burn,
      cashEnd,
      newLogos: topline.newLogos,
    });

    // Update for next iteration
    prevCash = cashEnd;
    prevRevenue = topline.revenue;
    prevClosingArr = topline.closingArr;
  }

  // Summary
  const lastRow = rows[rows.length - 1];
  const nextRow = rows.length > 1 ? rows[rows.length - 2] : lastRow;
  const kpis = calculateKPIs(rows, assumptions);

  const summary: PlanSummary = {
    arrEnd: lastRow.closingArr,
    revenueNext: nextRow.revenue,
    burnNext: nextRow.burn,
    cashEnd: lastRow.cashEnd,
    runwayMonths: kpis.runwayMonths,
    nrrPct: kpis.nrrPct,
    ltv: kpis.ltv,
    cac: kpis.cac,
    ltvCac: kpis.ltvCac,
  };

  return { rows, summary };
}

