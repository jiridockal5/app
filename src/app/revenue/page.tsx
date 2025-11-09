"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const formatCurrency = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

const formatNumber = (n: number) => n.toLocaleString("en-US");

export default function RevenueForecastPage() {
  const [settings, setSettings] = useState({
    months: 24,
    starting_mrr: 10000,
  });

  const [plg, setPlg] = useState({
    enabled: true,
    signups: 5000,
    activation_rate: 0.4, // 40% activation rate (users who activate/trial)
    conversion_rate: 0.03, // 3% conversion rate (activated users who convert to paid)
    arpu: 25, // Average Revenue Per User per month
  });

  const [sales, setSales] = useState({
    enabled: true,
    pipeline_value: 150000,
    win_rate: 0.2,
    sales_cycle_months: 2,
    acv: 4800,
  });

  const [partners, setPartners] = useState({
    enabled: true,
    partners_active: 10,
    new_partners_per_month: 2,
    avg_customers_per_partner: 4,
    arpu: 40,
    commission_rate: 0.2,
  });

  const forecastRevenue = useMemo(() => {
    const months = settings.months;
    let mrr = settings.starting_mrr;
    const result: Array<{
      month: number;
      newMRR: number;
      endingMRR: number;
      ARR: number;
    }> = [];

    for (let month = 1; month <= months; month++) {
      let newMRR = 0;

      if (plg.enabled) {
        // PLG Revenue = Signups × Activation Rate × Conversion Rate × ARPU
        const plgRevenue = plg.signups * plg.activation_rate * plg.conversion_rate * plg.arpu;
        newMRR += plgRevenue;
      }

      if (sales.enabled) {
        const closedValue =
          (sales.pipeline_value * sales.win_rate) / Math.max(1, sales.sales_cycle_months);
        newMRR += closedValue / 12;
      }

      if (partners.enabled) {
        const effectivePartners =
          partners.partners_active + (month - 1) * partners.new_partners_per_month;
        const partnerMRR =
          effectivePartners *
          partners.avg_customers_per_partner *
          partners.arpu *
          (1 - partners.commission_rate);
        newMRR += partnerMRR;
      }

      const netNewMRR = newMRR;
      mrr += netNewMRR;

      result.push({
        month,
        newMRR: Math.round(newMRR),
        endingMRR: Math.round(mrr),
        ARR: Math.round(mrr * 12),
      });
    }

    return result;
  }, [settings, plg, sales, partners]);

  const data = forecastRevenue;
  const summary = useMemo(() => {
    const last = data[data.length - 1];
    const first = data[0];
    const totalNewMRR = data.reduce((sum, row) => sum + row.newMRR, 0);
    const avgNewMRR = totalNewMRR / data.length;
    const growth = first.endingMRR > 0 
      ? ((last.endingMRR - first.endingMRR) / first.endingMRR) * 100 
      : 0;

    return {
      startingMRR: first.endingMRR - first.newMRR,
      endingMRR: last.endingMRR,
      endingARR: last.ARR,
      totalNewMRR,
      avgNewMRR,
      growth,
    };
  }, [data]);

  return (
    <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Revenue Forecast
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Project your SaaS revenue growth across multiple acquisition channels
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <span className="text-sm text-gray-600">Forecast Period:</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={settings.months}
                  onChange={(e) =>
                    setSettings({ ...settings, months: parseInt(e.target.value || "1") })
                  }
                  className="w-16 text-center font-semibold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-600">months</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <span className="text-sm text-gray-600">Starting MRR:</span>
                <input
                  type="number"
                  step="any"
                  value={settings.starting_mrr}
                  onChange={(e) =>
                    setSettings({ ...settings, starting_mrr: parseFloat(e.target.value) || 0 })
                  }
                  className="w-24 text-center font-semibold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Starting MRR"
            value={formatCurrency(summary.startingMRR)}
            icon="📊"
            trend={null}
          />
          <KPICard
            label="Ending MRR"
            value={formatCurrency(summary.endingMRR)}
            icon="🎯"
            trend={summary.growth > 0 ? `+${summary.growth.toFixed(1)}%` : null}
          />
          <KPICard
            label="Ending ARR"
            value={formatCurrency(summary.endingARR)}
            icon="💰"
            trend={null}
          />
          <KPICard
            label="Avg New MRR/Month"
            value={formatCurrency(summary.avgNewMRR)}
            icon="📈"
            trend={null}
          />
        </div>

        {/* Channel Toggles */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Channels</h2>
          <div className="flex flex-wrap gap-4">
            {[
              ["PLG", plg, setPlg, "🚀", "Product-Led Growth"],
              ["Sales", sales, setSales, "💼", "Sales Team"],
              ["Partners", partners, setPartners, "🤝", "Partner Channel"],
            ].map(([key, state, setState, icon, label]: any) => (
              <ToggleSwitch
                key={key}
                label={label}
                icon={icon}
                enabled={state.enabled}
                onChange={(enabled) => setState({ ...state, enabled })}
              />
            ))}
          </div>
        </div>

        {/* Input Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plg.enabled && (
            <div className="lg:col-span-1">
              <InputCard
                title="Product-Led Growth"
                icon="🚀"
                color="blue"
                formula="Revenue = Signups × Activation Rate × Conversion Rate × ARPU"
                inputs={[
                {
                  key: "signups",
                  label: "Monthly Signups",
                  value: plg.signups,
                  onChange: (v) => setPlg({ ...plg, signups: v }),
                  type: "number",
                  format: formatNumber,
                  description: "Total monthly user signups",
                },
                {
                  key: "activation_rate",
                  label: "Activation Rate",
                  value: plg.activation_rate * 100,
                  onChange: (v) => {
                    if (!isNaN(v)) setPlg({ ...plg, activation_rate: v / 100 });
                  },
                  type: "percentage",
                  description: "% of signups that activate/trial",
                },
                {
                  key: "conversion_rate",
                  label: "Conversion Rate",
                  value: plg.conversion_rate * 100,
                  onChange: (v) => {
                    if (!isNaN(v)) setPlg({ ...plg, conversion_rate: v / 100 });
                  },
                  type: "percentage",
                  description: "% of activated users that convert to paid",
                },
                {
                  key: "arpu",
                  label: "ARPU (Monthly)",
                  value: plg.arpu,
                  onChange: (v) => setPlg({ ...plg, arpu: v }),
                  type: "currency",
                  description: "Average Revenue Per User per month",
                },
              ]}
              />
            </div>
          )}

          {sales.enabled && (
            <InputCard
              title="Sales"
              icon="💼"
              color="green"
              inputs={[
                {
                  key: "pipeline_value",
                  label: "Pipeline Value",
                  value: sales.pipeline_value,
                  onChange: (v) => setSales({ ...sales, pipeline_value: v }),
                  type: "currency",
                },
                {
                  key: "win_rate",
                  label: "Win Rate",
                  value: sales.win_rate * 100,
                  onChange: (v) => {
                    if (!isNaN(v)) setSales({ ...sales, win_rate: v / 100 });
                  },
                  type: "percentage",
                },
                {
                  key: "sales_cycle_months",
                  label: "Sales Cycle (Months)",
                  value: sales.sales_cycle_months,
                  onChange: (v) => setSales({ ...sales, sales_cycle_months: v }),
                  type: "number",
                  format: (n) => n.toFixed(1),
                },
                {
                  key: "acv",
                  label: "ACV",
                  value: sales.acv,
                  onChange: (v) => setSales({ ...sales, acv: v }),
                  type: "currency",
                },
              ]}
            />
          )}

          {partners.enabled && (
            <InputCard
              title="Partners"
              icon="🤝"
              color="purple"
              inputs={[
                {
                  key: "partners_active",
                  label: "Active Partners",
                  value: partners.partners_active,
                  onChange: (v) => setPartners({ ...partners, partners_active: v }),
                  type: "number",
                  format: formatNumber,
                },
                {
                  key: "new_partners_per_month",
                  label: "New Partners/Month",
                  value: partners.new_partners_per_month,
                  onChange: (v) => setPartners({ ...partners, new_partners_per_month: v }),
                  type: "number",
                  format: formatNumber,
                },
                {
                  key: "avg_customers_per_partner",
                  label: "Avg Customers/Partner",
                  value: partners.avg_customers_per_partner,
                  onChange: (v) => setPartners({ ...partners, avg_customers_per_partner: v }),
                  type: "number",
                  format: formatNumber,
                },
                {
                  key: "arpu",
                  label: "ARPU (Monthly)",
                  value: partners.arpu,
                  onChange: (v) => setPartners({ ...partners, arpu: v }),
                  type: "currency",
                },
                {
                  key: "commission_rate",
                  label: "Commission Rate",
                  value: partners.commission_rate * 100,
                  onChange: (v) => {
                    if (!isNaN(v)) setPartners({ ...partners, commission_rate: v / 100 });
                  },
                  type: "percentage",
                },
              ]}
            />
          )}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Monthly Recurring Revenue</h2>
              <p className="text-sm text-gray-500">Projected MRR growth over time</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <span className="text-sm font-medium text-blue-700">MRR</span>
            </div>
          </div>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={data} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  vertical={false}
                  strokeOpacity={0.6}
                />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 500 }}
                  tickLine={{ stroke: "#d1d5db" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  label={{ 
                    value: "Month", 
                    position: "insideBottom", 
                    offset: -8, 
                    fill: "#6b7280",
                    fontSize: 13,
                    fontWeight: 600
                  }}
                  tickMargin={10}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 500 }}
                  tickLine={{ stroke: "#d1d5db" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  width={75}
                  tickMargin={10}
                  label={{ 
                    value: "MRR", 
                    angle: -90, 
                    position: "insideLeft", 
                    fill: "#6b7280",
                    fontSize: 13,
                    fontWeight: 600,
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "16px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    backdropFilter: "blur(10px)",
                  }}
                  labelStyle={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                  itemStyle={{
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Month ${label}`}
                  cursor={{ stroke: "#3b82f6", strokeWidth: 2, strokeDasharray: "5 5" }}
                />
                <Area
                  type="monotone"
                  dataKey="endingMRR"
                  stroke="none"
                  fill="url(#mrrGradient)"
                  fillOpacity={1}
                />
                <Line
                  type="monotone"
                  dataKey="endingMRR"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={false}
                  activeDot={{ 
                    r: 8, 
                    stroke: "#2563eb", 
                    strokeWidth: 3, 
                    fill: "#ffffff",
                    filter: "drop-shadow(0 4px 6px rgba(59, 130, 246, 0.3))"
                  }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Forecast</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    New MRR
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ending MRR
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ARR
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr
                    key={row.month}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right tabular-nums text-gray-700">
                      {formatCurrency(row.newMRR)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right tabular-nums font-semibold text-gray-900">
                      {formatCurrency(row.endingMRR)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right tabular-nums text-green-600 font-medium">
                      {formatCurrency(row.ARR)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function KPICard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string;
  icon: string;
  trend: string | null;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <p className="text-sm font-medium text-gray-600">{label}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 font-medium mt-1">{trend} growth</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({
  label,
  icon,
  enabled,
  onChange,
}: {
  label: string;
  icon: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
        enabled
          ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
      <div
        className={`ml-auto w-10 h-5 rounded-full transition-colors ${
          enabled ? "bg-blue-500" : "bg-gray-300"
        } relative`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  );
}

function InputCard({
  title,
  icon,
  color,
  formula,
  inputs,
}: {
  title: string;
  icon: string;
  color: "blue" | "green" | "purple";
  formula?: string;
  inputs: Array<{
    key: string;
    label: string;
    value: number;
    onChange: (value: number) => void;
    type: "number" | "currency" | "percentage";
    format?: (n: number) => string;
    description?: string;
  }>;
}) {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50/50",
    green: "border-green-200 bg-green-50/50",
    purple: "border-purple-200 bg-purple-50/50",
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 ${colorClasses[color]} p-6`}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {formula && (
          <p className="text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md mt-2 font-mono">
            {formula}
          </p>
        )}
      </div>
      <div className="space-y-4">
        {inputs.map((input) => (
          <div key={input.key} className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              {input.label}
            </label>
            {input.description && (
              <p className="text-xs text-gray-500 -mt-0.5">{input.description}</p>
            )}
            <div className="relative">
              <input
                type="number"
                step="any"
                value={input.value}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) input.onChange(value);
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 font-medium"
                placeholder="0"
              />
              {input.type === "currency" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  $
                </span>
              )}
              {input.type === "percentage" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  %
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
