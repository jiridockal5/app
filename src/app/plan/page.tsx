/**
 * Plan summary page
 */

"use client";

import { useStore } from "@/state/store";
import { KpiTile } from "@/components/tiles/KpiTile";
import { ArrRevenueChart } from "@/components/charts/ArrRevenueChart";
import { CashChart } from "@/components/charts/CashChart";
import { MonthlyTable } from "@/components/tables/MonthlyTable";

export default function PlanPage() {
  const getPlan = useStore((state) => state.getPlan);
  const { rows, summary } = getPlan();

  // Calculate warnings
  const runwayWarning =
    typeof summary.runwayMonths === "number" && summary.runwayMonths < 9;
  const ltvCacWarning =
    summary.ltvCac !== null && summary.ltvCac < 2.5;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Plan Summary</h1>

        {/* KPI Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiTile
            label="Annual Revenue (End)"
            value={summary.arrEnd}
            subtitle="Annual subscriptions total at end of plan"
          />
          <KpiTile
            label="Monthly Revenue"
            value={summary.revenueNext}
            subtitle="Revenue per month"
          />
          <KpiTile
            label="Monthly Burn"
            value={summary.burnNext}
            subtitle="Monthly cash burn rate"
          />
          <KpiTile
            label="Cash Runway"
            value={
              summary.runwayMonths === "∞"
                ? "∞"
                : `${summary.runwayMonths} months`
            }
            subtitle="Months until cash would reach zero"
            warning={runwayWarning}
            warningMessage="Runway less than 9 months"
          />
          <KpiTile
            label="Net Revenue Retention"
            value={`${summary.nrrPct.toFixed(1)}%`}
            subtitle="NRR proxy"
          />
          <KpiTile
            label="LTV/CAC"
            value={
              summary.ltvCac === null
                ? "–"
                : summary.ltvCac.toFixed(2)
            }
            subtitle="Lifetime Value / Customer Acquisition Cost"
            warning={ltvCacWarning}
            warningMessage="LTV/CAC less than 2.5×"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">ARR & Revenue</h2>
            <ArrRevenueChart rows={rows} />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Cash, Collections & Spend
            </h2>
            <CashChart rows={rows} />
          </div>
        </div>

        {/* Monthly Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Plan</h2>
          <MonthlyTable rows={rows} />
        </div>
      </div>
    </div>
  );
}

