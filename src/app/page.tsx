"use client";

import { useMemo } from "react";
import { useAppStore } from "@/state/store";
import { buildPlan } from "@/lib/calc/plan";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
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
            updated="16 minutes ago"
          />
          <KpiCard
            title="Total Active Subscriptions"
            primaryValue={formatNumber(currentSubscriptions)}
            change={{
              value: `${subscriptionsChange.toFixed(2)}%`,
              isPositive: subscriptionsChange >= 0,
            }}
            updated="16 minutes ago"
          />
          <KpiCard
            title="Net Billing"
            primaryValue={$$(summary.arrEnd)}
            updated="16 minutes ago"
          />
          <KpiCard
            title="Net Payments"
            primaryValue={$$(totalCollections)}
            updated="16 minutes ago"
          />
          <KpiCard
            title="Unpaid Invoices"
            primaryValue={formatNumber(Math.max(0, unpaidInvoices))}
            secondaryValue={$$(Math.max(0, unpaidAmount))}
            updated="16 minutes ago"
          />
        </div>

        {/* Summary Cards - 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            title="REVENUE THIS MONTH"
            items={[
              { label: "Expected", value: $$(revenueThisMonth) },
              { label: "Received", value: $$(collectionsThisMonth) },
              {
                label: "Last month",
                value: $$(lastMonth ? lastMonth.revenue : 0),
              },
            ]}
            updated="16 minutes ago"
          />
          <SummaryCard
            title="TODAY'S REVENUE"
            items={[
              { label: "Expected", value: $$(revenueThisMonth / 30) },
              { label: "Received", value: $$(collectionsThisMonth / 30) },
              { label: "Yesterday", value: $$(revenueThisMonth / 30) },
            ]}
          />
          <SummaryCard
            title="SIGNUPS THIS MONTH"
            items={[
              { label: "Total", value: formatNumber(a.newLogosPerMonth) },
              {
                label: "Last month",
                value: formatNumber(a.newLogosPerMonth),
              },
            ]}
          />
          <SummaryCard
            title="SIGNUPS TODAY"
            items={[
              { label: "Total", value: formatNumber(Math.round(a.newLogosPerMonth / 30)) },
              { label: "Yesterday", value: "0" },
            ]}
          />
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              Daily
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200">
              3 months
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200">
              6 months
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200">
              12 months
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
              <option>All (USD)</option>
            </select>
          </div>
        </div>

        {/* Charts - 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard
            title="Total Billing"
            primaryValue={$$(revenueThisMonth)}
            secondaryValue={`Oct ${$$(lastMonth ? lastMonth.revenue : revenueThisMonth)}`}
            updated="16 minutes ago"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBilling" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value: number) => $$(value)}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Billing"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorBilling)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Total New Billing"
            primaryValue={$$((currentMonth?.newArr ?? 0) / 12)}
            secondaryValue={`Oct ${$$((lastMonth?.newArr ?? 0) / 12)}`}
            updated="16 minutes ago"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorNewBilling" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value: number) => $$(value)}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="NewBilling"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorNewBilling)"
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
