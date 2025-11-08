"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  primaryValue: string;
  secondaryValue?: string;
  updated?: string;
  children: ReactNode;
}

export function ChartCard({
  title,
  primaryValue,
  secondaryValue,
  updated,
  children,
}: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="flex items-baseline space-x-3">
            <span className="text-2xl font-bold text-gray-900">
              {primaryValue}
            </span>
            {secondaryValue && (
              <span className="text-sm font-medium text-gray-500">
                {secondaryValue}
              </span>
            )}
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

