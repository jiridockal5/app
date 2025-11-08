"use client";

import { useMemo } from "react";
import { useAppStore } from "@/state/store";
import { buildPlan } from "@/lib/calc/plan";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const $$ = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

const formatNumber = (n: number) =>
  n.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

export default function HomePage() {
  const a = useAppStore((s) => s.a);
  const { rows, summary } = useMemo(() => buildPlan(a), [a]);

  // Calculate metrics for KPIs
  const currentMonth = rows[0] ?? null;
  const lastMonth = rows.length > 1 ? rows[rows.length - 2] : rows[0] ?? null;
  
  // Revenue (MRR)
  const revenue = currentMonth ? currentMonth.revenue : 0;
  const lastMonthRevenue = lastMonth ? lastMonth.revenue : 0;
  const revenueChange =
    lastMonthRevenue > 0 ? ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

  // Cost of Sales (typically includes direct costs related to revenue generation)
  // For SaaS, this is often minimal, but can include payment processing, hosting costs, etc.
  // Using a percentage of revenue as a proxy (typically 5-10% for SaaS)
  const costOfSales = revenue * 0.05; // 5% of revenue

  // Gross Margin = Revenue - Cost of Sales
  const grossMargin = revenue - costOfSales;
  const grossMarginPercent = revenue > 0 ? (grossMargin / revenue) * 100 : 0;

  // Operating Cost = Payroll + Opex
  const operatingCost = (currentMonth ? currentMonth.payroll : 0) + (currentMonth ? currentMonth.opex : 0);
  const lastMonthOperatingCost = (lastMonth ? lastMonth.payroll : 0) + (lastMonth ? lastMonth.opex : 0);
  const operatingCostChange =
    lastMonthOperatingCost > 0
      ? ((operatingCost - lastMonthOperatingCost) / lastMonthOperatingCost) * 100
      : 0;

  // EBITDA = Revenue - Cost of Sales - Operating Cost
  const ebitda = revenue - costOfSales - operatingCost;
  const lastMonthEbitda = lastMonthRevenue - (lastMonthRevenue * 0.05) - lastMonthOperatingCost;
  const ebitdaChange =
    lastMonthEbitda !== 0 ? ((ebitda - lastMonthEbitda) / Math.abs(lastMonthEbitda)) * 100 : 0;

  // Calculate additional metrics for second row of KPIs
  // Current and previous ARR
  const currentArr = currentMonth ? currentMonth.closingArr : a.startArrUsd;
  const previousArr = lastMonth ? lastMonth.closingArr : a.startArrUsd;
  const arrChange = currentArr - previousArr;
  const arrGrowthRate = previousArr > 0 ? ((currentArr - previousArr) / previousArr) * 100 : 0;

  // Magic Number: (ΔARR × 4) / S&M spend (prev Q)
  // Quarterly ARR change (annualized by ×4) divided by previous quarter's S&M spend
  // Using last 3 months vs previous 3 months for quarterly comparison
  // Assuming 30% of OPEX is Sales & Marketing
  const smSpendMonthly = a.opexPerMonthUsd * 0.3;
  const smSpendQuarterly = smSpendMonthly * 3;
  
  // Get quarterly ARR change (using last 3 months vs previous 3 months)
  // For simplicity, using current month vs 3 months ago as proxy for quarterly change
  const quarterAgoMonth = rows.length > 3 ? rows[rows.length - 4] : rows[0] ?? null;
  const quarterAgoArr = quarterAgoMonth ? quarterAgoMonth.closingArr : a.startArrUsd;
  const quarterlyArrChange = currentArr - quarterAgoArr;
  
  // Magic Number: (Quarterly ARR change × 4) / Previous quarter S&M spend
  // The ×4 annualizes the quarterly change
  const magicNumber = smSpendQuarterly > 0 ? (quarterlyArrChange * 4) / smSpendQuarterly : 0;

  // Burn Multiple: Net Burn / Net New ARR
  // Net Burn = negative EBITDA (if burning cash)
  const netBurn = Math.max(0, -ebitda); // Only positive burn
  const netNewArr = Math.max(0, arrChange); // Only positive ARR growth
  const burnMultiple = netNewArr > 0 ? netBurn / (netNewArr / 12) : (netBurn > 0 ? Infinity : 0);

  // Rule of 40: Growth % + EBITDA % ≥ 40%
  // Annualized growth rate + EBITDA margin
  const annualizedGrowthRate = arrGrowthRate * 12; // Monthly growth annualized
  const ebitdaMargin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
  const ruleOf40 = annualizedGrowthRate + ebitdaMargin;

  // Gross Margin %: Already calculated as grossMarginPercent

  // Operating Margin %: EBIT / Revenue
  // In our model, EBIT ≈ EBITDA (no separate interest/tax/depreciation)
  const operatingMargin = revenue > 0 ? (ebitda / revenue) * 100 : 0;

  // Chart data - using last 12 months or available data
  const chartData = rows.slice(-12).map((r) => ({
    month: `M${r.m}`,
    date: `Nov ${r.m}`,
    ARR: Math.round(r.closingArr),
    Revenue: Math.round(r.revenue),
    Collections: Math.round(r.collections),
    Spend: Math.round(r.payroll + r.opex),
    Cash: Math.round(r.cashEnd),
    Billing: Math.round(r.revenue),
    NewBilling: Math.round(r.newArr / 12),
  }));

  return (
    <main className="flex-1 p-6 md:p-10 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Cards - 5 cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <KpiCard
            title="Revenue"
            primaryValue={$$(revenue)}
            change={{
              value: `${revenueChange.toFixed(2)}%`,
              isPositive: revenueChange >= 0,
            }}
            tooltip="Monthly Recurring Revenue (MRR)\n\nMonthly revenue from active subscriptions.\n\nBenchmark: Positive growth indicates healthy business expansion."
          />
          <KpiCard
            title="Cost of Sales"
            primaryValue={$$(costOfSales)}
            secondaryValue={`${((costOfSales / revenue) * 100).toFixed(1)}% of revenue`}
            tooltip="Cost of Sales (COGS)\n\nDirect costs to deliver service (payment processing, hosting, infrastructure).\n\nBenchmark: 5-10% of revenue is typical for SaaS. Lower is better."
          />
          <KpiCard
            title="Gross Margin"
            primaryValue={$$(grossMargin)}
            secondaryValue={`${grossMarginPercent.toFixed(1)}% margin`}
            change={{
              value: `${grossMarginPercent.toFixed(1)}%`,
              isPositive: grossMarginPercent >= 0,
            }}
            tooltip="Gross Profit Margin\n\nRevenue minus Cost of Sales. Profitability before operating expenses.\n\nBenchmark: 75-90% is typical for SaaS. Below 70% indicates high infrastructure costs."
          />
          <KpiCard
            title="Operating Cost"
            primaryValue={$$(operatingCost)}
            change={{
              value: `${operatingCostChange.toFixed(2)}%`,
              isPositive: operatingCostChange <= 0,
            }}
            tooltip="Operating Expenses\n\nTotal monthly costs: payroll + operational expenses (tools, ads, infrastructure).\n\nBenchmark: Monitor for efficiency. Lower relative to revenue indicates better unit economics."
          />
          <KpiCard
            title="EBITDA"
            primaryValue={$$(ebitda)}
            change={{
              value: `${ebitdaChange.toFixed(2)}%`,
              isPositive: ebitdaChange >= 0,
            }}
            tooltip="EBITDA\n\nEarnings Before Interest, Taxes, Depreciation, and Amortization.\nFormula: Revenue - Cost of Sales - Operating Costs\n\nBenchmark: Positive = profitable. Negative = burning cash. Track path to profitability."
          />
        </div>

        {/* KPI Cards - Second Row - 5 cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <KpiCard
            title="Magic Number"
            primaryValue={magicNumber.toFixed(2)}
            secondaryValue={
              magicNumber >= 0.7
                ? "Healthy"
                : magicNumber >= 0.5
                ? "Moderate"
                : "Needs improvement"
            }
            change={{
              value: magicNumber >= 1.0 ? "Excellent" : magicNumber >= 0.7 ? "Good" : "Low",
              isPositive: magicNumber >= 0.7,
            }}
            tooltip="Magic Number\n\nSales efficiency metric: (ΔARR × 4) / S&M spend (previous quarter)\n\nBenchmark: 0.7-1.0+ = healthy | >1.0 = excellent | <0.5 = needs improvement"
          />
          <KpiCard
            title="Burn Multiple"
            primaryValue={burnMultiple === Infinity ? "∞" : burnMultiple.toFixed(2)}
            secondaryValue={
              burnMultiple < 1
                ? "Excellent"
                : burnMultiple < 2
                ? "Good"
                : burnMultiple === Infinity
                ? "No ARR growth"
                : "Poor"
            }
            change={{
              value:
                burnMultiple < 1
                  ? "Excellent"
                  : burnMultiple < 2
                  ? "Good"
                  : burnMultiple === Infinity
                  ? "N/A"
                  : "Poor",
              isPositive: burnMultiple < 2 && burnMultiple !== Infinity,
            }}
            tooltip="Burn Multiple\n\nCash efficiency: Net Burn / Net New ARR\n\nBenchmark: <1 = excellent | 1-2 = good | >2 = poor | Lower is better"
          />
          <KpiCard
            title="Rule of 40"
            primaryValue={`${ruleOf40.toFixed(1)}%`}
            secondaryValue={ruleOf40 >= 40 ? "On target" : `${(40 - ruleOf40).toFixed(1)}% below target`}
            change={{
              value: ruleOf40 >= 40 ? "Healthy" : "Below target",
              isPositive: ruleOf40 >= 40,
            }}
            tooltip="Rule of 40\n\nBalances growth and profitability: Growth % + EBITDA %\n\nBenchmark: ≥40% = healthy SaaS business | Trade off growth vs profitability"
          />
          <KpiCard
            title="Gross Margin %"
            primaryValue={`${grossMarginPercent.toFixed(1)}%`}
            secondaryValue={
              grossMarginPercent >= 75
                ? "Excellent"
                : grossMarginPercent >= 70
                ? "Good"
                : "Infra heavy"
            }
            change={{
              value:
                grossMarginPercent >= 75
                  ? "Excellent"
                  : grossMarginPercent >= 70
                  ? "Good"
                  : "Low",
              isPositive: grossMarginPercent >= 70,
            }}
            tooltip="Gross Margin %\n\nProfitability: (Revenue – COGS) / Revenue\n\nBenchmark: 75-90% = typical SaaS | <70% = infrastructure heavy"
          />
          <KpiCard
            title="Operating Margin %"
            primaryValue={`${operatingMargin.toFixed(1)}%`}
            secondaryValue={operatingMargin >= 0 ? "Profitable" : "Burning cash"}
            change={{
              value: operatingMargin >= 0 ? "Positive" : "Negative",
              isPositive: operatingMargin >= 0,
            }}
            tooltip="Operating Margin %\n\nOperating profitability: EBIT / Revenue\n\nBenchmark: Positive = profitable | Negative = burning cash | Tracks path to breakeven"
          />
        </div>

        {/* Charts - 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard
            title="Total Billing"
            primaryValue={$$(revenue)}
            secondaryValue={`Previous: ${$$(lastMonth ? lastMonth.revenue : revenue)}`}
          >
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorBilling" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb" 
                    vertical={false}
                    strokeWidth={1}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                    tickLine={{ stroke: "#d1d5db" }}
                    axisLine={{ stroke: "#d1d5db" }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                    tickLine={{ stroke: "#d1d5db" }}
                    axisLine={{ stroke: "#d1d5db" }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    width={60}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      $$(value),
                      "Billing"
                    ]}
                    labelFormatter={(label) => `Month ${label}`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      padding: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "4px",
                    }}
                    itemStyle={{
                      color: "#3b82f6",
                      fontWeight: 500,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Billing"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorBilling)"
                    dot={false}
                    activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "white" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Total New Billing"
            primaryValue={$$((currentMonth?.newArr ?? 0) / 12)}
            secondaryValue={`Previous: ${$$((lastMonth?.newArr ?? 0) / 12)}`}
          >
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorNewBilling" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb" 
                    vertical={false}
                    strokeWidth={1}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                    tickLine={{ stroke: "#d1d5db" }}
                    axisLine={{ stroke: "#d1d5db" }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                    tickLine={{ stroke: "#d1d5db" }}
                    axisLine={{ stroke: "#d1d5db" }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    width={60}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      $$(value),
                      "New Billing"
                    ]}
                    labelFormatter={(label) => `Month ${label}`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      padding: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "4px",
                    }}
                    itemStyle={{
                      color: "#10b981",
                      fontWeight: 500,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="NewBilling"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorNewBilling)"
                    dot={false}
                    activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "white" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </main>
  );
}
