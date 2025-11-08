/**
 * ARR & Revenue line chart
 */

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthRow } from "@/lib/calc/types";

interface ArrRevenueChartProps {
  rows: MonthRow[];
}

export function ArrRevenueChart({ rows }: ArrRevenueChartProps) {
  const data = rows.map((row) => ({
    month: `M${row.m}`,
    "Annual Revenue": Math.round(row.closingArr),
    "Monthly Revenue": Math.round(row.revenue),
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
          <Line
            type="monotone"
            dataKey="Annual Revenue"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="Monthly Revenue"
            stroke="#10b981"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

