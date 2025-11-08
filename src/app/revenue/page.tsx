"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAppStore } from "@/state/store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
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

type RevenueChannel = {
  enabled: boolean;
};

type PlgChannel = RevenueChannel & {
  signups: number;
  conversion_rate: number;
  arpu: number;
  churn_rate: number;
  expansion_rate: number;
};

type SalesChannel = RevenueChannel & {
  pipeline_value: number;
  win_rate: number;
  sales_cycle_months: number;
  acv: number;
  churn_rate: number;
  expansion_rate: number;
};

type PartnersChannel = RevenueChannel & {
  partners_active: number;
  new_partners_per_month: number;
  avg_customers_per_partner: number;
  arpu: number;
  commission_rate: number;
  churn_rate: number;
};

type ForecastRow = {
  month: number;
  newMRR: number;
  expansionMRR: number;
  churnMRR: number;
  netNewMRR: number;
  endingMRR: number;
  ARR: number;
};

export default function RevenueForecastPage() {
  const a = useAppStore((s) => s.a);
  const setAssumptions = useAppStore((s) => s.set);
  
  // Get starting MRR from store (convert ARR to MRR)
  const startingMRRFromStore = a.startArrUsd / 12;
  
  const [settings, setSettings] = useState({
    months: 24,
    starting_mrr: startingMRRFromStore,
  });

  // Sync starting MRR with store when store changes
  useEffect(() => {
    const storeMRR = a.startArrUsd / 12;
    if (Math.abs(storeMRR - settings.starting_mrr) > 0.01) {
      setSettings((prev) => ({ ...prev, starting_mrr: storeMRR }));
    }
  }, [a.startArrUsd, settings.starting_mrr]);

  const [plg, setPlg] = useState<PlgChannel>({
    enabled: true,
    signups: 5000,
    conversion_rate: 0.03,
    arpu: 25,
    churn_rate: 0.04,
    expansion_rate: 0.03,
  });

  const [sales, setSales] = useState<SalesChannel>({
    enabled: true,
    pipeline_value: 150000,
    win_rate: 0.2,
    sales_cycle_months: 2,
    acv: 4800,
    churn_rate: 0.02,
    expansion_rate: 0.05,
  });

  const [partners, setPartners] = useState<PartnersChannel>({
    enabled: false,
    partners_active: 10,
    new_partners_per_month: 2,
    avg_customers_per_partner: 4,
    arpu: 40,
    commission_rate: 0.2,
    churn_rate: 0.03,
  });

  const forecastRevenue = useMemo((): ForecastRow[] => {
    const months = settings.months;
    let mrr = settings.starting_mrr;
    const result: ForecastRow[] = [];

    for (let month = 1; month <= months; month++) {
      let newMRR = 0,
        expansionMRR = 0,
        churnMRR = 0;

      if (plg.enabled) {
        const newUsers = plg.signups * plg.conversion_rate;
        newMRR += newUsers * plg.arpu;
        churnMRR += mrr * plg.churn_rate;
        expansionMRR += mrr * plg.expansion_rate;
      }

      if (sales.enabled) {
        const closedDeals =
          (sales.pipeline_value * sales.win_rate) / sales.sales_cycle_months;
        newMRR += closedDeals / 12; // convert ACV to MRR
        churnMRR += mrr * sales.churn_rate;
        expansionMRR += mrr * sales.expansion_rate;
      }

      if (partners.enabled) {
        // Calculate active partners for this month
        const currentPartners = partners.partners_active + (month - 1) * partners.new_partners_per_month;
        const partnerRevenue =
          currentPartners *
          partners.avg_customers_per_partner *
          partners.arpu *
          (1 - partners.commission_rate);
        newMRR += partnerRevenue;
        churnMRR += mrr * partners.churn_rate;
      }

      const netNewMRR = newMRR + expansionMRR - churnMRR;
      mrr += netNewMRR;

      result.push({
        month,
        newMRR: Math.round(newMRR),
        expansionMRR: Math.round(expansionMRR),
        churnMRR: Math.round(churnMRR),
        netNewMRR: Math.round(netNewMRR),
        endingMRR: Math.round(mrr),
        ARR: Math.round(mrr * 12),
      });
    }

    return result;
  }, [settings, plg, sales, partners]);

  const data = forecastRevenue;

  const InputField = ({
    label,
    value,
    onChange,
    type = "number",
    step = "any",
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    type?: string;
    step?: string;
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  const ChannelCard = ({
    title,
    enabled,
    onToggle,
    children,
  }: {
    title: string;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </label>
      </div>
      {enabled && <div className="space-y-4">{children}</div>}
    </div>
  );

  return (
    <main className="flex-1 p-6 md:p-10 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Revenue Forecast</h1>
          <p className="text-gray-600 mt-2">
            Forecast revenue from multiple channels: Product-Led Growth (PLG), Sales, and Partners
          </p>
        </header>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Forecast Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Forecast Period (Months)"
              value={settings.months}
              onChange={(value) => setSettings({ ...settings, months: value })}
              type="number"
              step="1"
            />
            <InputField
              label="Starting MRR"
              value={settings.starting_mrr}
              onChange={(value) => {
                setSettings({ ...settings, starting_mrr: value });
                // Also update store ARR when MRR changes
                setAssumptions({ startArrUsd: value * 12 });
              }}
            />
            <div className="text-xs text-gray-500 mt-2">
              Current store ARR: {$$(a.startArrUsd)} (MRR: {$$(a.startArrUsd / 12)})
            </div>
          </div>
        </div>

        {/* Channel Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PLG */}
          <ChannelCard
            title="Product-Led Growth (PLG)"
            enabled={plg.enabled}
            onToggle={(enabled) => setPlg({ ...plg, enabled })}
          >
            <InputField
              label="Monthly Signups"
              value={plg.signups}
              onChange={(value) => setPlg({ ...plg, signups: value })}
            />
            <InputField
              label="Conversion Rate (%)"
              value={plg.conversion_rate * 100}
              onChange={(value) => setPlg({ ...plg, conversion_rate: value / 100 })}
            />
            <InputField
              label="ARPU (Monthly)"
              value={plg.arpu}
              onChange={(value) => setPlg({ ...plg, arpu: value })}
            />
            <InputField
              label="Churn Rate (%/month)"
              value={plg.churn_rate * 100}
              onChange={(value) => setPlg({ ...plg, churn_rate: value / 100 })}
            />
            <InputField
              label="Expansion Rate (%/month)"
              value={plg.expansion_rate * 100}
              onChange={(value) => setPlg({ ...plg, expansion_rate: value / 100 })}
            />
          </ChannelCard>

          {/* Sales */}
          <ChannelCard
            title="Sales"
            enabled={sales.enabled}
            onToggle={(enabled) => setSales({ ...sales, enabled })}
          >
            <InputField
              label="Pipeline Value"
              value={sales.pipeline_value}
              onChange={(value) => setSales({ ...sales, pipeline_value: value })}
            />
            <InputField
              label="Win Rate (%)"
              value={sales.win_rate * 100}
              onChange={(value) => setSales({ ...sales, win_rate: value / 100 })}
            />
            <InputField
              label="Sales Cycle (Months)"
              value={sales.sales_cycle_months}
              onChange={(value) => setSales({ ...sales, sales_cycle_months: value })}
            />
            <InputField
              label="ACV (Annual Contract Value)"
              value={sales.acv}
              onChange={(value) => setSales({ ...sales, acv: value })}
            />
            <InputField
              label="Churn Rate (%/month)"
              value={sales.churn_rate * 100}
              onChange={(value) => setSales({ ...sales, churn_rate: value / 100 })}
            />
            <InputField
              label="Expansion Rate (%/month)"
              value={sales.expansion_rate * 100}
              onChange={(value) => setSales({ ...sales, expansion_rate: value / 100 })}
            />
          </ChannelCard>

          {/* Partners */}
          <ChannelCard
            title="Partners"
            enabled={partners.enabled}
            onToggle={(enabled) => setPartners({ ...partners, enabled })}
          >
            <InputField
              label="Active Partners (Starting)"
              value={partners.partners_active}
              onChange={(value) => setPartners({ ...partners, partners_active: value })}
            />
            <InputField
              label="New Partners per Month"
              value={partners.new_partners_per_month}
              onChange={(value) => setPartners({ ...partners, new_partners_per_month: value })}
            />
            <InputField
              label="Avg Customers per Partner"
              value={partners.avg_customers_per_partner}
              onChange={(value) =>
                setPartners({ ...partners, avg_customers_per_partner: value })
              }
            />
            <InputField
              label="ARPU (Monthly)"
              value={partners.arpu}
              onChange={(value) => setPartners({ ...partners, arpu: value })}
            />
            <InputField
              label="Commission Rate (%)"
              value={partners.commission_rate * 100}
              onChange={(value) => setPartners({ ...partners, commission_rate: value / 100 })}
            />
            <InputField
              label="Churn Rate (%/month)"
              value={partners.churn_rate * 100}
              onChange={(value) => setPartners({ ...partners, churn_rate: value / 100 })}
            />
          </ChannelCard>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Forecast</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
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
                  formatter={(value: number) => [$$(value), ""]}
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
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="endingMRR"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: "white" }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "white" }}
                  name="MRR"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-2">Starting MRR</div>
            <div className="text-2xl font-bold text-gray-900">
              {$$(settings.starting_mrr)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-2">Ending MRR</div>
            <div className="text-2xl font-bold text-gray-900">
              {$$(data[data.length - 1]?.endingMRR || 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-2">Ending ARR</div>
            <div className="text-2xl font-bold text-green-600">
              {$$((data[data.length - 1]?.endingMRR || 0) * 12)}
            </div>
            <button
              onClick={() => {
                const endingARR = (data[data.length - 1]?.endingMRR || 0) * 12;
                setAssumptions({ startArrUsd: endingARR });
                // Update local starting MRR to match
                setSettings((prev) => ({ ...prev, starting_mrr: endingARR / 12 }));
              }}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2 underline"
            >
              Update store to this ARR
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-2">Total Growth</div>
            <div className="text-2xl font-bold text-blue-600">
              {settings.starting_mrr > 0
                ? `${(
                    ((data[data.length - 1]?.endingMRR || 0) - settings.starting_mrr) /
                    settings.starting_mrr
                  ).toFixed(1)}x`
                : "N/A"}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Forecast</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  {[
                    "Month",
                    "New MRR",
                    "Expansion MRR",
                    "Churn MRR",
                    "Net New MRR",
                    "Ending MRR",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <tr
                      key={row.month}
                      className={`transition-colors ${
                        isEven ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-blue-50/50`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {row.month}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
                        {$$(row.newMRR)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 text-right tabular-nums">
                        {$$(row.expansionMRR)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 text-right tabular-nums">
                        -{$$(row.churnMRR)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right tabular-nums">
                        {row.netNewMRR >= 0 ? "+" : ""}
                        {$$(row.netNewMRR)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right tabular-nums">
                        {$$(row.endingMRR)}
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
