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
  const currentArr = currentMonth ? currentMonth.closingArr : 0;
  const lastMonthArr = lastMonth ? lastMonth.closingArr : 0;
  const arrChange =
    lastMonthArr > 0 ? ((currentArr - lastMonthArr) / lastMonthArr) * 100 : 0;

  const currentSubscriptions = Math.round(currentArr / a.acvUsd);
  const lastMonthSubscriptions = Math.round(lastMonthArr / a.acvUsd);
  const subscriptionsChange =
    lastMonthSubscriptions > 0
      ? ((currentSubscriptions - lastMonthSubscriptions) /
          lastMonthSubscriptions) *
        100
      : 0;

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

  // Revenue this month
  const revenueThisMonth = currentMonth ? currentMonth.revenue : 0;
  const collectionsThisMonth = currentMonth ? currentMonth.collections : 0;
  
  // Calculate unpaid invoices (placeholder - using burn as proxy)
  const unpaidInvoices = Math.round((revenueThisMonth - collectionsThisMonth) / 1000);
  const unpaidAmount = revenueThisMonth - collectionsThisMonth;

  // Total collections for Net Payments
  const totalCollections = rows.reduce((sum, r) => sum + r.collections, 0);

  return (
    <main className="flex-1 p-6 md:p-10 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Cards - 5 cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <KpiCard
            title="Total MRR"
            primaryValue={$$(revenueThisMonth)}
            secondaryValue={`Total ARR ${$$(currentArr)}`}
            change={{
              value: `${arrChange.toFixed(2)}%`,
              isPositive: arrChange >= 0,
            }}
          />
          <KpiCard
            title="Total Active Subscriptions"
            primaryValue={formatNumber(currentSubscriptions)}
            change={{
              value: `${subscriptionsChange.toFixed(2)}%`,
              isPositive: subscriptionsChange >= 0,
            }}
          />
          <KpiCard
            title="Net Billing"
            primaryValue={$$(summary.arrEnd)}
          />
          <KpiCard
            title="Net Payments"
            primaryValue={$$(totalCollections)}
          />
          <KpiCard
            title="Unpaid Invoices"
            primaryValue={formatNumber(Math.max(0, unpaidInvoices))}
            secondaryValue={$$(Math.max(0, unpaidAmount))}
          />
        </div>

        {/* Charts - 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard
            title="Total Billing"
            primaryValue={$$(revenueThisMonth)}
            secondaryValue={`Previous: ${$$(lastMonth ? lastMonth.revenue : revenueThisMonth)}`}
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
