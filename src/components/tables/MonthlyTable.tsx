/**
 * Monthly table component
 */

import { MonthRow } from "@/lib/calc/types";

interface MonthlyTableProps {
  rows: MonthRow[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function MonthlyTable({ rows }: MonthlyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Month
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Annual Revenue End
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Revenue
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Collections
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Spend
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Burn
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cash
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row) => (
            <tr key={row.m} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap font-medium">
                {row.m}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatCurrency(row.closingArr)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatCurrency(row.revenue)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatCurrency(row.collections)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatCurrency(row.payroll + row.opex)}
              </td>
              <td
                className={`px-4 py-3 whitespace-nowrap font-medium ${
                  row.burn >= 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {formatCurrency(row.burn)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap font-semibold">
                {formatCurrency(row.cashEnd)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

