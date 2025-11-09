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
import { Button } from "@/components/ui/Button";

const $$ = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
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

  const handleExportCSV = () => {
    const headers = [
      "Month",
      "Opening ARR",
      "New ARR",
      "Churn ARR",
      "Upsell ARR",
      "Closing ARR",
      "Revenue",
      "Collections",
      "Payroll",
      "Opex",
      "Burn",
      "Cash End",
    ];

    const csvRows = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.m,
          Math.round(r.openingArr),
          Math.round(r.newArr),
          Math.round(r.churnArr),
          Math.round(r.upsellArr),
          Math.round(r.closingArr),
          Math.round(r.revenue),
          Math.round(r.collections),
          Math.round(r.payroll),
          Math.round(r.opex),
          Math.round(r.burn),
          Math.round(r.cashEnd),
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `saas-budget-plan-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex-1 p-6 md:p-10 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl md:text-3xl font-semibold">Plan</h1>
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
          <div className="flex justify-end mb-4">
            <Button onClick={handleExportCSV} variant="secondary">
              Export CSV
            </Button>
          </div>
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
              <Td className="tabular-nums">{$$(r.openingArr)}</Td>
              <Td className="tabular-nums">{$$(r.newArr)}</Td>
              <Td className="tabular-nums">-{$$(r.churnArr)}</Td>
              <Td className="tabular-nums">{$$(r.upsellArr)}</Td>
              <Td className="font-medium tabular-nums">{$$(r.closingArr)}</Td>
              <Td className="tabular-nums">{$$(r.revenue)}</Td>
              <Td className="tabular-nums">{$$(r.collections)}</Td>
              <Td className="tabular-nums">{$$(r.payroll)}</Td>
              <Td className="tabular-nums">{$$(r.opex)}</Td>
              <Td className="tabular-nums">{$$(r.burn)}</Td>
              <Td className="font-medium tabular-nums">{$$(r.cashEnd)}</Td>
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
