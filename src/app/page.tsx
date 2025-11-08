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
  n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
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
            tooltip="Monthly Recurring Revenue (MRR)\nTotal revenue recognized this month"
          />
          <KpiCard
            title="Cost of Sales"
            primaryValue={$$(costOfSales)}
            secondaryValue={`${((costOfSales / revenue) * 100).toFixed(1)}% of revenue`}
            tooltip="Direct costs associated with revenue generation\nIncludes payment processing, hosting, and other direct costs"
          />
          <KpiCard
            title="Gross Margin"
            primaryValue={$$(grossMargin)}
            secondaryValue={`${grossMarginPercent.toFixed(1)}% margin`}
            change={{
              value: `${grossMarginPercent.toFixed(1)}%`,
              isPositive: grossMarginPercent >= 0,
            }}
            tooltip="Revenue minus Cost of Sales\nShows profitability before operating expenses"
          />
          <KpiCard
            title="Operating Cost"
            primaryValue={$$(operatingCost)}
            change={{
              value: `${operatingCostChange.toFixed(2)}%`,
              isPositive: operatingCostChange <= 0,
            }}
            tooltip="Total operating expenses\nIncludes payroll and operational expenses (OPEX)"
          />
          <KpiCard
            title="EBITDA"
            primaryValue={$$(ebitda)}
            change={{
              value: `${ebitdaChange.toFixed(2)}%`,
              isPositive: ebitdaChange >= 0,
            }}
            tooltip="Earnings Before Interest, Taxes, Depreciation, and Amortization\nRevenue - Cost of Sales - Operating Costs"
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
