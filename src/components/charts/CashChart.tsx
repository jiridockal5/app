/**
 * Cash, Collections & Spend area chart
 */

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthRow } from "@/lib/calc/types";

interface CashChartProps {
  rows: MonthRow[];
}

export function CashChart({ rows }: CashChartProps) {
  const data = rows.map((row) => ({
    month: `M${row.m}`,
    Cash: Math.round(row.cashEnd),
    Collections: Math.round(row.collections),
    Spend: Math.round(row.payroll + row.opex),
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="Cash"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="Collections"
            stackId="2"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="Spend"
            stackId="3"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

