"use client";

import { useMemo } from "react";
import { useAppStore } from "@/state/store";
import { buildPlan } from "@/lib/calc/plan";
import type { MonthRow } from "@/lib/calc/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const $$ = (n: number) =>
  n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function PlanPage() {
  const a = useAppStore((s) => s.a);
  const { rows, summary } = useMemo(() => buildPlan(a), [a]);

  const data = rows.map((r) => ({
    month: r.m,
    ARR: Math.round(r.closingArr),
    Revenue: Math.round(r.revenue),
    Collections: Math.round(r.collections),
    Spend: Math.round(r.payroll + r.opex),
    Cash: Math.round(r.cashEnd),
  }));

  return (
    <main className="min-h-screen p-6 md:p-10 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-baseline justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold">Plan</h1>
          <span className="text-sm text-gray-500">
            Five dials → Revenue, Spend, Cash
          </span>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Tile label="ARR (end of year)" value={$$(summary.arrEnd)} />
          <Tile label="Revenue (next month)" value={$$(summary.revenueNext)} />
          <Tile label="Burn (next month)" value={$$(summary.burnNext)} />
          <Tile label="Runway (months)" value={String(summary.runwayMonths)} />
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card title="ARR & Revenue">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ARR" />
                  <Line type="monotone" dataKey="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Cash vs Collections & Spend">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Cash" />
                  <Area type="monotone" dataKey="Collections" />
                  <Area type="monotone" dataKey="Spend" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <Card title="Monthly table">
          <Table rows={rows} />
        </Card>
      </div>
    </main>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl shadow p-4">
      <h3 className="font-medium mb-2">{title}</h3>
      {children}
    </section>
  );
}

function Table({ rows }: { rows: MonthRow[] }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-gray-500">
          <tr>
            <Th>M</Th>
            <Th>Opening ARR</Th>
            <Th>New ARR</Th>
            <Th>Churn</Th>
            <Th>Upsell</Th>
            <Th>Closing ARR</Th>
            <Th>Revenue</Th>
            <Th>Collections</Th>
            <Th>Payroll</Th>
            <Th>Opex</Th>
            <Th>Burn</Th>
            <Th>Cash End</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.m} className="border-t">
              <Td>{r.m}</Td>
              <Td>{$$(r.openingArr)}</Td>
              <Td>{$$(r.newArr)}</Td>
              <Td>-{$$(r.churnArr)}</Td>
              <Td>{$$(r.upsellArr)}</Td>
              <Td className="font-medium">{$$(r.closingArr)}</Td>
              <Td>{$$(r.revenue)}</Td>
              <Td>{$$(r.collections)}</Td>
              <Td>{$$(r.payroll)}</Td>
              <Td>{$$(r.opex)}</Td>
              <Td>{$$(r.burn)}</Td>
              <Td className="font-medium">{$$(r.cashEnd)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="p-2">{children}</th>
);

const Td = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <td className={`p-2 ${className}`}>{children}</td>;
