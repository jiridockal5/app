"use client";

import { useMemo } from "react";
import { useAppStore } from "@/state/store";
import { buildPlan } from "@/lib/calc/plan";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

const formatPercent = (n: number) => `${(n * 100).toFixed(2)}%`;

export default function BusinessDashboardPage() {
  const a = useAppStore((s) => s.a);
  const { rows, summary } = useMemo(() => buildPlan(a), [a]);

  const currentMonth = rows[0] ?? null;
  const lastMonth = rows.length > 1 ? rows[rows.length - 2] : null;
  const currentArr = currentMonth ? currentMonth.closingArr : 0;
  const lastMonthArr = lastMonth ? lastMonth.closingArr : 0;
  const currentSubscriptions = Math.round(currentArr / a.acvUsd);
  const revenueThisMonth = currentMonth ? currentMonth.revenue : 0;
  const lastMonthRevenue = lastMonth ? lastMonth.revenue : 0;

  // Calculate SaaS Metrics
  // LTV (Lifetime Value) = ARPU / Monthly Churn Rate
  const monthlyArpu = revenueThisMonth / Math.max(1, currentSubscriptions);
  const ltv = a.churnMonthly > 0 ? monthlyArpu / a.churnMonthly : 0;
  const annualLtv = ltv * 12;

  // CAC (Customer Acquisition Cost) - estimated from marketing/sales spend
  // Assuming ~30% of opex is sales/marketing, and divide by new customers
  const estimatedCac = a.newLogosPerMonth > 0 
    ? (a.opexPerMonthUsd * 0.3) / a.newLogosPerMonth 
    : 0;

  // LTV/CAC Ratio
  const ltvCacRatio = estimatedCac > 0 ? annualLtv / estimatedCac : 0;

  // Net Revenue Retention (NRR) = (Starting MRR + Expansion - Churn) / Starting MRR
  const startingMrr = lastMonth ? lastMonth.revenue : revenueThisMonth;
  const expansionMrr = currentMonth ? (currentMonth.upsellArr / 12) : 0;
  const churnMrr = currentMonth ? (currentMonth.churnArr / 12) : 0;
  const nrr = startingMrr > 0 
    ? ((startingMrr + expansionMrr - churnMrr) / startingMrr) * 100 
    : 100;

  // Growth Rates
  const arrGrowthRate = lastMonthArr > 0 
    ? ((currentArr - lastMonthArr) / lastMonthArr) * 100 
    : 0;
  const mrrGrowthRate = lastMonthRevenue > 0 
    ? ((revenueThisMonth - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;

  // Retention Rate (opposite of churn)
  const monthlyRetentionRate = 1 - a.churnMonthly;
  const annualRetentionRate = Math.pow(monthlyRetentionRate, 12);

  // Annual Churn Rate
  const annualChurnRate = 1 - annualRetentionRate;

  // Payback Period (Months to recover CAC)
  const paybackPeriod = monthlyArpu > 0 ? estimatedCac / monthlyArpu : 0;

  // Magic Number (Sales Efficiency) = Net New ARR / Sales & Marketing Spend (quarterly)
  const netNewArr = currentArr - (a.startArrUsd || currentArr);
  const quarterlySalesMarketing = a.opexPerMonthUsd * 0.3 * 3;
  const magicNumber = quarterlySalesMarketing > 0 
    ? netNewArr / quarterlySalesMarketing 
    : 0;

  // Chart data
  const chartData = rows.slice(0, 12).map((r) => ({
    month: `M${r.m}`,
    MRR: Math.round(r.revenue),
    Customers: Math.round(r.closingArr / a.acvUsd),
  }));

  return (
    <main className="flex-1 p-6 md:p-10 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Business Dashboard & SaaS Metrics
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive SaaS business metrics and performance indicators
          </p>
        </header>

        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Annual Recurring Revenue</div>
            <div className="text-2xl font-bold text-gray-900">
              {$$(summary.arrEnd)}
            </div>
            <div className="text-xs text-gray-400 mt-1">End of year projection</div>
            {arrGrowthRate !== 0 && (
              <div className={`text-xs mt-1 ${arrGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {arrGrowthRate >= 0 ? '↑' : '↓'} {Math.abs(arrGrowthRate).toFixed(1)}% growth
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Monthly Recurring Revenue</div>
            <div className="text-2xl font-bold text-gray-900">
              {$$(revenueThisMonth)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Current month</div>
            {mrrGrowthRate !== 0 && (
              <div className={`text-xs mt-1 ${mrrGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {mrrGrowthRate >= 0 ? '↑' : '↓'} {Math.abs(mrrGrowthRate).toFixed(1)}% growth
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Average Revenue Per User</div>
            <div className="text-2xl font-bold text-gray-900">
              {$$(monthlyArpu)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Monthly ARPU</div>
            <div className="text-xs text-gray-400 mt-1">
              Annual: {$$(monthlyArpu * 12)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Average Contract Value</div>
            <div className="text-2xl font-bold text-gray-900">
              {$$(a.acvUsd)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Per customer per year</div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Active Subscriptions</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(currentSubscriptions)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Total customers</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Customer Lifetime Value</div>
            <div className="text-2xl font-bold text-blue-600">
              {$$(annualLtv)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Annual LTV</div>
            <div className="text-xs text-gray-400">Monthly: {$$(ltv)}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Customer Acquisition Cost</div>
            <div className="text-2xl font-bold text-orange-600">
              {$$(estimatedCac)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Estimated CAC</div>
            <div className="text-xs text-gray-400">
              Payback: {paybackPeriod.toFixed(1)} months
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">LTV/CAC Ratio</div>
            <div className={`text-2xl font-bold ${
              ltvCacRatio >= 3 ? 'text-green-600' : 
              ltvCacRatio >= 1 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {ltvCacRatio.toFixed(2)}x
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {ltvCacRatio >= 3 ? 'Excellent' : 
               ltvCacRatio >= 1 ? 'Good' : 
               'Needs improvement'}
            </div>
          </div>
        </div>

        {/* Retention & Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Net Revenue Retention</div>
            <div className={`text-2xl font-bold ${
              nrr >= 100 ? 'text-green-600' : 
              nrr >= 90 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {nrr.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {nrr >= 100 ? 'Expansion > Churn' : 'Below 100%'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Monthly Churn Rate</div>
            <div className="text-2xl font-bold text-red-600">
              {formatPercent(a.churnMonthly)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Customers lost per month</div>
            <div className="text-xs text-gray-400">
              Annual: {formatPercent(annualChurnRate)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Retention Rate</div>
            <div className="text-2xl font-bold text-green-600">
              {formatPercent(annualRetentionRate)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Annual retention</div>
            <div className="text-xs text-gray-400">
              Monthly: {formatPercent(monthlyRetentionRate)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Monthly Upsell Rate</div>
            <div className="text-2xl font-bold text-green-600">
              +{formatPercent(a.upsellMonthly)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Price increase per month</div>
          </div>
        </div>

        {/* Growth & Efficiency Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">New Customers/Month</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(a.newLogosPerMonth)}
            </div>
            <div className="text-xs text-gray-400 mt-1">New logos per month</div>
            <div className="text-xs text-gray-400">
              Annual: {formatNumber(a.newLogosPerMonth * 12)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Magic Number</div>
            <div className={`text-2xl font-bold ${
              magicNumber >= 0.75 ? 'text-green-600' : 
              magicNumber >= 0.5 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {magicNumber.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Sales efficiency</div>
            <div className="text-xs text-gray-400">
              {magicNumber >= 0.75 ? 'Efficient' : 
               magicNumber >= 0.5 ? 'Moderate' : 
               'Inefficient'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">CAC Payback Period</div>
            <div className={`text-2xl font-bold ${
              paybackPeriod <= 12 ? 'text-green-600' : 
              paybackPeriod <= 18 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {paybackPeriod.toFixed(1)} months
            </div>
            <div className="text-xs text-gray-400 mt-1">Time to recover CAC</div>
            <div className="text-xs text-gray-400">
              {paybackPeriod <= 12 ? 'Healthy' : 
               paybackPeriod <= 18 ? 'Acceptable' : 
               'Too long'}
            </div>
          </div>
        </div>

        {/* Financial Health */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Financial Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">Cash Position</div>
              <div className="text-2xl font-bold text-gray-900">
                {$$(summary.cashEnd)}
              </div>
              <div className="text-xs text-gray-400 mt-1">End of year projection</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Monthly Burn</div>
              <div className="text-2xl font-bold text-red-600">
                {$$(summary.burnNext)}
              </div>
              <div className="text-xs text-gray-400 mt-1">Next month projection</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Runway</div>
              <div className="text-2xl font-bold text-gray-900">
                {summary.runwayMonths === "∞"
                  ? "∞"
                  : `${summary.runwayMonths} months`}
              </div>
              <div className="text-xs text-gray-400 mt-1">Months until cash runs out</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              MRR Growth
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData} 
                  margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                    width={65}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      $$(value),
                      "MRR"
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
                  <Legend 
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="line"
                    formatter={() => (
                      <span style={{ color: "#374151", fontSize: "13px", fontWeight: 500 }}>
                        → MRR
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="MRR"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 4, strokeWidth: 2, stroke: "white" }}
                    activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "white" }}
                    name="MRR"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Customer Growth
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={chartData} 
                  margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
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
                    tickFormatter={(value) => formatNumber(value)}
                    width={60}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatNumber(value),
                      "Customers"
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
                      color: "#8b5cf6",
                      fontWeight: 500,
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="rect"
                    formatter={(value) => (
                      <span style={{ color: "#374151", fontSize: "13px", fontWeight: 500 }}>
                        → Customers
                      </span>
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="Customers"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#customerGradient)"
                    dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 2, stroke: "white" }}
                    activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2, fill: "white" }}
                    name="Customers"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Forecast Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Monthly Forecast (First 12 Months)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ARR
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    MRR
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customers
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Collections
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Spend
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cash
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.slice(0, 12).map((row, index) => {
                  const customers = Math.round(row.closingArr / a.acvUsd);
                  const isEven = index % 2 === 0;
                  return (
                    <tr
                      key={row.m}
                      className={`transition-colors ${
                        isEven ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-blue-50/50`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Month {row.m}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {$$(row.closingArr)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {$$(row.revenue)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatNumber(customers)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 text-right font-medium">
                        {$$(row.collections)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 text-right font-medium">
                        {$$(row.payroll + row.opex)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                        {$$(row.cashEnd)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
