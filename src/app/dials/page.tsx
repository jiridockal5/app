"use client";

import { useMemo } from "react";
import { useAppStore } from "@/state/store";
import { buildPlan } from "@/lib/calc/plan";
import { Money } from "@/components/inputs/Money";
import { Num } from "@/components/inputs/Num";
import { Pct } from "@/components/inputs/Pct";

const $$ = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

export default function DialsPage() {
  const a = useAppStore((s) => s.a);
  const set = useAppStore((s) => s.set);
  const { rows, summary } = useMemo(() => buildPlan(a), [a]);

  const updateValue = (field: keyof typeof a, value: number) => {
    set({ [field]: value });
  };

  return (
    <main className="flex-1 p-6 md:p-10 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl md:text-3xl font-semibold">Dials</h1>
          <p className="text-sm text-gray-500 mt-2">
            Adjust key drivers and see the impact on your forecast in real-time
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Revenue Dials */}
          <section className="bg-white rounded-2xl shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold">Revenue Drivers</h2>

            <div>
              <Num
                label="New Customers per Month"
                value={a.newLogosPerMonth}
                onChange={(e) => updateValue("newLogosPerMonth", Number(e.target.value))}
                min={0}
                step={1}
                helperText="Number of new customers acquired each month"
              />
            </div>

            <div>
              <Money
                label="Average Price per Customer (ACV)"
                value={a.acvUsd}
                onChange={(e) => updateValue("acvUsd", Number(e.target.value))}
                helperText="Average annual contract value"
              />
            </div>

            <div>
              <Pct
                label="Monthly Churn Rate"
                value={a.churnMonthly}
                onChange={(e) => updateValue("churnMonthly", Number(e.target.value))}
                helperText="Percentage of customers lost each month"
                min={0}
                max={10}
                step={0.1}
              />
            </div>

            <div>
              <Pct
                label="Monthly Upsell Rate"
                value={a.upsellMonthly}
                onChange={(e) => updateValue("upsellMonthly", Number(e.target.value))}
                helperText="Percentage increase in ARR from upsells/expansions"
                min={0}
                max={10}
                step={0.1}
              />
            </div>
          </section>

          {/* Expense Dials */}
          <section className="bg-white rounded-2xl shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold">Expense Drivers</h2>

            <div>
              <Money
                label="Monthly Payroll"
                value={a.payrollPerMonthUsd}
                onChange={(e) => updateValue("payrollPerMonthUsd", Number(e.target.value))}
                helperText="Total monthly payroll costs"
              />
            </div>

            <div>
              <Money
                label="Monthly Operating Expenses"
                value={a.opexPerMonthUsd}
                onChange={(e) => updateValue("opexPerMonthUsd", Number(e.target.value))}
                helperText="Tools, ads, infrastructure, and other costs"
              />
            </div>

            <div>
              <Money
                label="Starting Cash"
                value={a.startCashUsd}
                onChange={(e) => updateValue("startCashUsd", Number(e.target.value))}
                helperText="Cash balance at the start of the forecast"
              />
            </div>
          </section>
        </div>

        {/* Real-time Impact Preview */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Impact Preview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ImpactTile
              label="ARR (End of Year)"
              value={$$(summary.arrEnd)}
              change={((summary.arrEnd - a.startArrUsd) / a.startArrUsd) * 100}
            />
            <ImpactTile
              label="Revenue (Next Month)"
              value={$$(summary.revenueNext)}
            />
            <ImpactTile
              label="Burn (Next Month)"
              value={$$(summary.burnNext)}
              isBurn={true}
            />
            <ImpactTile
              label="Runway"
              value={
                typeof summary.runwayMonths === "number"
                  ? `${summary.runwayMonths} months`
                  : "∞"
              }
              isPositive={summary.runwayMonths === "∞" || summary.runwayMonths > 12}
            />
          </div>
        </section>

        {/* Quick Stats Table */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">12-Month Summary</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="p-2">Month</th>
                  <th className="p-2 text-right">ARR</th>
                  <th className="p-2 text-right">Revenue</th>
                  <th className="p-2 text-right">Collections</th>
                  <th className="p-2 text-right">Spend</th>
                  <th className="p-2 text-right">Cash</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.m} className="border-b">
                    <td className="p-2">{row.m}</td>
                    <td className="p-2 text-right tabular-nums">{$$(row.closingArr)}</td>
                    <td className="p-2 text-right tabular-nums">{$$(row.revenue)}</td>
                    <td className="p-2 text-right tabular-nums">{$$(row.collections)}</td>
                    <td className="p-2 text-right tabular-nums">
                      {$$(row.payroll + row.opex)}
                    </td>
                    <td className="p-2 text-right tabular-nums font-medium">
                      {$$(row.cashEnd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function ImpactTile({
  label,
  value,
  change,
  isBurn,
  isPositive,
}: {
  label: string;
  value: string;
  change?: number;
  isBurn?: boolean;
  isPositive?: boolean;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
      {change !== undefined && (
        <div
          className={`text-xs mt-1 ${
            isBurn
              ? change > 0
                ? "text-red-600"
                : "text-green-600"
              : change > 0
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {change > 0 ? "+" : ""}
          {change.toFixed(1)}%
        </div>
      )}
      {isPositive !== undefined && !change && (
        <div
          className={`text-xs mt-1 ${
            isPositive ? "text-green-600" : "text-amber-600"
          }`}
        >
          {isPositive ? "Healthy" : "Monitor"}
        </div>
      )}
    </div>
  );
}

